import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="w-full md:w-80">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Row 1: Shipment Health */}
      <Skeleton className="h-[250px] w-full rounded-2xl" />

      {/* Row 2: Insights & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[200px] w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>

      {/* Row 3: Recent Shipments Table */}
      <Skeleton className="h-[400px] w-full rounded-2xl" />
    </div>
  );
}
