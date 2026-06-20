export type ShipmentStatus =
  | "pending" | "in_transit" | "out_for_delivery"
  | "delivered" | "failed" | "returned"

export type CarrierName = "FedEx" | "UPS" | "DHL" | "USPS" | "BlueDart"

export interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  description: string
  status: ShipmentStatus
}

export interface Address {
  name: string
  street: string
  city: string
  state: string
  country: string
  zip: string
}

export interface Carrier {
  name: CarrierName
  trackingNumber: string
  service: string
}

export interface Shipment {
  id: string
  trackingNumber: string
  status: ShipmentStatus
  carrier: Carrier
  origin: Address
  destination: Address
  sender: string
  recipient: string
  weight: string
  dimensions: string
  description: string
  createdAt: string
  estimatedDelivery: string
  actualDelivery?: string
  events: TrackingEvent[]
}

export interface PaginationMeta {
  total: number; 
  page: number; 
  limit: number; 
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true; 
  data: T; 
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false; 
  error: string; 
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
