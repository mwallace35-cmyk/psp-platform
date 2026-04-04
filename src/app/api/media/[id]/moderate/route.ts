import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { mediaModerationSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/lib/api-response";
import { captureError } from "@/lib/error-tracking";
import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid media ID");

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get("x-request-id") || randomUUID();
  const { id } = await params;

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  // Rate limit: 30 moderation actions per minute
  const { success: rateLimitOk, remaining, resetAt } = await rateLimit(
    ip,
    30,
    60000,
    "/api/media/moderate",
    userAgent,
    acceptLanguage
  );

  if (!rateLimitOk) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const idParsed = uuidSchema.safeParse(id);
  if (!idParsed.success) {
    const response = apiError("Invalid media ID", 400, "INVALID_ID");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const response = apiError("Authentication required", 401, "AUTH_REQUIRED");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Admin only
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .limit(1)
      .single();

    if (!roleData) {
      const response = apiError("Admin access required", 403, "FORBIDDEN");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      const response = apiError("Invalid JSON body", 400, "INVALID_JSON");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const parsed = mediaModerationSchema.safeParse(body);
    if (!parsed.success) {
      const response = apiError(
        `Validation error: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
        400,
        "VALIDATION_ERROR"
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const { action, reason } = parsed.data;

    // Get existing media record
    const { data: existing, error: fetchError } = await supabase
      .from("media")
      .select("id, storage_path, status, file_name, mime_type")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      const response = apiError("Media not found", 404, "NOT_FOUND");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    if (existing.status !== "pending") {
      const response = apiError(
        `Media is already ${existing.status}`,
        409,
        "ALREADY_MODERATED"
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const now = new Date().toISOString();

    if (action === "approve") {
      // Cross-bucket move: download from media-pending, upload to media, delete from media-pending
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("media-pending")
        .download(existing.storage_path);

      if (downloadError || !fileData) {
        captureError(downloadError || new Error("No file data"), { endpoint: `/api/media/${id}/moderate`, action: "download_pending" }, { requestId, userId: user.id, path: `/api/media/${id}/moderate`, method: "POST", endpoint: "/api/media/[id]/moderate" });
        const response = apiError("Failed to download pending file", 500, "DOWNLOAD_FAILED");
        response.headers.set("x-request-id", requestId);
        return response;
      }

      // Upload to the public media bucket
      const fileBuffer = Buffer.from(await fileData.arrayBuffer());
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(existing.storage_path, fileBuffer, {
          contentType: existing.mime_type,
          upsert: false,
        });

      if (uploadError) {
        captureError(uploadError, { endpoint: `/api/media/${id}/moderate`, action: "upload_approved" }, { requestId, userId: user.id, path: `/api/media/${id}/moderate`, method: "POST", endpoint: "/api/media/[id]/moderate" });
        const response = apiError("Failed to move file to approved storage", 500, "MOVE_FAILED");
        response.headers.set("x-request-id", requestId);
        return response;
      }

      // Delete from media-pending bucket
      const { error: removeError } = await supabase.storage
        .from("media-pending")
        .remove([existing.storage_path]);

      if (removeError) {
        // Log but don't fail — the file is now in the approved bucket
        captureError(removeError, { endpoint: `/api/media/${id}/moderate`, action: "remove_pending" }, { requestId, userId: user.id, path: `/api/media/${id}/moderate`, method: "POST", endpoint: "/api/media/[id]/moderate" });
      }

      // Update DB record
      const { data: updated, error: updateError } = await supabase
        .from("media")
        .update({
          status: "approved",
          moderated_by: user.id,
          moderated_at: now,
          updated_at: now,
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        captureError(updateError, { endpoint: `/api/media/${id}/moderate`, action: "update_approved" }, { requestId, userId: user.id, path: `/api/media/${id}/moderate`, method: "POST", endpoint: "/api/media/[id]/moderate" });
        const response = apiError("Failed to update media status", 500, "UPDATE_FAILED");
        response.headers.set("x-request-id", requestId);
        return response;
      }

      const response = apiSuccess(updated);
      response.headers.set("X-RateLimit-Remaining", String(remaining));
      response.headers.set("x-request-id", requestId);
      if (resetAt) {
        response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
      }
      return response;
    }

    // action === "reject"
    const { data: updated, error: updateError } = await supabase
      .from("media")
      .update({
        status: "rejected",
        moderated_by: user.id,
        moderated_at: now,
        rejection_reason: reason ?? null,
        updated_at: now,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      captureError(updateError, { endpoint: `/api/media/${id}/moderate`, action: "update_rejected" }, { requestId, userId: user.id, path: `/api/media/${id}/moderate`, method: "POST", endpoint: "/api/media/[id]/moderate" });
      const response = apiError("Failed to update media status", 500, "UPDATE_FAILED");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const response = apiSuccess(updated);
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set("x-request-id", requestId);
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  } catch (error) {
    captureError(error, { endpoint: `/api/media/${id}/moderate` }, { requestId, path: `/api/media/${id}/moderate`, method: "POST", endpoint: "/api/media/[id]/moderate" });
    const response = apiError("Moderation failed", 500, "MODERATION_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
