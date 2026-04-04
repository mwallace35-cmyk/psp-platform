import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/lib/api-response";
import { captureError } from "@/lib/error-tracking";
import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid media ID");

const mediaUpdateSchema = z.object({
  caption: z.string().max(500).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  category: z
    .enum(["game_action", "headshot", "team_photo", "highlight_clip", "recap", "other"])
    .optional(),
  game_id: z.number().int().positive().nullable().optional(),
  school_id: z.number().int().positive().nullable().optional(),
  season_id: z.number().int().positive().nullable().optional(),
  player_id: z.number().int().positive().nullable().optional(),
  sport: z.string().nullable().optional(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().int().nullable().optional(),
});

/**
 * GET /api/media/[id] — Retrieve a single media item by UUID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get("x-request-id") || randomUUID();
  const { id } = await params;

  const idParsed = uuidSchema.safeParse(id);
  if (!idParsed.success) {
    const response = apiError("Invalid media ID", 400, "INVALID_ID");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("media")
      .select(
        "id, storage_path, file_name, file_size, mime_type, media_type, width, height, duration_seconds, thumbnail_path, status, moderated_by, moderated_at, rejection_reason, game_id, school_id, season_id, sport, player_id, category, caption, tags, uploaded_by, is_featured, sort_order, created_at, updated_at"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      const response = apiError("Media not found", 404, "NOT_FOUND");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const response = apiSuccess(data);
    response.headers.set("x-request-id", requestId);
    response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return response;
  } catch (error) {
    captureError(error, { endpoint: `/api/media/${id}` }, { requestId, path: `/api/media/${id}`, method: "GET", endpoint: "/api/media/[id]" });
    const response = apiError("Failed to fetch media", 500, "FETCH_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}

/**
 * PATCH /api/media/[id] — Update caption, tags, category, associations
 * Owner or admin only.
 */
export async function PATCH(
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

  const { success: rateLimitOk, remaining, resetAt } = await rateLimit(
    ip,
    20,
    60000,
    "/api/media/update",
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

    // Get existing media record
    const { data: existing, error: fetchError } = await supabase
      .from("media")
      .select("id, uploaded_by")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      const response = apiError("Media not found", 404, "NOT_FOUND");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Check permission: owner or admin
    const isOwner = existing.uploaded_by === user.id;
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .limit(1)
      .single();

    const isAdmin = !!roleData;

    if (!isOwner && !isAdmin) {
      const response = apiError("Forbidden: you can only edit your own media", 403, "FORBIDDEN");
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

    const parsed = mediaUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const response = apiError(
        `Validation error: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
        400,
        "VALIDATION_ERROR"
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Build update payload (only include provided fields)
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const fields = parsed.data;

    if (fields.caption !== undefined) updates.caption = fields.caption;
    if (fields.tags !== undefined) updates.tags = fields.tags;
    if (fields.category !== undefined) updates.category = fields.category;
    if (fields.game_id !== undefined) updates.game_id = fields.game_id;
    if (fields.school_id !== undefined) updates.school_id = fields.school_id;
    if (fields.season_id !== undefined) updates.season_id = fields.season_id;
    if (fields.player_id !== undefined) updates.player_id = fields.player_id;
    if (fields.sport !== undefined) updates.sport = fields.sport;
    if (fields.is_featured !== undefined) updates.is_featured = fields.is_featured;
    if (fields.sort_order !== undefined) updates.sort_order = fields.sort_order;

    const { data: updated, error: updateError } = await supabase
      .from("media")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      captureError(updateError, { endpoint: `/api/media/${id}` }, { requestId, userId: user.id, path: `/api/media/${id}`, method: "PATCH", endpoint: "/api/media/[id]" });
      const response = apiError("Failed to update media", 500, "UPDATE_FAILED");
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
    captureError(error, { endpoint: `/api/media/${id}` }, { requestId, path: `/api/media/${id}`, method: "PATCH", endpoint: "/api/media/[id]" });
    const response = apiError("Update failed", 500, "UPDATE_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}

/**
 * DELETE /api/media/[id] — Admin only. Delete from storage + DB.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get("x-request-id") || randomUUID();
  const { id } = await params;

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

    // Get existing media to find storage path and determine bucket
    const { data: existing, error: fetchError } = await supabase
      .from("media")
      .select("id, storage_path, status")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      const response = apiError("Media not found", 404, "NOT_FOUND");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Determine which bucket the file is in
    const bucket = existing.status === "pending" ? "media-pending" : "media";

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([existing.storage_path]);

    if (storageError) {
      // Log but don't fail — DB record cleanup is more important
      captureError(storageError, { endpoint: `/api/media/${id}`, action: "storage_delete", bucket }, { requestId, userId: user.id, path: `/api/media/${id}`, method: "DELETE", endpoint: "/api/media/[id]" });
    }

    // Delete from DB
    const { error: deleteError } = await supabase
      .from("media")
      .delete()
      .eq("id", id);

    if (deleteError) {
      captureError(deleteError, { endpoint: `/api/media/${id}`, action: "db_delete" }, { requestId, userId: user.id, path: `/api/media/${id}`, method: "DELETE", endpoint: "/api/media/[id]" });
      const response = apiError("Failed to delete media", 500, "DELETE_FAILED");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const response = apiSuccess({ id, deleted: true });
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (error) {
    captureError(error, { endpoint: `/api/media/${id}` }, { requestId, path: `/api/media/${id}`, method: "DELETE", endpoint: "/api/media/[id]" });
    const response = apiError("Delete failed", 500, "DELETE_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
