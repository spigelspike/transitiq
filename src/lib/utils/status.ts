import { ShipmentStatus } from "@/types/shipment";

type StatusConfig = {
  label: string;
  badgeClass: string;
  dotClass: string;
  iconName: string;
  description: string;
  progressValue: number;
};

const STATUS_MAP: Record<ShipmentStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-400",
    iconName: "Clock",
    description: "Awaiting carrier pickup",
    progressValue: 10,
  },
  in_transit: {
    label: "In Transit",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-400",
    iconName: "Truck",
    description: "Shipment is on the way",
    progressValue: 50,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    badgeClass: "bg-violet-100 text-violet-800 border-violet-200",
    dotClass: "bg-violet-400",
    iconName: "MapPin",
    description: "With courier, delivery today",
    progressValue: 85,
  },
  delivered: {
    label: "Delivered",
    badgeClass: "bg-green-100 text-green-800 border-green-200",
    dotClass: "bg-green-400",
    iconName: "CheckCircle2",
    description: "Successfully delivered",
    progressValue: 100,
  },
  failed: {
    label: "Failed",
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    dotClass: "bg-red-400",
    iconName: "XCircle",
    description: "Delivery attempt failed",
    progressValue: 50,
  },
  returned: {
    label: "Returned",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
    dotClass: "bg-orange-400",
    iconName: "RotateCcw",
    description: "Package returned to sender",
    progressValue: 30,
  },
};

export function getStatusConfig(status: ShipmentStatus): StatusConfig {
  return STATUS_MAP[status];
}
