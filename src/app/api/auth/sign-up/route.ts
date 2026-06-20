import { NextRequest } from "next/server";
import { signUp } from "@/lib/auth";
import { PaginationMeta } from "@/types/shipment";

function ok<T>(data: T, meta?: PaginationMeta) {
  return Response.json({ success: true, data, meta }, { status: 200 });
}

function err(error: string, message: string, status = 400) {
  return Response.json({ success: false, error, message }, { status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return err("VALIDATION_ERROR", "Email, password, and name are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return err("VALIDATION_ERROR", "Invalid email format");
  }

  if (password.length < 8) {
    return err("VALIDATION_ERROR", "Password must be at least 8 characters");
  }

  const result = signUp(email, password, name);
  if (!result) {
    return err("EMAIL_EXISTS", "Account already exists", 409);
  }

  const response = ok(result.user);

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
