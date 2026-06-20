import {
  mockShipments,
  getDeliverySuccessRate,
  getAverageDeliveryDays,
  getCarrierPerformance,
  applySort,
} from "@/lib/mock-data";
import { PaginationMeta, ShipmentStatus } from "@/types/shipment";

function ok<T>(data: T, meta?: PaginationMeta) {
  return Response.json({ success: true, data, meta }, { status: 200 });
}

// function err(error: string, message: string, status = 400) {
//   return Response.json({ success: false, error, message }, { status });
// }

const ALL_STATUSES: ShipmentStatus[] = [
  "pending",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed",
  "returned",
];

export async function GET() {
  const total = mockShipments.length;

  const byStatus = {} as Record<ShipmentStatus, number>;
  for (const status of ALL_STATUSES) {
    byStatus[status] = mockShipments.filter((s) => s.status === status).length;
  }

  const successRate = getDeliverySuccessRate(mockShipments);
  const avgDeliveryDays = getAverageDeliveryDays(mockShipments);
  const carrierPerformance = getCarrierPerformance(mockShipments);

  const sorted = applySort([...mockShipments], "createdAt", "desc");
  const recentActivity = sorted.slice(0, 8).map((s) => ({
    id: s.id,
    trackingNumber: s.trackingNumber,
    status: s.status,
    recipient: s.recipient,
    createdAt: s.createdAt,
    carrier: s.carrier,
  }));

  return ok({
    total,
    byStatus,
    successRate,
    avgDeliveryDays,
    carrierPerformance,
    recentActivity,
  });
}
