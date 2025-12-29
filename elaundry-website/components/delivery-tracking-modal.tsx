"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Clock, User, Phone, CheckCircle, Truck, Package, Navigation, MapPin, Zap } from "lucide-react"

interface DeliveryTrackingModalProps {
  onClose: () => void
}

export function DeliveryTrackingModal({ onClose }: DeliveryTrackingModalProps) {
  const [trackingId, setTrackingId] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [deliveryData, setDeliveryData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (deliveryData && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const drawMap = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background (map-like)
        ctx.fillStyle = "#f8fafc"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw roads
        ctx.strokeStyle = "#e2e8f0"
        ctx.lineWidth = 8
        ctx.beginPath()
        // Horizontal roads
        for (let i = 0; i < canvas.height; i += 80) {
          ctx.moveTo(0, i)
          ctx.lineTo(canvas.width, i)
        }
        // Vertical roads
        for (let i = 0; i < canvas.width; i += 100) {
          ctx.moveTo(i, 0)
          ctx.lineTo(i, canvas.height)
        }
        ctx.stroke()

        // Draw main route
        const startX = 100
        const startY = 200
        const endX = canvas.width - 100
        const endY = 150

        ctx.strokeStyle = "#0891b2"
        ctx.lineWidth = 4
        ctx.setLineDash([10, 5])
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.quadraticCurveTo(canvas.width / 2, startY - 50, endX, endY)
        ctx.stroke()
        ctx.setLineDash([])

        // Calculate delivery partner position based on progress
        const progress = deliveryData.progress / 100
        const t = progress
        const currentX = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * (canvas.width / 2) + Math.pow(t, 2) * endX
        const currentY = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * (startY - 50) + Math.pow(t, 2) * endY

        // Draw destination marker (house)
        ctx.fillStyle = "#d97706"
        ctx.beginPath()
        ctx.arc(endX, endY, 15, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = "white"
        ctx.font = "16px Arial"
        ctx.textAlign = "center"
        ctx.fillText("🏠", endX, endY + 5)

        // Draw delivery partner marker (animated)
        const pulseRadius = 20 + Math.sin(Date.now() / 200) * 5
        ctx.fillStyle = "rgba(8, 145, 178, 0.3)"
        ctx.beginPath()
        ctx.arc(currentX, currentY, pulseRadius, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = "#0891b2"
        ctx.beginPath()
        ctx.arc(currentX, currentY, 15, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = "white"
        ctx.font = "16px Arial"
        ctx.textAlign = "center"
        ctx.fillText("🚚", currentX, currentY + 5)

        // Draw location labels
        ctx.fillStyle = "#1f2937"
        ctx.font = "12px Arial"
        ctx.textAlign = "left"
        ctx.fillText("Laundry Center", startX - 20, startY + 35)
        ctx.fillText("Your Location", endX - 30, endY + 35)
      }

      const animate = () => {
        drawMap()
        animationRef.current = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [deliveryData])

  useEffect(() => {
    if (isTracking && deliveryData) {
      // Simulate WebSocket connection
      const simulateWebSocket = () => {
        setIsConnected(true)

        const interval = setInterval(() => {
          setDeliveryData((prev: any) => {
            if (!prev) return null

            const elapsed = Date.now() - prev.startTime
            const totalDuration = 30 * 60 * 1000 // 30 minutes
            const progress = Math.min(elapsed / totalDuration, 1)

            // Enhanced route with more realistic waypoints
            const route = [
              { lat: 28.6139, lng: 77.209, name: "Laundry Center" },
              { lat: 28.6155, lng: 77.2105, name: "Main Road" },
              { lat: 28.6169, lng: 77.212, name: "Traffic Signal" },
              { lat: 28.6185, lng: 77.2135, name: "Market Area" },
              { lat: 28.6201, lng: 77.215, name: "Residential Zone" },
              { lat: 28.6219, lng: 77.218, name: "Your Location" },
            ]

            const totalSegments = route.length - 1
            const currentSegment = Math.floor(progress * totalSegments)
            const segmentProgress = (progress * totalSegments) % 1

            const currentPoint = route[Math.min(currentSegment, totalSegments - 1)]
            const nextPoint = route[Math.min(currentSegment + 1, totalSegments)]

            const currentLat = currentPoint.lat + (nextPoint.lat - currentPoint.lat) * segmentProgress
            const currentLng = currentPoint.lng + (nextPoint.lng - currentPoint.lng) * segmentProgress

            const newLocation = { lat: currentLat, lng: currentLng }

            // Calculate speed and ETA
            const speed = 25 + Math.random() * 10 // 25-35 km/h
            const remainingDistance = (1 - progress) * 5 // Assume 5km total distance
            const etaMinutes = Math.ceil((remainingDistance / speed) * 60)

            // Update status based on progress
            let status = "In Transit"
            let currentLocation = currentPoint.name
            if (progress > 0.8) {
              status = "Out for Delivery"
              currentLocation = "Near Your Location"
            } else if (progress > 0.6) {
              status = "In Your Area"
              currentLocation = nextPoint.name
            }

            return {
              ...prev,
              currentLocation: newLocation,
              locationName: currentLocation,
              status,
              speed: speed.toFixed(1),
              eta: etaMinutes,
              lastUpdated: new Date().toLocaleTimeString(),
              progress: progress * 100,
              batteryLevel: Math.max(100 - progress * 30, 70), // Simulate battery drain
            }
          })
        }, 2000) // Update every 2 seconds for smoother real-time feel

        return () => {
          clearInterval(interval)
          setIsConnected(false)
        }
      }

      const cleanup = simulateWebSocket()
      return cleanup
    }
  }, [isTracking, deliveryData])

  const handleTrack = () => {
    if (!trackingId.trim()) return

    setIsTracking(true)

    // Enhanced simulation with more realistic data
    setTimeout(() => {
      setDeliveryData({
        orderId: trackingId,
        status: "In Transit",
        estimatedDelivery: "2:30 PM",
        startTime: Date.now(),
        progress: 0,
        speed: "28.5",
        eta: 25,
        batteryLevel: 95,
        deliveryBoy: {
          name: "Rajesh Kumar",
          phone: "+91-9876543210",
          rating: 4.8,
          vehicleNumber: "DL-8C-1234",
        },
        currentLocation: {
          lat: 28.6139,
          lng: 77.209,
        },
        locationName: "Laundry Center",
        destination: {
          lat: 28.6219,
          lng: 77.218,
        },
        timeline: [
          { status: "Order Confirmed", time: "10:00 AM", completed: true },
          { status: "Picked Up", time: "11:30 AM", completed: true },
          { status: "In Transit", time: "12:45 PM", completed: true },
          { status: "Out for Delivery", time: "2:00 PM", completed: false },
          { status: "Delivered", time: "2:30 PM", completed: false },
        ],
        lastUpdated: new Date().toLocaleTimeString(),
      })
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Live Delivery Tracking</h2>
            {isConnected && (
              <Badge variant="outline" className="bg-green-50 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <Zap className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tracking Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Enter Tracking ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your tracking ID (e.g., EL123456)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTrack} disabled={isTracking}>
                  {isTracking ? "Connecting..." : "Track Live"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {deliveryData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Live GPS Tracking
                  <Badge variant="outline" className="ml-auto bg-blue-50 border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                    GPS Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="w-full h-96 rounded-lg border border-border shadow-inner bg-slate-50"
                  />

                  {/* Enhanced Live Status Overlay */}
                  <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border min-w-48">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-sm">Live Tracking Active</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Speed:</span>
                          <span className="font-medium">{deliveryData.speed} km/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ETA:</span>
                          <span className="font-medium text-green-600">{deliveryData.eta} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Battery:</span>
                          <span className="font-medium">{deliveryData.batteryLevel}%</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-1">Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${deliveryData.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {deliveryData.progress.toFixed(1)}% Complete
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Location Badge */}
                  <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium text-sm">{deliveryData.locationName}</div>
                        <div className="text-xs text-muted-foreground">Last update: {deliveryData.lastUpdated}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Delivery Information Grid */}
          {deliveryData && (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order Status</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {deliveryData.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-medium">{deliveryData.orderId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ETA:</span>
                    <span className="font-medium text-green-600">{deliveryData.eta} minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Speed:</span>
                    <span className="font-medium">{deliveryData.speed} km/h</span>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Delivery Partner Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Delivery Partner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{deliveryData.deliveryBoy.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span className="font-medium">{deliveryData.deliveryBoy.vehicleNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-medium text-yellow-600">⭐ {deliveryData.deliveryBoy.rating}</span>
                  </div>
                  <Button size="sm" className="w-full bg-transparent" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {deliveryData.deliveryBoy.name}
                  </Button>
                </CardContent>
              </Card>

              {/* Live Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Live Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Connection:</span>
                    <Badge variant="outline" className="bg-green-50 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                      Strong
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Battery:</span>
                    <span className="font-medium">{deliveryData.batteryLevel}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Updates:</span>
                    <span className="font-medium">Every 2 sec</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Timeline */}
          {deliveryData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryData.timeline.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {item.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                          {item.status}
                        </p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {deliveryData && (
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Phone className="h-4 w-4" />
                Call Delivery Partner
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Truck className="h-4 w-4" />
                Share Location
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
