"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, User, Phone, Truck, Package, Navigation, MapPin, Zap } from "lucide-react";
import MapView from "./MapView";
import TrackingTimeline from "./TrackingTimeline";

interface DeliveryTrackingModalProps {
  onClose: () => void;
}

type LatLng = { lat: number; lng: number };

export function DeliveryTrackingModal({ onClose }: DeliveryTrackingModalProps) {
  const [trackingId, setTrackingId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [deliveryData, setDeliveryData] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Simulated real-time updates (replace with WebSocket/Socket.IO in production)
  useEffect(() => {
    if (!isTracking || !deliveryData) return;

    setIsConnected(true);
    const interval = setInterval(() => {
      setDeliveryData((prev: any) => {
        if (!prev) return prev;
        const elapsed = Date.now() - prev.startTime;
        const totalDuration = 30 * 60 * 1000; // 30 minutes
        const rawProgress = Math.min(elapsed / totalDuration, 1);
        const progress = rawProgress * 100;

        const speed = 25 + Math.random() * 10;
        const remainingDistance = Math.max(0.1, (1 - rawProgress) * 5);
        const etaMinutes = Math.ceil((remainingDistance / speed) * 60);

        const s = prev.startLocation;
        const d = prev.destination;
        const curLat = s.lat + (d.lat - s.lat) * rawProgress;
        const curLng = s.lng + (d.lng - s.lng) * rawProgress;

        const timeline = prev.timeline.map((t: any, i: number) => {
          const thresholds = [0.02, 0.15, 0.6, 0.85, 1];
          return { ...t, completed: rawProgress >= thresholds[i] };
        });

        return {
          ...prev,
          progress,
          currentLocation: { lat: curLat, lng: curLng },
          locationName: rawProgress > 0.8 ? "Near Your Location" : rawProgress > 0.6 ? "In Your Area" : "On Route",
          speed: speed.toFixed(1),
          eta: etaMinutes,
          lastUpdated: new Date().toLocaleTimeString(),
          batteryLevel: Math.max(70, 100 - Math.floor(progress * 0.3)),
          timeline,
        };
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [isTracking, deliveryData]);

  const handleTrack = () => {
    if (!trackingId.trim()) return;
    setIsTracking(true);

    setTimeout(() => {
      const start: LatLng = { lat: 28.6139, lng: 77.2090 };
      const dest: LatLng = { lat: 28.6219, lng: 77.2180 };

      setDeliveryData({
        orderId: trackingId,
        status: "In Transit",
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
        startLocation: start,
        currentLocation: start,
        destination: dest,
        locationName: "Laundry Center",
        timeline: [
          { status: "Order Confirmed", time: "10:00 AM", completed: true },
          { status: "Picked Up", time: "11:30 AM", completed: true },
          { status: "In Transit", time: "12:45 PM", completed: true },
          { status: "Out for Delivery", time: "2:00 PM", completed: false },
          { status: "Delivered", time: "2:30 PM", completed: false },
        ],
        lastUpdated: new Date().toLocaleTimeString(),
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Live Delivery Tracking</h2>
            {isConnected && (
              <Badge variant="outline" className="bg-green-50 border-green-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Zap className="h-3 w-3" />
                Real-time
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Enter Tracking ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input placeholder="Enter tracking ID" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} className="flex-1" />
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
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1" />
                    GPS Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <MapView
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    currentLocation={deliveryData.currentLocation}
                    destination={deliveryData.destination}
                    progress={deliveryData.progress}
                    fitBounds
                    className="w-full h-[420px] rounded-lg border border-border"
                  />

                  <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border min-w-48">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
                    </div>
                  </div>

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

          {deliveryData && (
            <div className="grid md:grid-cols-3 gap-6">
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
                  <Button size="sm" className="w-full bg-transparent" variant="outline" onClick={() => window.alert(`Calling ${deliveryData.deliveryBoy.phone}`)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call {deliveryData.deliveryBoy.name}
                  </Button>
                </CardContent>
              </Card>

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
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
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

          {deliveryData && (
            <div>
              <TrackingTimeline timeline={deliveryData.timeline} />
            </div>
          )}

          {deliveryData && (
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={() => window.alert(`Calling ${deliveryData.deliveryBoy.phone}`)}>
                <Phone className="h-4 w-4" />
                Call Delivery Partner
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={() => navigator.share?.({ title: "My Delivery", text: `Tracking ${deliveryData.orderId}`, url: window.location.href })}>
                <Truck className="h-4 w-4" />
                Share Location
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryTrackingModal;
