import { NextRequest } from "next/server";
import {
  mockShipments,
  applySearch,
  applyStatusFilter,
  applySort,
  applyPagination,
} from "@/lib/mock-data";
import { PaginationMeta, ShipmentStatus } from "@/types/shipment";

function ok<T>(data: T, meta?: PaginationMeta) {
  return Response.json({ success: true, data, meta }, { status: 200 });
}

// function err(error: string, message: string, status = 400) {
//   return Response.json({ success: false, error, message }, { status });
// }

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
  const search = searchParams.get("search") || "";
  const status = (searchParams.get("status") || "all") as ShipmentStatus | "all";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  let result = [...mockShipments];
  result = applySearch(result, search);
  result = applyStatusFilter(result, status);
  result = applySort(result, sortBy, order);
  const { items, meta } = applyPagination(result, page, limit);

  return ok(items, meta);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
