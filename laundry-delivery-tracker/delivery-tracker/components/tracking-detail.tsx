// "use client"

// import type { Delivery } from "./delivery-tracker"
// import { StatusBadge } from "./status-badge"
// import { MapPin, Calendar, Weight, Truck } from "lucide-react"
// import { Timeline } from "./timeline"

// interface TrackingDetailProps {
//   delivery: Delivery
// }

// export function TrackingDetail({ delivery }: TrackingDetailProps) {
//   return (
//     <div className="flex-1 overflow-y-auto bg-background">
//       <div className="p-8">
//         {/* Header */}
//         <div className="mb-8 space-y-4">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-sm font-mono text-muted-foreground">{delivery.trackingNumber}</p>
//               <h2 className="text-3xl font-bold text-foreground">{delivery.customerName}</h2>
//             </div>
//             <StatusBadge status={delivery.status} />
//           </div>

//           {/* Route */}
//           <div className="flex items-center gap-4 rounded-lg bg-card p-4">
//             <div className="flex-1">
//               <p className="text-xs text-muted-foreground">From</p>
//               <p className="font-semibold text-foreground">{delivery.origin}</p>
//             </div>
//             <Truck className="h-5 w-5 text-accent" />
//             <div className="flex-1 text-right">
//               <p className="text-xs text-muted-foreground">To</p>
//               <p className="font-semibold text-foreground">{delivery.destination}</p>
//             </div>
//           </div>
//         </div>

//         {/* Current Location */}
//         <div className="mb-8 space-y-2 rounded-lg bg-accent/5 p-6 border border-accent/20">
//           <div className="flex items-center gap-2">
//             <MapPin className="h-5 w-5 text-accent" />
//             <p className="text-sm font-semibold text-foreground">Current Location</p>
//           </div>
//           <p className="text-lg font-bold text-foreground">{delivery.currentLocation}</p>
//         </div>

//         {/* Details Grid */}
//         <div className="mb-8 grid grid-cols-3 gap-4">
//           <div className="rounded-lg bg-card p-4">
//             <div className="flex items-center gap-2 mb-2">
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//               <p className="text-xs text-muted-foreground">Est. Delivery</p>
//             </div>
//             <p className="font-semibold text-foreground">{new Date(delivery.estimatedDelivery).toLocaleDateString()}</p>
//           </div>
//           <div className="rounded-lg bg-card p-4">
//             <div className="flex items-center gap-2 mb-2">
//               <Weight className="h-4 w-4 text-muted-foreground" />
//               <p className="text-xs text-muted-foreground">Weight</p>
//             </div>
//             <p className="font-semibold text-foreground">{delivery.weight}</p>
//           </div>
//           <div className="rounded-lg bg-card p-4">
//             <div className="flex items-center gap-2 mb-2">
//               <Truck className="h-4 w-4 text-muted-foreground" />
//               <p className="text-xs text-muted-foreground">Status</p>
//             </div>
//             <p className="font-semibold text-foreground capitalize">{delivery.status.replace("-", " ")}</p>
//           </div>
//         </div>

//         {/* Timeline */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-foreground">Tracking Timeline</h3>
//           <Timeline timeline={delivery.timeline} />
//         </div>
//       </div>
//     </div>
//   )
// }






"use client";

import React, { useEffect, useState } from "react";
import type { Delivery } from "./DeliveryTracker";

interface TrackingDetailProps {
  delivery: Delivery;
  formattedEstimatedDelivery?: string; // deterministic MM/DD/YYYY from parent
}

export default function TrackingDetail({ delivery, formattedEstimatedDelivery }: TrackingDetailProps) {
  // initial text = deterministic prop (same as server) -> prevents mismatch
  const [displayedEstimated, setDisplayedEstimated] = useState<string>(() => {
    return formattedEstimatedDelivery ?? (delivery?.estimatedDelivery ? String(delivery.estimatedDelivery) : "N/A");
  });

  useEffect(() => {
    // Once on client, optionally replace with user's locale-based formatting
    if (!delivery?.estimatedDelivery) return;

    try {
      const dt = new Date(delivery.estimatedDelivery);
      // Only update if valid date
      if (!isNaN(dt.getTime())) {
        // This will not cause hydration mismatch because initial text was deterministic identical
        setDisplayedEstimated(dt.toLocaleDateString());
      }
    } catch {
      // ignore and keep deterministic string
    }
  }, [delivery?.estimatedDelivery]);

  return (
    <div className="w-96 max-w-full bg-card border-l border-border p-4 overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Tracking Details</h3>

      <div className="text-sm mb-3">
        <p className="text-muted-foreground">Customer</p>
        <p className="font-medium">{delivery.customerName}</p>
      </div>

      <div className="text-sm mb-3">
        <p className="text-muted-foreground">Tracking #</p>
        <p className="font-medium">{delivery.trackingNumber}</p>
      </div>

      <div className="text-sm mb-3">
        <p className="text-muted-foreground">Estimated Delivery</p>
        <p className="font-medium">{displayedEstimated}</p>
      </div>

      <div className="text-sm mb-3">
        <p className="text-muted-foreground">Status</p>
        <p className="font-medium">{delivery.status}</p>
      </div>

      <div className="text-sm mb-3">
        <p className="text-muted-foreground">Current Location</p>
        <p className="font-medium">{delivery.currentLocation}</p>
      </div>

      {/* Timeline */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Timeline</p>
        <ul className="text-sm space-y-2">
          {delivery.timeline.map((t, i) => (
            <li key={i} className="flex justify-between">
              <span>{t.status}</span>
              <span className="text-muted-foreground">{t.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

