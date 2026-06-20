import {
  Shipment,
  ShipmentStatus,
  CarrierName,
  TrackingEvent,
  PaginationMeta
} from "@/types/shipment";

const INDIA_CITIES = [
  { city: "New Delhi", state: "DL", country: "India", zip: "110001" },
  { city: "Mumbai", state: "MH", country: "India", zip: "400001" },
  { city: "Bengaluru", state: "KA", country: "India", zip: "560001" },
  { city: "Chennai", state: "TN", country: "India", zip: "600001" },
  { city: "Kolkata", state: "WB", country: "India", zip: "700001" },
  { city: "Hyderabad", state: "TG", country: "India", zip: "500001" },
  { city: "Pune", state: "MH", country: "India", zip: "411001" },
  { city: "Ahmedabad", state: "GJ", country: "India", zip: "380001" },
  { city: "Jaipur", state: "RJ", country: "India", zip: "302001" },
  { city: "Surat", state: "GJ", country: "India", zip: "395001" },
  { city: "Lucknow", state: "UP", country: "India", zip: "226001" },
  { city: "Kanpur", state: "UP", country: "India", zip: "208001" },
];

const INTL_CITIES = [
  { city: "London", state: "ENG", country: "UK", zip: "EC1A 1BB" },
  { city: "Toronto", state: "ON", country: "Canada", zip: "M5H 2N2" },
  { city: "New York", state: "NY", country: "USA", zip: "10001" },
  { city: "Dubai", state: "DU", country: "UAE", zip: "00000" },
];

const CARRIERS: CarrierName[] = ["FedEx", "UPS", "DHL", "USPS", "BlueDart"];
const STATUSES: ShipmentStatus[] = ["pending", "in_transit", "out_for_delivery", "delivered", "failed", "returned"];
const ITEMS = ["Electronics", "Clothing", "Medical Supplies", "Auto Parts", "Books", "Furniture", "Food Products"];
const HUMAN_NAMES = [
  "Muhammed Shareef", "Ameen Rahman", "Fathima Nisha", "Ayesha Shirin",
  "Abdul Basith", "Shahid Ali", "Rizwan Ahmed", "Nihal Mohammed",
  "Aswin Krishna", "Arjun Nair", "Adithya Menon", "Vishnu Prasad",
  "Athira Nair", "Anjali Menon", "Keerthana S", "Megha Krishnan",
  "Sreya Nair", "Devika Menon", "Farhan P K", "Junaid K T",
  "Sandra Thomas", "Akhil Raj", "Nandana M", "Muhsin P"
];

function generateTrackingNumber(carrier: CarrierName, idNum: number): string {
  const seed = idNum.toString().padStart(6, "0");
  switch (carrier) {
    case "FedEx": return `7840${seed}08`; // 12 digits
    case "UPS": return `1Z999AA10${seed}4`; // 1Z + 16 alphanum
    case "DHL": return `3318${seed}`; // 10 digits
    case "USPS": return `94001118992233${seed}08`; // 22 digits
    case "BlueDart": return `BLU73${seed}`; // BLU + 8 digits
  }
}

// Pseudo-random generator for determinism
let seed = 12345;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function randomInt(min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

function generateEvents(status: ShipmentStatus, createdAt: Date, actualDelivery?: Date): TrackingEvent[] {
  const events: TrackingEvent[] = [];
  const numEvents = randomInt(3, 8);

  // Distribute event times between createdAt and now/actualDelivery
  const endTime = actualDelivery ? actualDelivery.getTime() : Date.now();
  const startTime = createdAt.getTime();

  // Start event
  events.push({
    id: `EVT-${randomInt(1000, 9999)}`,
    timestamp: new Date(startTime).toISOString(),
    location: "Sender Facility",
    description: "Shipment information received",
    status: "pending"
  });

  const statusesProgression: ShipmentStatus[] = ["pending", "in_transit"];
  if (status === "out_for_delivery" || status === "delivered" || status === "failed") {
    statusesProgression.push("out_for_delivery");
  }
  if (status === "returned") statusesProgression.push("returned");

  for (let i = 1; i < numEvents - 1; i++) {
    const eventTime = startTime + ((endTime - startTime) * (i / numEvents));
    const loc = randomItem(INDIA_CITIES).city;
    events.push({
      id: `EVT-${randomInt(1000, 9999)}`,
      timestamp: new Date(eventTime).toISOString(),
      location: `${loc} Sorting Center`,
      description: "Package arrived at sorting facility",
      status: "in_transit"
    });
  }

  // Last event matches current status
  events.push({
    id: `EVT-${randomInt(1000, 9999)}`,
    timestamp: new Date(endTime).toISOString(),
    location: status === "delivered" ? "Destination" : (status === "returned" ? "Return Center" : "Local Facility"),
    description: `Shipment is ${status.replace(/_/g, " ")}`,
    status: status
  });

  return events;
}

function generateMockData(): Shipment[] {
  const shipments: Shipment[] = [];
  let idCounter = 1;

  for (const status of STATUSES) {
    for (let i = 0; i < 10; i++) {
      const carrier = randomItem(CARRIERS);
      const isIntl = random() > 0.9; // approx 10% international (5-6 total)
      const origin = randomItem(INDIA_CITIES);
      const destination = isIntl ? randomItem(INTL_CITIES) : randomItem(INDIA_CITIES);
      const trackingNumber = generateTrackingNumber(carrier, idCounter);
      const customerName = randomItem(HUMAN_NAMES);

      const daysAgo = randomInt(1, 45);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const estDeliveryOffset = randomInt(-10, 14);
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + estDeliveryOffset);

      let actualDelivery: Date | undefined = undefined;
      if (status === "delivered" || status === "returned") {
        actualDelivery = new Date(createdAt);
        actualDelivery.setDate(actualDelivery.getDate() + randomInt(1, 15));
        // Cap actual delivery to now so it's not in the future
        if (actualDelivery.getTime() > Date.now()) {
          actualDelivery = new Date();
        }
      }

      shipments.push({
        id: `SHP${idCounter.toString().padStart(3, "0")}`,
        trackingNumber,
        status,
        carrier: {
          name: carrier,
          trackingNumber,
          service: `${carrier} Express`,
        },
        origin: {
          name: `${origin.city} Hub`,
          street: `123 ${origin.city} Blvd`,
          city: origin.city,
          state: origin.state,
          country: origin.country,
          zip: origin.zip
        },
        destination: {
          name: customerName,
          street: `456 Main St`,
          city: destination.city,
          state: destination.state,
          country: destination.country,
          zip: destination.zip
        },
        sender: `Company ${randomItem(["A", "B", "C", "X", "Y", "Z"])}`,
        recipient: customerName,
        weight: `${(random() * 27.7 + 0.3).toFixed(1)} kg`,
        dimensions: `${randomInt(10, 50)}x${randomInt(10, 50)}x${randomInt(10, 50)} cm`,
        description: randomItem(ITEMS),
        createdAt: createdAt.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
        actualDelivery: actualDelivery?.toISOString(),
        events: generateEvents(status, createdAt, actualDelivery),
      });

      idCounter++;
    }
  }

  return shipments;
}

