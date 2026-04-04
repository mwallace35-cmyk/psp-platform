"use client";

import { useState, useCallback } from "react";

interface UploadMetadata {
  category: string;
  caption: string;
  sport?: string;
  game_id?: number;
  school_id?: number;
  season_id?: number;
  player_id?: number;
  tags?: string[];
}

interface UseMediaUploadReturn {
  upload: (file: File, metadata: UploadMetadata) => Promise<any>;
  uploading: boolean;
  error: string | null;
  reset: () => void;
}

const PHOTO_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100MB
const PHOTO_MIMES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_MIMES = ["video/mp4", "video/webm"];
const ALL_MIMES = [...PHOTO_MIMES, ...VIDEO_MIMES];
const MAX_IMAGE_WIDTH = 2000;
const WEBP_QUALITY = 0.8;

function isPhoto(mime: string): boolean {
  return PHOTO_MIMES.includes(mime);
}

function isVideo(mime: string): boolean {
  return VIDEO_MIMES.includes(mime);
}

/**
 * Compress an image file using Canvas API.
 * Resizes to max 2000px width and converts to WebP at quality 0.8.
 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Only downscale, never upscale
      if (width > MAX_IMAGE_WIDTH) {
        const ratio = MAX_IMAGE_WIDTH / width;
        width = MAX_IMAGE_WIDTH;
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image"));
            return;
          }

          const compressed = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".webp"),
            { type: "image/webp" }
          );
          resolve(compressed);
        },
        "image/webp",
        WEBP_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = url;
  });
}

export function useMediaUpload(): UseMediaUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setError(null);
    setUploading(false);
  }, []);

  const upload = useCallback(
    async (file: File, metadata: UploadMetadata) => {
      setError(null);
      setUploading(true);

      try {
        // Validate MIME type
        if (!ALL_MIMES.includes(file.type)) {
          throw new Error(
            `Unsupported file type: ${file.type}. Accepted: JPEG, PNG, WebP, MP4, WebM.`
          );
        }

        // Validate file size
        if (isPhoto(file.type) && file.size > PHOTO_MAX_SIZE) {
          throw new Error(
            `Photo too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 10MB.`
          );
        }
        if (isVideo(file.type) && file.size > VIDEO_MAX_SIZE) {
          throw new Error(
            `Video too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 100MB.`
          );
        }

        // Compress photos client-side
        let processedFile = file;
        if (isPhoto(file.type)) {
          processedFile = await compressImage(file);
        }

        // Build FormData
        const formData = new FormData();
        formData.append("file", processedFile);
        formData.append("category", metadata.category);
        formData.append("caption", metadata.caption);
        if (metadata.sport) formData.append("sport", metadata.sport);
        if (metadata.game_id != null)
          formData.append("game_id", String(metadata.game_id));
        if (metadata.school_id != null)
          formData.append("school_id", String(metadata.school_id));
        if (metadata.season_id != null)
          formData.append("season_id", String(metadata.season_id));
        if (metadata.player_id != null)
          formData.append("player_id", String(metadata.player_id));
        if (metadata.tags && metadata.tags.length > 0) {
          formData.append("tags", JSON.stringify(metadata.tags));
        }

        // Upload via fetch
        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Upload failed (${res.status})`);
        }

        const data = await res.json();
        return data;
      } catch (err: any) {
        const message = err.message || "Upload failed";
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return { upload, uploading, error, reset };
}
