"use client";
import React, { useState } from "react";
export default function AdminPanel() {
  const [orderId, setOrderId] = useState<string>("LND-3021");
  const [lat, setLat] = useState<number>(23.6039);
  const [lng, setLng] = useState<number>(77.209);
  const [status, setStatus] = useState<string>("Picked Up");
  const [progress, setProgress] = useState<number>(20);
  const [eta, setEta] = useState<number>(20);
  const [loading, setLoading] = useState(false);

  // Update driver location
  async function updateLocation() {
    try {
      setLoading(true);
      await fetch("/api/update-location", {
        method: "POST",
        body: JSON.stringify({ orderId, lat: Number(lat), lng: Number(lng) }),
        headers: { "Content-Type": "application/json" },
      });
      alert("✅ Location updated successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update location");
    } finally {
      setLoading(false);
    }
  }

  // Update laundry status
  async function updateStatus() {
    try {
      setLoading(true);
      await fetch("/api/update-status", {
        method: "POST",
        body: JSON.stringify({
          orderId,
          status,
          progress: Number(progress),
          eta: Number(eta),
        }),
        headers: { "Content-Type": "application/json" },
      });
      alert("✅ Status updated successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-sky-700 mb-6">
          🚚 Laundry Admin Control Panel
        </h1>

        {/* Order ID */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Order ID</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Update location button */}
        <button
          onClick={updateLocation}
          disabled={loading}
          className="w-full py-2 mb-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Location"}
        </button>

        {/* Status Section */}
        <h2 className="text-lg font-semibold text-sky-700 mb-2">Laundry Status</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option>Order Placed</option>
              <option>Picked Up</option>
              <option>Washing</option>
              <option>Ironing</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Progress (%)</label>
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* ETA */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">ETA (minutes)</label>
          <input
            type="number"
            value={eta}
            onChange={(e) => setEta(parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Update Status Button */}
        <button
          onClick={updateStatus}
          disabled={loading}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Made with ❤️ by Laundry Tracker Admin
      </p>
    </div>
  );
}