export const mockShipments = generateMockData();

export function getShipmentById(id: string): Shipment | undefined {
  return mockShipments.find((s) => s.id === id);
}

export function applySearch(shipments: Shipment[], query: string): Shipment[] {
  if (!query) return shipments;
  const lowerQuery = query.toLowerCase();
  return shipments.filter((s) =>
    s.trackingNumber.toLowerCase().includes(lowerQuery) ||
    s.recipient.toLowerCase().includes(lowerQuery) ||
    s.sender.toLowerCase().includes(lowerQuery) ||
    s.description.toLowerCase().includes(lowerQuery) ||
    s.carrier.trackingNumber.toLowerCase().includes(lowerQuery)
  );
}

export function applyStatusFilter(shipments: Shipment[], status: ShipmentStatus | "all"): Shipment[] {
  if (status === "all") return shipments;
  return shipments.filter((s) => s.status === status);
}

export function applySort(shipments: Shipment[], sortBy: string, order: "asc" | "desc"): Shipment[] {
  return [...shipments].sort((a, b) => {
    let valA: any = a[sortBy as keyof Shipment];
    let valB: any = b[sortBy as keyof Shipment];

    if (sortBy === "createdAt" || sortBy === "estimatedDelivery") {
      valA = new Date(valA as string).getTime();
      valB = new Date(valB as string).getTime();
    }

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
}

export function applyPagination(
  shipments: Shipment[], page: number, limit: number
): { items: Shipment[]; meta: PaginationMeta } {
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = shipments.slice(start, end);
  return {
    items,
    meta: {
      total: shipments.length,
      page,
      limit,
      totalPages: Math.ceil(shipments.length / limit)
    }
  };
}

export function getDeliverySuccessRate(shipments: Shipment[]): number {
  const totalFinished = shipments.filter(s => s.status === "delivered" || s.status === "failed" || s.status === "returned").length;
  if (totalFinished === 0) return 0;
  const delivered = shipments.filter(s => s.status === "delivered").length;
  return Number(((delivered / totalFinished) * 100).toFixed(1));
}

export function getAverageDeliveryDays(shipments: Shipment[]): number {
  const delivered = shipments.filter(s => s.status === "delivered" && s.actualDelivery);
  if (delivered.length === 0) return 0;

  const totalDays = delivered.reduce((acc, s) => {
    const created = new Date(s.createdAt).getTime();
    const actual = new Date(s.actualDelivery!).getTime();
    const days = (actual - created) / (1000 * 60 * 60 * 24);
    return acc + days;
  }, 0);

  return Number((totalDays / delivered.length).toFixed(1));
}

export function getCarrierPerformance(shipments: Shipment[]): Array<{
  carrier: CarrierName
  total: number
  delivered: number
  failed: number
  successRate: number
  avgDays: number
}> {
  const CARRIERS: CarrierName[] = ["FedEx", "UPS", "DHL", "USPS", "BlueDart"];

  return CARRIERS.map(carrier => {
    const carrierShipments = shipments.filter(s => s.carrier.name === carrier);
    const total = carrierShipments.length;
    const delivered = carrierShipments.filter(s => s.status === "delivered").length;
    const failed = carrierShipments.filter(s => s.status === "failed" || s.status === "returned").length;

    let successRate = 0;
    const finished = delivered + failed;
    if (finished > 0) {
      successRate = (delivered / finished) * 100;
    }

    const deliveredShipments = carrierShipments.filter(s => s.status === "delivered" && s.actualDelivery);
    let avgDays = 0;
    if (deliveredShipments.length > 0) {
      const totalDays = deliveredShipments.reduce((acc, s) => {
        const created = new Date(s.createdAt).getTime();
        const actual = new Date(s.actualDelivery!).getTime();
        return acc + ((actual - created) / (1000 * 60 * 60 * 24));
      }, 0);
      avgDays = totalDays / deliveredShipments.length;
    }

    return {
      carrier,
      total,
      delivered,
      failed,
      successRate: Number(successRate.toFixed(1)),
      avgDays: Number(avgDays.toFixed(1))
    };
  });
}
