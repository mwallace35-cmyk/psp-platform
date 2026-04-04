import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { mediaUploadSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/lib/api-response";
import { captureError } from "@/lib/error-tracking";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * Determine the storage folder path based on category and associations.
 */
function buildStoragePath(
  mediaType: "photo" | "video",
  category: string,
  fileId: string,
  ext: string,
  associations: { game_id?: number; school_id?: number; player_id?: number }
): string {
  const prefix = mediaType === "photo" ? "photos" : "videos";

  if (associations.game_id) {
    return `${prefix}/games/${associations.game_id}/${fileId}${ext}`;
  }
  if (associations.school_id) {
    return `${prefix}/schools/${associations.school_id}/${fileId}${ext}`;
  }
  if (associations.player_id) {
    return `${prefix}/players/${associations.player_id}/${fileId}${ext}`;
  }
  return `${prefix}/${category}/${fileId}${ext}`;
}

/**
 * Get file extension from MIME type.
 */
function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".webp",
    "image/png": ".webp",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
  };
  return map[mimeType] || ".bin";
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  // Rate limit: 10 uploads per minute
  const { success: rateLimitOk, remaining, resetAt } = await rateLimit(
    ip,
    10,
    60000,
    "/api/media/upload",
    userAgent,
    acceptLanguage
  );

  if (!rateLimitOk) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("x-request-id", requestId);
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  }

  try {
    // 1. Auth check
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

    // 2. Parse multipart form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      const response = apiError("Invalid form data", 400, "INVALID_FORM_DATA");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // 3. Extract file
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      const response = apiError("File is required", 400, "FILE_REQUIRED");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // 4. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      const response = apiError(
        `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
        400,
        "INVALID_FILE_TYPE"
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // 5. Validate size
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

    if (file.size > maxSize) {
      const limitMB = maxSize / (1024 * 1024);
      const response = apiError(
        `File too large. Max ${limitMB}MB for ${isImage ? "images" : "videos"}`,
        400,
        "FILE_TOO_LARGE"
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // 6. Parse and validate metadata fields
    const rawMetadata: Record<string, unknown> = {};
    const metadataFields = [
      "category",
      "caption",
      "sport",
      "game_id",
      "school_id",
      "season_id",
      "player_id",
    ];
    for (const field of metadataFields) {
      const value = formData.get(field);
      if (value !== null && typeof value === "string") {
        rawMetadata[field] = value;
      }
    }

    // Handle tags (may be sent as multiple form values or JSON array)
    const tagsRaw = formData.getAll("tags");
    if (tagsRaw.length > 0) {
      rawMetadata.tags = tagsRaw.map(String);
    }

    const parsed = mediaUploadSchema.safeParse(rawMetadata);
    if (!parsed.success) {
      const response = apiError(
        `Validation error: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
        400,
        "VALIDATION_ERROR"
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }
    const metadata = parsed.data;

    // 7. Check user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "contributor", "moderator"])
      .limit(1)
      .single();

    const userRole = roleData?.role as string | undefined;
    const isPrivileged = userRole === "admin" || userRole === "contributor";

    // Determine bucket and status
    const bucket = isPrivileged ? "media" : "media-pending";
    const status = isPrivileged ? "approved" : "pending";

    // 8. Build storage path
    const fileId = randomUUID();
    const mediaType: "photo" | "video" = isImage ? "photo" : "video";
    const ext = getExtension(file.type);
    const storagePath = buildStoragePath(mediaType, metadata.category, fileId, ext, {
      game_id: metadata.game_id,
      school_id: metadata.school_id,
      player_id: metadata.player_id,
    });

    // 9. Upload to Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      captureError(uploadError, { endpoint: "/api/media/upload", bucket, storagePath }, { requestId, userId: user.id, path: "/api/media/upload", method: "POST", endpoint: "/api/media/upload" });
      const response = apiError("Failed to upload file", 500, "UPLOAD_FAILED");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // 10. Insert media record
    const { data: mediaRecord, error: insertError } = await supabase
      .from("media")
      .insert({
        id: fileId,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        media_type: mediaType,
        status,
        game_id: metadata.game_id ?? null,
        school_id: metadata.school_id ?? null,
        season_id: metadata.season_id ?? null,
        sport: metadata.sport ?? null,
        player_id: metadata.player_id ?? null,
        category: metadata.category,
        caption: metadata.caption ?? null,
        tags: metadata.tags ?? null,
        uploaded_by: user.id,
        is_featured: false,
        sort_order: null,
      })
      .select()
      .single();

    if (insertError) {
      // Attempt to clean up the uploaded file
      await supabase.storage.from(bucket).remove([storagePath]);
      captureError(insertError, { endpoint: "/api/media/upload", fileId }, { requestId, userId: user.id, path: "/api/media/upload", method: "POST", endpoint: "/api/media/upload" });
      const response = apiError("Failed to create media record", 500, "INSERT_FAILED");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // 11. Return the media record
    const response = apiSuccess(mediaRecord, 201);
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set("x-request-id", requestId);
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/media/upload" }, { requestId, path: "/api/media/upload", method: "POST", endpoint: "/api/media/upload" });
    const response = apiError("Upload failed", 500, "UPLOAD_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
