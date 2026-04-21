/**
 * Streaming proxy for Ted Silary archive images stored in Cloudflare R2.
 *
 * Uploaded by audits/upload_archive_images.py under the key
 *   v2-media/archive/<basename>
 *
 * The bucket is private, so we sign a GetObject on each request and stream
 * the body back with long-lived immutable cache headers. Vercel / CDN edge
 * caching handles the repeat traffic so we don't burn R2 read ops.
 */
import { NextRequest } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";
export const revalidate = false; // image is immutable — let Cache-Control drive

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_BUCKET = process.env.R2_BUCKET || "psp-archive";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;

// Module-level client — single TLS pool across requests
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

function guessContentType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  return (ext && CONTENT_TYPE_BY_EXT[ext]) || "application/octet-stream";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  if (!name || name.includes("/") || name.includes("..")) {
    return new Response("bad name", { status: 400 });
  }

  const key = `v2-media/archive/${name}`;
  try {
    const resp = await s3.send(
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: key })
    );
    const body = resp.Body as ReadableStream | undefined;
    if (!body) return new Response("no body", { status: 502 });

    const contentType = resp.ContentType ?? guessContentType(name);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": resp.ContentLength?.toString() ?? "",
      },
    });
  } catch (err: unknown) {
    // Distinguish 404 from everything else for proper CDN caching of the miss
    const code = (err as { name?: string; $metadata?: { httpStatusCode?: number } } | null)?.$metadata?.httpStatusCode
      ?? ((err as { name?: string })?.name === "NoSuchKey" ? 404 : 500);
    return new Response("image not found", {
      status: code === 404 ? 404 : 500,
      headers: code === 404
        ? { "Cache-Control": "public, max-age=300" } // cache missed lookups briefly
        : {},
    });
  }
}
