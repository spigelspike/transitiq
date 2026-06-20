import { NextRequest } from "next/server";
import { verifyToken, getUserById } from "@/lib/auth";
import { PaginationMeta } from "@/types/shipment";

function ok<T>(data: T, meta?: PaginationMeta) {
  return Response.json({ success: true, data, meta }, { status: 200 });
}

function err(error: string, message: string, status = 400) {
  return Response.json({ success: false, error, message }, { status });
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return err("UNAUTHORIZED", "Authentication required", 401);
  }

  const payload = verifyToken(token);
  if (!payload) {
    return err("UNAUTHORIZED", "Invalid or expired token", 401);
  }

  const user = getUserById(payload.userId);
  if (!user) {
    return err("UNAUTHORIZED", "User not found", 401);
  }

  return ok(user);
}
