import { NextRequest } from "next/server";
import { getShipmentById } from "@/lib/mock-data";
import { PaginationMeta } from "@/types/shipment";

function ok<T>(data: T, meta?: PaginationMeta) {
  return Response.json({ success: true, data, meta }, { status: 200 });
}

function err(error: string, message: string, status = 400) {
  return Response.json({ success: false, error, message }, { status });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shipment = getShipmentById(id);

  if (!shipment) {
    return err("NOT_FOUND", "Shipment not found", 404);
  }

  return ok(shipment);
}
