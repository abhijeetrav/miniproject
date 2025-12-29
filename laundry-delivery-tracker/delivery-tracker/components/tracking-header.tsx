import { Package } from "lucide-react"

export function TrackingHeader() {
  return (
    <header className="border-b border-border bg-card px-8 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Delivery Tracker</h1>
          <p className="text-sm text-muted-foreground">Real-time package tracking and management</p>
        </div>
      </div>
    </header>
  )
}
