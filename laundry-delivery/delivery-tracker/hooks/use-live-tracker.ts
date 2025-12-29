"use client"

import { useEffect, useState, useRef } from "react"
import { io, type Socket } from "socket.io-client"

export interface TrackerLocation {
  lat: number
  lng: number
  speed: number
  eta: number
  lastUpdate: string
}

export interface DeliveryUpdate {
  orderId: string
  status: "Order Confirmed" | "Picked Up" | "In Transit" | "Out for Delivery" | "Delivered"
  progress: number
  location: TrackerLocation
  destinationLat: number
  destinationLng: number
  pickupLat: number
  pickupLng: number
  driverName: string
  contactPhone: string
}

export interface UseTrackerState {
  data: DeliveryUpdate | null
  loading: boolean
  error: string | null
  connectionStatus: "idle" | "connecting" | "connected" | "reconnecting" | "disconnected"
}

export function useLiveTracker(orderId: string | null): UseTrackerState {
  const [state, setState] = useState<UseTrackerState>({
    data: null,
    loading: true,
    error: null,
    connectionStatus: "idle",
  })

  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!orderId) {
      setState((prev) => ({ ...prev, loading: false }))
      return
    }

    setState((prev) => ({ ...prev, connectionStatus: "connecting", loading: true }))

    const socket = io("http://localhost:4000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket"],
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("[v0] Socket connected, joining room:", orderId)
      setState((prev) => ({ ...prev, connectionStatus: "connected", loading: false }))
      socket.emit("join_tracking", { orderId })
    })

    socket.on("connect_error", (error: any) => {
      console.error("[v0] Connection error:", error)
      setState((prev) => ({
        ...prev,
        connectionStatus: "disconnected",
        error: "Failed to connect to tracking server",
      }))
    })

    socket.on("reconnect_attempt", () => {
      setState((prev) => ({ ...prev, connectionStatus: "reconnecting" }))
    })

    socket.on("location_update", (data: DeliveryUpdate) => {
      console.log("[v0] Location update received:", data)
      setState((prev) => ({
        ...prev,
        data,
        error: null,
        loading: false,
        connectionStatus: "connected",
      }))
    })

    socket.on("delivery_completed", (data: DeliveryUpdate) => {
      console.log("[v0] Delivery completed:", data)
      setState((prev) => ({
        ...prev,
        data,
        loading: false,
      }))
    })

    socket.on("error", (error: any) => {
      console.error("[v0] Socket error:", error)
      setState((prev) => ({
        ...prev,
        error: typeof error === "string" ? error : "An error occurred",
      }))
    })

    return () => {
      socket.emit("leave_tracking", { orderId })
      socket.disconnect()
      socketRef.current = null
    }
  }, [orderId])

  return state
}
