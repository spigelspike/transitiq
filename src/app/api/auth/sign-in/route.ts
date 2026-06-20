import { NextRequest } from "next/server";
import { signIn } from "@/lib/auth";
import { PaginationMeta } from "@/types/shipment";

function ok<T>(data: T, meta?: PaginationMeta) {
  return Response.json({ success: true, data, meta }, { status: 200 });
}

function err(error: string, message: string, status = 400) {
  return Response.json({ success: false, error, message }, { status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return err("VALIDATION_ERROR", "Email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return err("VALIDATION_ERROR", "Invalid email format");
  }

  const result = signIn(email, password);
  if (!result) {
    return err("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const response = ok(result.user);

  // Clone response to set cookie
  const res = new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });

  res.headers.set(
    "Set-Cookie",
    `auth_token=${result.token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`
  );

  return res;
}
