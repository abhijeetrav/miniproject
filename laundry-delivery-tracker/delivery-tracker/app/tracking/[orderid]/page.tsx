"use client"

import { use } from "react"
import { LiveDeliveryTracker } from "@/components/live-delivery-tracker"

interface TrackingPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default function TrackingPage({ params }: TrackingPageProps) {
  const { orderId } = use(params)

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-foreground">Delivery Tracker</h1>
          <p className="text-muted-foreground">Track your laundry delivery in real-time</p>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden">
          <LiveDeliveryTracker orderId={orderId} />
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Demo Information:</strong> This tracker requires the Socket.IO backend server to be running on
            localhost:4000. See setup instructions in the documentation.
          </p>
        </div>
      </div>
    </main>
  )
}
