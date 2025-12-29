"use client"

import { useEffect, useRef } from "react"
import { useLiveTracker } from "@/hooks/use-live-tracker"
import { TIMELINE_STEPS, getTimelineStepIndex } from "@/types/delivery"
import type { google } from "google-maps"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

interface LiveDeliveryTrackerProps {
  orderId: string
}

interface MapMarker {
  title: string
  position: google.maps.LatLng
  icon: string
}

export function LiveDeliveryTracker({ orderId }: LiveDeliveryTrackerProps) {
  const { data, loading, error, connectionStatus } = useLiveTracker(orderId)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const polylineRef = useRef<google.maps.Polyline | null>(null)
  const routePathRef = useRef<google.maps.LatLng[]>([])

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || typeof window === "undefined") return

    if (window.google?.maps) return

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps || !data) return

    const { lat, lng } = data.location
    const currentPos = new window.google.maps.LatLng(lat, lng)
    const destinationPos = new window.google.maps.LatLng(data.destinationLat, data.destinationLng)
    const pickupPos = new window.google.maps.LatLng(data.pickupLat, data.pickupLng)

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: currentPos,
        mapTypeId: "roadmap",
        styles: [
          { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
          { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        ],
      })
    }

    const map = mapInstanceRef.current

    // Update map center to follow delivery boy
    map.setCenter(currentPos)

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Add delivery boy marker
    const driverMarker = new window.google.maps.Marker({
      position: currentPos,
      map,
      title: `${data.driverName} - Speed: ${data.speed.toFixed(1)} km/h`,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#FF6B35",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    })
    markersRef.current.push(driverMarker)

    // Add destination marker
    const destinationMarker = new window.google.maps.Marker({
      position: destinationPos,
      map,
      title: "Delivery Destination",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#2D3959",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    })
    markersRef.current.push(destinationMarker)

    // Add pickup marker if not at pickup
    if (getTimelineStepIndex(data.status) > 0) {
      const pickupMarker = new window.google.maps.Marker({
        position: pickupPos,
        map,
        title: "Pickup Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4CAF50",
          fillOpacity: 0.7,
          strokeColor: "#ffffff",
          strokeWeight: 1,
        },
      })
      markersRef.current.push(pickupMarker)
    }

    // Add current location to route path
    const isNewLocation =
      routePathRef.current.length === 0 ||
      routePathRef.current[routePathRef.current.length - 1].lat() !== lat ||
      routePathRef.current[routePathRef.current.length - 1].lng() !== lng

    if (isNewLocation) {
      routePathRef.current.push(currentPos)
    }

    // Update polyline
    if (polylineRef.current) {
      polylineRef.current.setPath(routePathRef.current)
    } else {
      polylineRef.current = new window.google.maps.Polyline({
        path: routePathRef.current,
        geodesic: true,
        strokeColor: "#FF6B35",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      })
    }

    // Fit bounds to show all markers
    const bounds = new window.google.maps.LatLngBounds()
    bounds.extend(currentPos)
    bounds.extend(destinationPos)
    bounds.extend(pickupPos)
    map.fitBounds(bounds, 50)
  }, [data])

  const getStatusBadge = () => {
    const statusColors: Record<string, string> = {
      "Order Confirmed": "bg-blue-100 text-blue-700",
      "Picked Up": "bg-purple-100 text-purple-700",
      "In Transit": "bg-amber-100 text-amber-700",
      "Out for Delivery": "bg-orange-100 text-orange-700",
      Delivered: "bg-green-100 text-green-700",
    }

    const connectionStatusColors: Record<string, string> = {
      connecting: "bg-gray-100 text-gray-700",
      connected: "bg-green-100 text-green-700",
      reconnecting: "bg-yellow-100 text-yellow-700",
      disconnected: "bg-red-100 text-red-700",
      idle: "bg-gray-100 text-gray-700",
    }

    return (
      <div className="flex gap-2 items-center">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[data?.status || "Order Confirmed"]}`}
        >
          {data?.status || "Loading..."}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${connectionStatusColors[connectionStatus]}`}>
          {connectionStatus === "connected"
            ? "Live"
            : connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
        </span>
      </div>
    )
  }

  const progressPercent = data?.progress || 0

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">Order #{orderId}</h2>
            <p className="text-sm text-muted-foreground">Real-time Delivery Tracking</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Driver Info */}
        {data && (
          <div className="bg-background p-3 rounded-md mb-3">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">{data.driverName}</p>
                <p className="text-xs text-muted-foreground">{data.contactPhone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-accent">{data.speed.toFixed(1)} km/h</p>
                <p className="text-xs text-muted-foreground">Current Speed</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-foreground">Delivery Progress</span>
            <span className="text-xs text-muted-foreground">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* ETA and Last Update */}
        {data && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">ETA</p>
              <p className="font-medium text-foreground">{Math.max(0, data.eta)} min</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Update</p>
              <p className="font-medium text-foreground">{data.lastUpdate}</p>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative bg-muted">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm z-10">
            <div className="text-center">
              <p className="text-sm font-medium text-destructive mb-1">Connection Error</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Connecting to tracker...</p>
            </div>
          </div>
        )}

        {!GOOGLE_MAPS_API_KEY && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
            <p className="text-sm text-destructive">Google Maps API key not configured</p>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Timeline */}
      <div className="bg-card border-t border-border p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Order Timeline</p>
        <div className="flex justify-between">
          {TIMELINE_STEPS.map((step, idx) => {
            const currentIdx = data ? getTimelineStepIndex(data.status) : -1
            const isCompleted = idx <= currentIdx
            const isCurrent = idx === currentIdx

            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <p
                  className={`text-xs text-center font-medium leading-tight ${
                    isCurrent ? "text-accent" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.split(" ")[0]}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
