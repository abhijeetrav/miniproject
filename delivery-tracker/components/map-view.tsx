"use client"

import { MapPin, Navigation } from "lucide-react"

interface MapViewProps {
  location: string
}

export function MapView({ location }: MapViewProps) {
  return (
    <div className="space-y-4">
      <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg border border-border overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <MapPin className="text-accent" size={32} />
          </div>
          <p className="text-foreground font-medium mb-1">Map Integration Ready</p>
          <p className="text-muted-foreground text-sm">Integrate Google Maps or Mapbox API here</p>
        </div>
      </div>

      {/* Location Details */}
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <Navigation className="text-accent mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
            <p className="font-medium text-foreground">{location}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Driver is en route and will arrive within the estimated timeframe
            </p>
          </div>
        </div>
      </div>

      {/* Distance and ETA */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
          <p className="text-xs text-muted-foreground mb-1">Distance</p>
          <p className="text-lg font-semibold text-accent">4.2 km</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
          <p className="text-xs text-muted-foreground mb-1">ETA</p>
          <p className="text-lg font-semibold text-accent">12 mins</p>
        </div>
      </div>
    </div>
  )
}
