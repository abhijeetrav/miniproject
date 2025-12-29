"use client"

import { CheckCircle2, Clock, MapPin, Truck } from "lucide-react"

interface TrackingTimelineProps {
  status: "in-transit" | "ready" | "delivered"
}

export function TrackingTimeline({ status }: TrackingTimelineProps) {
  const events = [
    {
      id: 1,
      title: "Order Confirmed",
      time: "10:30 AM",
      completed: true,
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: "Laundry Processing",
      time: "11:00 AM - 2:00 PM",
      completed: status !== "ready",
      icon: Clock,
    },
    {
      id: 3,
      title: "Out for Delivery",
      time: "Today 3:30 PM",
      completed: status === "in-transit" || status === "delivered",
      icon: Truck,
      active: status === "in-transit",
    },
    {
      id: 4,
      title: "Delivered",
      time: "Expected 4:00 PM",
      completed: status === "delivered",
      icon: MapPin,
    },
  ]

  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const Icon = event.icon
        return (
          <div key={event.id} className="flex gap-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  event.completed
                    ? "bg-accent border-accent"
                    : event.active
                      ? "bg-primary border-primary animate-pulse"
                      : "bg-secondary border-border"
                }`}
              >
                <Icon size={20} className={event.completed || event.active ? "text-white" : "text-muted-foreground"} />
              </div>
              {index < events.length - 1 && (
                <div className={`w-1 h-12 my-2 ${event.completed ? "bg-accent" : "bg-border"}`} />
              )}
            </div>

            {/* Event Content */}
            <div className="flex-1 pt-1">
              <h4
                className={`font-semibold text-sm mb-1 ${
                  event.completed || event.active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {event.title}
              </h4>
              <p className="text-xs text-muted-foreground">{event.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
