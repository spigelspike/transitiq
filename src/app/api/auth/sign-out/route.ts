import { PaginationMeta } from "@/types/shipment";

function ok<T>(data: T, meta?: PaginationMeta) {
  return Response.json({ success: true, data, meta }, { status: 200 });
}

// function err(error: string, message: string, status = 400) {
//   return Response.json({ success: false, error, message }, { status });
// }

export async function POST() {
  const response = ok(null);

  const res = new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });

  res.headers.set(
    "Set-Cookie",
    `auth_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
  );

  return res;
}
