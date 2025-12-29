"use client"

import { useState } from "react"
import { TrackingHeader } from "./tracking-header"
import { TrackingList } from "./tracking-list"
import { TrackingDetail } from "./tracking-detail"

export interface Delivery {
  id: string
  trackingNumber: string
  customerName: string
  origin: string
  destination: string
  status: "pending" | "picked-up" | "in-transit" | "out-for-delivery" | "delivered"
  weight: string
  estimatedDelivery: string
  currentLocation: string
  timeline: Array<{
    status: string
    timestamp: string
    location: string
  }>
}

const mockDeliveries: Delivery[] = [
  {
    id: "1",
    trackingNumber: "TRK-2024-001",
    customerName: "John Anderson",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    status: "in-transit",
    weight: "2.5 kg",
    estimatedDelivery: "2024-11-15",
    currentLocation: "Phoenix, AZ",
    timeline: [
      { status: "Order Placed", timestamp: "2024-11-08 10:30 AM", location: "New York, NY" },
      { status: "Package Picked Up", timestamp: "2024-11-08 02:15 PM", location: "New York, NY" },
      { status: "In Transit", timestamp: "2024-11-10 08:45 AM", location: "Chicago, IL" },
      { status: "Current Location", timestamp: "2024-11-12 04:30 PM", location: "Phoenix, AZ" },
    ],
  },
  {
    id: "2",
    trackingNumber: "TRK-2024-002",
    customerName: "Sarah Mitchell",
    origin: "Seattle, WA",
    destination: "Miami, FL",
    status: "out-for-delivery",
    weight: "1.8 kg",
    estimatedDelivery: "2024-11-13",
    currentLocation: "Miami, FL",
    timeline: [
      { status: "Order Placed", timestamp: "2024-11-09 09:00 AM", location: "Seattle, WA" },
      { status: "Package Picked Up", timestamp: "2024-11-09 11:30 AM", location: "Seattle, WA" },
      { status: "In Transit", timestamp: "2024-11-11 03:00 PM", location: "Denver, CO" },
      { status: "Out for Delivery", timestamp: "2024-11-13 08:00 AM", location: "Miami, FL" },
    ],
  },
  {
    id: "3",
    trackingNumber: "TRK-2024-003",
    customerName: "Mike Thompson",
    origin: "Boston, MA",
    destination: "San Francisco, CA",
    status: "delivered",
    weight: "3.2 kg",
    estimatedDelivery: "2024-11-11",
    currentLocation: "San Francisco, CA",
    timeline: [
      { status: "Order Placed", timestamp: "2024-11-07 02:00 PM", location: "Boston, MA" },
      { status: "Package Picked Up", timestamp: "2024-11-07 04:30 PM", location: "Boston, MA" },
      { status: "In Transit", timestamp: "2024-11-09 10:00 AM", location: "Kansas City, MO" },
      { status: "Delivered", timestamp: "2024-11-11 06:15 PM", location: "San Francisco, CA" },
    ],
  },
  {
    id: "4",
    trackingNumber: "TRK-2024-004",
    customerName: "Emily Rodriguez",
    origin: "Austin, TX",
    destination: "Portland, OR",
    status: "picked-up",
    weight: "1.5 kg",
    estimatedDelivery: "2024-11-16",
    currentLocation: "Austin, TX",
    timeline: [
      { status: "Order Placed", timestamp: "2024-11-12 11:15 AM", location: "Austin, TX" },
      { status: "Package Picked Up", timestamp: "2024-11-12 03:45 PM", location: "Austin, TX" },
    ],
  },
]

export function DeliveryTracker() {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(mockDeliveries[0])

  return (
    <div className="flex h-screen flex-col bg-background">
      <TrackingHeader />
      <div className="flex flex-1 overflow-hidden">
        <TrackingList
          deliveries={mockDeliveries}
          selectedDelivery={selectedDelivery}
          onSelectDelivery={setSelectedDelivery}
        />
        {selectedDelivery && <TrackingDetail delivery={selectedDelivery} />}
      </div>
    </div>
  )
}
