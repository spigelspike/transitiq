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
  // Simulated 7-day trend data for the area chart
  const trendData = [
    { date: "May 12", value: 89 },
    { date: "May 13", value: 90 },
    { date: "May 14", value: 93 },
    { date: "May 15", value: 92 },
    { date: "May 16", value: 96 },
    { date: "May 17", value: 95 },
    { date: "May 18", value: 98 },
  ];

  return ok({
    total,
    byStatus,
    successRate,
    avgDeliveryDays,
    carrierPerformance,
    recentActivity,
    trendData,
  });
}
