import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://jio-finserve-backend.onrender.com";

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const fullPath = path.join("/");
  const url = `${BACKEND_URL}/api/${fullPath}`;

  // Strip headers that cause the backend's CORS middleware to reject the request
  const headers = new Headers();
  const authHeader = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  if (authHeader) headers.set("authorization", authHeader);
  if (contentType) headers.set("content-type", contentType);

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : undefined;

  const backendRes = await fetch(url, {
    method: request.method,
    headers,
    body,
  });

  const data = await backendRes.arrayBuffer();

  return new NextResponse(data, {
    status: backendRes.status,
    headers: {
      "content-type":
        backendRes.headers.get("content-type") || "application/json",
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
