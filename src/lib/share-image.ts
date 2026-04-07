/**
 * Client-side helper for sharing a pre-generated image via the native
 * Web Share API. On modern mobile browsers this surfaces Instagram, TikTok,
 * Snapchat, etc. in the share sheet (Instagram Stories specifically on iOS 15+
 * and most Android share targets).
 *
 * Desktop browsers almost never support navigator.canShare({ files }). In
 * that case this helper returns `"unsupported"` and the caller should open
 * the fallback modal (preview + download + copy-caption).
 */

export type ShareImageResult =
  | "shared"
  | "cancelled"
  | "unsupported"
  | "error";

export interface ShareImageOptions {
  imageUrl: string;
  caption: string;
  title?: string;
  filename?: string;
}

async function urlToFile(
  url: string,
  filename: string,
): Promise<File> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch share image: ${res.status}`);
  }
  const blob = await res.blob();
  const type = blob.type || "image/png";
  return new File([blob], filename, { type });
}

function canShareFiles(files: File[]): boolean {
  if (typeof navigator === "undefined") return false;
  if (!("share" in navigator) || !("canShare" in navigator)) return false;
  try {
    return (navigator as Navigator & {
      canShare: (data: ShareData) => boolean;
    }).canShare({ files });
  } catch {
    return false;
  }
}

export async function shareImage(
  opts: ShareImageOptions,
): Promise<ShareImageResult> {
  if (typeof window === "undefined") return "unsupported";

  const filename = opts.filename ?? "phillysportspack.png";

  let file: File;
  try {
    file = await urlToFile(opts.imageUrl, filename);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[shareImage] fetch failed", err);
    }
    return "error";
  }

  if (!canShareFiles([file])) {
    return "unsupported";
  }

  try {
    await (navigator as Navigator).share({
      files: [file],
      title: opts.title,
      text: opts.caption,
    });
    return "shared";
  } catch (err) {
    // AbortError = user dismissed the share sheet
    if ((err as DOMException)?.name === "AbortError") {
      return "cancelled";
    }
    if (process.env.NODE_ENV === "development") {
      console.error("[shareImage] navigator.share failed", err);
    }
    return "error";
  }
}

/**
 * Fallback for desktop: programmatically download the image.
 */
export async function downloadShareImage(
  imageUrl: string,
  filename = "phillysportspack.png",
): Promise<void> {
  const res = await fetch(imageUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch share image: ${res.status}`);
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Release after the click handler has had a chance to start the download
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5_000);
}
