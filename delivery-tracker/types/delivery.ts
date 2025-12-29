export interface OrderTimeline {
  status: "Order Confirmed" | "Picked Up" | "In Transit" | "Out for Delivery" | "Delivered"
  timestamp: string
  description: string
}

export const TIMELINE_STEPS: OrderTimeline["status"][] = [
  "Order Confirmed",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
]

export function getTimelineStepIndex(status: OrderTimeline["status"]): number {
  return TIMELINE_STEPS.indexOf(status)
}
