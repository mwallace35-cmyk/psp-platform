import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiSuccess, apiError } from "@/lib/api-response";
import { captureError } from "@/lib/error-tracking";

export async function POST(request: NextRequest) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
    const response = apiError("Unauthorized", 401, "INVALID_AUTH");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  try {
    const body = await request.json();
    const { path, tag, type = "page" } = body;

    if (tag) {
      revalidateTag(tag, "default");
      const response = apiSuccess({ revalidated: true, tag });
      response.headers.set("x-request-id", requestId);
      return response;
    }

    if (path) {
      revalidatePath(path, type);
      const response = apiSuccess({ revalidated: true, path });
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const response = apiError("Provide path or tag", 400, "MISSING_PARAMS");
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/revalidate" }, { requestId, path: '/api/revalidate', method: 'POST', endpoint: '/api/revalidate' });
    const response = apiError("Failed to process revalidation request", 500, "REVALIDATION_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
