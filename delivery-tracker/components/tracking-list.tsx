"use client"

import type { Delivery } from "./delivery-tracker"
import { StatusBadge } from "./status-badge"
import { Search } from "lucide-react"

interface TrackingListProps {
  deliveries: Delivery[]
  selectedDelivery: Delivery | null
  onSelectDelivery: (delivery: Delivery) => void
}

export function TrackingList({ deliveries, selectedDelivery, onSelectDelivery }: TrackingListProps) {
  return (
    <div className="w-full max-w-md flex-shrink-0 border-r border-border bg-card flex flex-col">
      <div className="border-b border-border p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tracking number..."
            className="w-full rounded-lg bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground outline-none ring-ring focus:ring-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {deliveries.map((delivery) => (
          <button
            key={delivery.id}
            onClick={() => onSelectDelivery(delivery)}
            className={`w-full border-b border-border px-6 py-4 text-left transition-colors ${
              selectedDelivery?.id === delivery.id ? "bg-accent/10" : "hover:bg-background"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono text-muted-foreground">{delivery.trackingNumber}</span>
                <StatusBadge status={delivery.status} />
              </div>
              <p className="font-medium text-foreground">{delivery.customerName}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  {delivery.origin} → {delivery.destination}
                </p>
                <p>Est. {new Date(delivery.estimatedDelivery).toLocaleDateString()}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
