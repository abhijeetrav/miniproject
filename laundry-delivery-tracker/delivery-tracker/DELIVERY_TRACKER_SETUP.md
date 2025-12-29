# Real-Time Delivery Tracker Setup Guide

This guide explains how to set up and run the eLaundry real-time delivery tracking system with Google Maps integration and live location updates.

## Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js 16 + React)                              │
│  - /app/tracking/[orderId]/page.tsx                        │
│  - /components/live-delivery-tracker.tsx                   │
│  - /hooks/use-live-tracker.ts (WebSocket Management)       │
│  - Connects to Google Maps API for visualization           │
└─────────────────────────────────────────────────────────────┘
           │ WebSocket (Socket.IO)
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (Node.js + Express + Socket.IO)                   │
│  - /backend/server.js                                      │
│  - Listens on port 4000                                    │
│  - Simulates delivery location updates                     │
│  - Manages multiple concurrent orders                      │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Prerequisites

- Node.js 16+ and npm/yarn
- Google Maps API Key (free tier available at https://console.cloud.google.com)
- Two terminal windows (one for frontend, one for backend)

## Setup Steps

### Step 1: Configure Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps JavaScript API
   - Geolocation API (optional for real GPS coordinates later)
4. Create an API key (Create Credentials → API Key)
5. Copy the key and add to `.env.local`:
   \`\`\`env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
   \`\`\`

### Step 2: Start the Backend Server

\`\`\`bash

# Navigate to backend directory

cd backend

# Install dependencies (first time only)

npm install

# Start the server

npm start

# or for development with auto-reload

npm run dev
\`\`\`

Expected output:
\`\`\`
Socket.IO server running on http://localhost:4000
\`\`\`

### Step 3: Start the Frontend (Next.js)

In a separate terminal:

\`\`\`bash

# From project root

npm install

npm run dev
\`\`\`

This starts the Next.js app on http://localhost:3000

### Step 4: Access the Tracker

1. Open browser to: `http://localhost:3000/tracking/ORDER123`
2. Replace `ORDER123` with any order ID (used for demo grouping)
3. You should see:
   - Live map with delivery boy marker (orange circle)
   - Destination marker (dark blue circle)
   - Real-time location polyline (route history)
   - Current speed, ETA, and progress bar
   - Status timeline with real-time updates

## How It Works

### Frontend Flow

1. **Page Load**: User navigates to `/tracking/[orderId]`
2. **WebSocket Connection**: `useLiveTracker()` hook connects to `ws://localhost:4000`
3. **Join Channel**: Sends `join_tracking` event with orderId
4. **Live Updates**: Receives `location_update` events every 3 seconds
5. **Map Rendering**: Google Maps displays markers and polyline
6. **Auto-Follow**: Map centers on delivery boy's location
7. **Cleanup**: Disconnects when component unmounts

### Backend Flow

1. **Server Start**: Express server listens on port 4000 with Socket.IO
2. **Client Connect**: When client joins, initializes delivery simulation for that orderId
3. **Location Updates**: Every 3 seconds:
   - Calculates progress along predefined route
   - Updates location, speed, ETA, and status
   - Broadcasts to all clients tracking that order
4. **Completion**: Stops updates when progress reaches 100%
5. **Cleanup**: Removes delivery from active tracking

### Simulated Route

Default demo route in Delhi:

- **Pickup**: Lat: 28.6139, Lng: 77.209 (Laundry Center)
- **Waypoints**: Multiple intermediate points
- **Destination**: Lat: 28.6219, Lng: 77.218 (Customer Address)

**Duration**: 45 minutes total delivery time

To use real GPS coordinates later, replace the hardcoded coordinates in `backend/server.js` with actual driver GPS data from your mobile app.

## Real GPS Integration (Future Enhancement)

To integrate real GPS coordinates from delivery boy's mobile app:

1. **Modify Backend** (`backend/server.js`):
   \`\`\`javascript
   // Replace simulated updateDeliveryLocation with:
   socket.on('update_driver_location', (data) => {
   const { orderId, lat, lng, speed } = data;
   const delivery = activeDeliveries.get(orderId);
   if (delivery) {
   delivery.location = { lat, lng, speed, ... };
   io.to(`order_${orderId}`).emit('location_update', delivery);
   }
   });
   \`\`\`
2. **Create Mobile App Integration**:

   - Use geolocation API or native GPS
   - Emit location updates via Socket.IO to backend
   - Include authentication for security
3. **Authentication** (Recommended for Production):

   - Add JWT tokens for socket connections
   - Validate orderId belongs to authenticated user

## Environment Variables

### Frontend (`.env.local`)

| Variable                            | Required | Description                                              |
| ----------------------------------- | -------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes      | Google Maps API key for map rendering                    |
| `NEXT_PUBLIC_SOCKET_IO_URL`       | No       | WebSocket server URL (default:`http://localhost:4000`) |

### Backend

| Variable | Required | Default  | Description               |
| -------- | -------- | -------- | ------------------------- |
| `PORT` | No       | `4000` | Port for Socket.IO server |

## Deployment Guide

### Frontend → Vercel

\`\`\`bash

# Push code to GitHub

git push origin main

# In Vercel dashboard:

# 1. Create new project from Git

# 2. Add environment variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# 3. Update NEXT_PUBLIC_SOCKET_IO_URL to production backend URL

# 4. Deploy

\`\`\`

### Backend → Render or VPS

**Option A: Render.com (Recommended for simplicity)**

1. Push backend code to GitHub in `/backend` directory
2. Create new Web Service on render.com
3. Connect GitHub repository
4. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variable `PORT` (optional, defaults to 4000)
6. Deploy

**Option B: Self-hosted VPS**

1. SSH into your VPS
2. Clone repository
3. Install Node.js
4. Run in background:
   \`\`\`bash
   cd backend
   npm install
   npm start &
   \`\`\`
5. Use PM2 for process management:
   \`\`\`bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   \`\`\`

## API Reference

### Socket.IO Events

#### Client → Server

| Event              | Data                    | Description                        |
| ------------------ | ----------------------- | ---------------------------------- |
| `join_tracking`  | `{ orderId: string }` | Subscribe to tracking for an order |
| `leave_tracking` | `{ orderId: string }` | Unsubscribe from tracking          |

#### Server → Client

| Event                  | Data               | Description                                 |
| ---------------------- | ------------------ | ------------------------------------------- |
| `location_update`    | `DeliveryUpdate` | Live location and status update (every 3s)  |
| `delivery_completed` | `DeliveryUpdate` | Emitted when delivery reaches 100% progress |

### HTTP Endpoints (Backend)

| Endpoint    | Method | Response                               |
| ----------- | ------ | -------------------------------------- |
| `/health` | GET    | `{ status: "ok", timestamp: "..." }` |

## Component Reference

### `LiveDeliveryTracker.tsx`

Main component for displaying real-time delivery tracking.

**Props:**
\`\`\`typescript
interface LiveDeliveryTrackerProps {
  orderId: string  // Order ID to track
}
\`\`\`

**Features:**

- Google Maps with live markers
- Real-time polyline route
- Progress bar with percentage
- Status timeline with visual indicators
- Driver information and contact
- Connection status badge
- ETA and last update time

### `useLiveTracker.ts`

Custom React hook for WebSocket connection management.

**Return:**
\`\`\`typescript
interface UseTrackerState {
  data: DeliveryUpdate | null          // Current delivery data
  loading: boolean                     // Initial connection loading state
  error: string | null                 // Connection or data errors
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
}
\`\`\`

**Features:**

- Automatic reconnection with exponential backoff
- Automatic cleanup on unmount
- Connection status tracking
- Error handling and recovery

## Troubleshooting

### "Connection Error: Failed to connect to tracking server"

- Ensure backend server is running on port 4000
- Check firewall settings
- Verify `NEXT_PUBLIC_SOCKET_IO_URL` is correct

### Map not loading

- Verify Google Maps API key is valid
- Check API key has Maps JavaScript API enabled
- Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`

### No location updates

- Check browser console for WebSocket errors
- Verify backend logs show "location_update" events
- Ensure order ID matches between frontend and backend

### Marker not appearing

- Check Google Maps is fully loaded
- Verify coordinates are valid (latitude -90 to 90, longitude -180 to 180)
- Check console for JavaScript errors

## Performance Optimization

1. **WebSocket Updates**: Currently 3-second interval balances real-time feel and server load

   - Adjust in `backend/server.js` line: `}, 3000)` to change frequency
2. **Map Rendering**: Google Maps automatically optimizes for performance

   - Consider clustering markers if displaying 100+ orders simultaneously
3. **Route Polyline**: Efficiently handles up to 1000+ points

   - Route history grows continuously; consider clearing old segments if tracking 24+ hours

## Security Considerations

1. **API Key Restrictions**: Limit Google Maps API key to:

   - Specific referrers (your domain)
   - Maps JavaScript API only
2. **WebSocket Authentication**:
   \`\`\`javascript
   // Add JWT validation in backend
   socket.on('join_tracking', (data, callback) => {
   if (!verifyJWT(data.token)) {
   callback('Unauthorized');
   socket.disconnect();
   }
   });
   \`\`\`
3. **Rate Limiting**: Implement rate limiting for production
   \`\`\`javascript
   const rateLimit = require('express-rate-limit');
   app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
   \`\`\`

## File Structure

\`\`\`
project-root/
├── app/
│   ├── tracking/
│   │   └── [orderId]/
│   │       └── page.tsx          # Dynamic tracking page
│   ├── globals.css{
  "name": "elaundry-delivery-tracker-backend",
  "version": "1.0.0",
  "description": "Real-time delivery tracki
│   └── layout.tsx
├── components/
│   └── live-delivery-tracker.tsx # Main tracker component
├── hooks/
│   └── use-live-tracker.ts       # WebSocket hook
├── types/
│   └── delivery.ts               # TypeScript types
├── backend/
│   ├── server.js                 # Express + Socket.IO server
│   └── package.json
├── .env.local                    # Environment variables
└── DELIVERY_TRACKER_SETUP.md     # This file
\`\`\`

## Support

For issues or questions:

1. Check browser console for errors
2. Check backend server logs
3. Review this documentation
4. Open an issue on GitHub with logs and steps to reproduce

---

**Last Updated**: 2024
**Next.js Version**: 16+
**Node.js Requirement**: 16+
