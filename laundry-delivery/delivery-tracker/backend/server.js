const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const cors = require("cors")

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
})

const PORT = process.env.PORT || 4000

// CORS middleware
app.use(cors())

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Simulate delivery data - each order has its own state
const activeDeliveries = new Map()

function initializeDelivery(orderId) {
  const delivery = {
    orderId,
    status: "Order Confirmed",
    progress: 0,
    location: {
      lat: 28.6139,
      lng: 77.209,
      speed: 0,
      eta: 45,
      lastUpdate: new Date().toLocaleTimeString(),
    },
    destinationLat: 28.6219,
    destinationLng: 77.218,
    pickupLat: 28.6139,
    pickupLng: 77.209,
    driverName: "Rajesh Kumar",
    contactPhone: "+91 98765-43210",
    interval: null,
    startTime: Date.now(),
    pathSegments: [
      // Start: pickup location
      { lat: 28.6139, lng: 77.209 },
      // Move through Delhi
      { lat: 28.6152, lng: 77.2101 },
      { lat: 28.6165, lng: 77.2112 },
      { lat: 28.6178, lng: 77.2123 },
      { lat: 28.6191, lng: 77.2134 },
      // Destination
      { lat: 28.6219, lng: 77.218 },
    ],
    currentSegment: 0,
  }

  return delivery
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function updateDeliveryLocation(delivery) {
  const totalDuration = 45 * 60 * 1000 // 45 minutes in milliseconds
  const elapsedTime = Date.now() - delivery.startTime
  const progress = Math.min((elapsedTime / totalDuration) * 100, 100)

  // Update status based on progress
  if (progress < 15) {
    delivery.status = "Order Confirmed"
  } else if (progress < 30) {
    delivery.status = "Picked Up"
  } else if (progress < 85) {
    delivery.status = "In Transit"
  } else if (progress < 95) {
    delivery.status = "Out for Delivery"
  } else {
    delivery.status = "Delivered"
  }

  // Interpolate position along the path
  const totalDistance = delivery.pathSegments.reduce((sum, segment, idx) => {
    if (idx === 0) return 0
    const prevSegment = delivery.pathSegments[idx - 1]
    return sum + calculateDistance(prevSegment.lat, prevSegment.lng, segment.lat, segment.lng)
  }, 0)

  const targetDistance = (totalDistance * progress) / 100
  let accumulatedDistance = 0
  let currentSegment = 0

  for (let i = 1; i < delivery.pathSegments.length; i++) {
    const segmentDistance = calculateDistance(
      delivery.pathSegments[i - 1].lat,
      delivery.pathSegments[i - 1].lng,
      delivery.pathSegments[i].lat,
      delivery.pathSegments[i].lng,
    )

    if (accumulatedDistance + segmentDistance >= targetDistance) {
      currentSegment = i
      break
    }
    accumulatedDistance += segmentDistance
  }

  const prevSegment = delivery.pathSegments[currentSegment - 1]
  const nextSegment = delivery.pathSegments[currentSegment]
  const segmentDistance = calculateDistance(prevSegment.lat, prevSegment.lng, nextSegment.lat, nextSegment.lng)
  const remainingDistance = targetDistance - accumulatedDistance
  const segmentProgress = segmentDistance > 0 ? remainingDistance / segmentDistance : 0

  delivery.location.lat = prevSegment.lat + (nextSegment.lat - prevSegment.lat) * segmentProgress
  delivery.location.lng = prevSegment.lng + (nextSegment.lng - prevSegment.lng) * segmentProgress
  delivery.progress = progress

  // Simulate speed (varies between 20-60 km/h)
  delivery.location.speed = 20 + Math.sin(progress / 10) * 20 + Math.random() * 5

  // Calculate ETA
  const remainingProgress = 100 - progress
  const remainingTime = (remainingProgress / 100) * totalDuration
  delivery.location.eta = Math.ceil(remainingTime / 60000)

  delivery.location.lastUpdate = new Date().toLocaleTimeString()

  return delivery
}

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on("join_tracking", (data) => {
    const { orderId } = data
    console.log(`Client ${socket.id} joining order: ${orderId}`)

    // Create room for this order
    socket.join(`order_${orderId}`)

    // Initialize delivery if not already done
    if (!activeDeliveries.has(orderId)) {
      const delivery = initializeDelivery(orderId)
      activeDeliveries.set(orderId, delivery)

      delivery.interval = setInterval(() => {
        const updatedDelivery = updateDeliveryLocation(delivery)

        // Emit to all clients in this order's room
        io.to(`order_${orderId}`).emit("location_update", {
          orderId,
          status: updatedDelivery.status,
          progress: updatedDelivery.progress,
          location: updatedDelivery.location,
          destinationLat: updatedDelivery.destinationLat,
          destinationLng: updatedDelivery.destinationLng,
          pickupLat: updatedDelivery.pickupLat,
          pickupLng: updatedDelivery.pickupLng,
          driverName: updatedDelivery.driverName,
          contactPhone: updatedDelivery.contactPhone,
        })

        // Stop tracking when delivery is complete
        if (updatedDelivery.progress >= 100) {
          io.to(`order_${orderId}`).emit("delivery_completed", {
            orderId,
            status: "Delivered",
            progress: 100,
            location: updatedDelivery.location,
            destinationLat: updatedDelivery.destinationLat,
            destinationLng: updatedDelivery.destinationLng,
            pickupLat: updatedDelivery.pickupLat,
            pickupLng: updatedDelivery.pickupLng,
            driverName: updatedDelivery.driverName,
            contactPhone: updatedDelivery.contactPhone,
          })

          clearInterval(delivery.interval)
          activeDeliveries.delete(orderId)
        }
      }, 3000)
    }

    // Send immediate update to newly connected client
    const delivery = activeDeliveries.get(orderId)
    if (delivery) {
      socket.emit("location_update", {
        orderId,
        status: delivery.status,
        progress: delivery.progress,
        location: delivery.location,
        destinationLat: delivery.destinationLat,
        destinationLng: delivery.destinationLng,
        pickupLat: delivery.pickupLat,
        pickupLng: delivery.pickupLng,
        driverName: delivery.driverName,
        contactPhone: delivery.contactPhone,
      })
    }
  })

  socket.on("leave_tracking", (data) => {
    const { orderId } = data
    console.log(`Client ${socket.id} leaving order: ${orderId}`)
    socket.leave(`order_${orderId}`)
  })

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`)
})
