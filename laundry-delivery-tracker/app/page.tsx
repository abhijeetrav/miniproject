
"use client";

import React, { useState, Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";

// dynamic import client-only tracker (no SSR)
const LaundryDeliveryTracker = dynamic(
  () => import("./components/LaundryDeliveryTracker"),
  { ssr: false }
);

type LatLng = { lat: number; lng: number };

export default function HomePage() {
  const [liveOpen, setLiveOpen] = useState(false);
  const orderId = "LND-3021";
  const destination: LatLng = { lat: 28.6039, lng: 77.209};

  // sample UI data (could be driven from Firebase / API)
  const driver = useMemo(
    () => ({
      name: "Rohit Sharma",
      phone: "+91 98765-g43210",
      eta: 18,
      progress: 72,
      speed: 32.4, // km/h
    }),
    []
  );

  const staticMapUrl = useMemo(() => {
    const key = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : "";
    // fallback: if no key, you could show a styled placeholder
    if (!key) return "";
    const center = `${destination.lat},${destination.lng}`;
    const marker = `color:0x2D9CDB|label:D|${destination.lat},${destination.lng}`;
    const size = "1200x600";
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=12&size=${size}&markers=${encodeURIComponent(
      marker
    )}&key=${key}`;
  }, [destination]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      {/* Header */}
      <header className="max-w-7xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-sky-100 flex items-center justify-center text-white text-lg font-bold shadow">
            <img src="laundrypartha.svg"></img>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-sky-900">eLaundry — Live Tracker</h1>
            <p className="text-sm text-gray-600">Realtime delivery tracking for your laundry orders</p>
          </div>
        </div>
    

        <div className="flex items-center gap-3">
          <button
            onClick={() => document.getElementById("help")?.scrollIntoView({ behavior: "smooth" })}
            className="px-3 py-2 rounded-md border border-sky-200 text-sky-700 hover:bg-sky-50"
            aria-label="Help"
          >
            Need help?
          </button>

          <button
            onClick={() => setLiveOpen((v) => !v)}
            className={clsx(
              "px-4 py-2 rounded-md font-medium transition",
              liveOpen ? "bg-rose-600 text-white" : "bg-sky-600 text-white shadow"
            )}
            aria-pressed={liveOpen}
          >
            {liveOpen ? "Close Live" : "Live Track"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        <section className="grid md:grid-cols-3 gap-6 items-start">
          {/* Info left */}
          <aside className="col-span-1 bg-white rounded-2xl p-6 shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-sky-800">Order #{orderId}</h2>
                <p className="text-sm text-gray-600 mt-1">Your laundry is on its way — track it live or view ETA updates.</p>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">ETA</div>
                <div className="text-lg font-semibold text-sky-700">{driver.eta} min</div>
              </div>
            </div>

            {/* Driver card */}
            <div className="mt-5 p-3 bg-sky-50 rounded-lg flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center text-2xl shadow-sm">🚚</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{driver.name}</div>
                <div className="text-xs text-gray-500">{driver.phone}</div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="text-gray-600">Speed</div>
                  <div className="font-semibold">{driver.speed.toFixed(1)} km/h</div>
                </div>
              </div>
            </div>

            {/* progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>Progress</span>
                <span className="font-semibold">{driver.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div style={{ width: `${driver.progress}%` }} className="h-2 bg-gradient-to-r from-sky-500 to-sky-700 transition-all duration-500" />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => window.open('index.html','blank')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0121 9.618V14.38a2 2 0 01-1.447 1.894L15 16v-6zM6 6v12l6-6-6-6z" />
                </svg>
                Live track your delivery boy
              </button>

             <button
                onClick={() => alert("Contacting support...")}
                className="px-4 py-2 border border-gray-200 rounded-md hover:shadow"
              >
                Contact
              </button>
            </div>
          </aside>

          {/* Map area */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow overflow-hidden relative">
              {/* Map preview */}
              {!liveOpen ? (
                <div className="relative w-full h-96 bg-gray-100">
                  {staticMapUrl ? (
                    <img
                      src={staticMapUrl}
                      alt="Map preview"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      Map preview unavailable — set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                    </div>
                  )}

                  {/* Pulsing driver marker overlay */}
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: "translate(-20%, -10%)" }} // slight offset over marker
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                        <span className="text-xl">🚚</span>
                      </div>
                      <span className="absolute inset-0 block rounded-full animate-ping bg-sky-400/40" />
                    </div>
                    <div className="mt-2 text-xs text-gray-600 text-center">Delivery Boy</div>
                  </div>

                  {/* small info pill */}
                  <div className="absolute left-4 top-4 bg-white/95 rounded-lg p-3 shadow">
                    <div className="text-xs text-gray-500">Destination</div>
                    <div className="text-sm font-medium text-sky-700">Bijnor, Uttar Pradesh</div>
                  </div>
                </div>
              ) : (
                <div style={{ minHeight: 384 }}>
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-96">
                        <div className="text-sm text-gray-500">Loading live tracker…</div>
                      </div>
                    }
                  >
                    <LaundryDeliveryTracker orderId={orderId} destination={destination} />
                  </Suspense>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="flex gap-4">
              <button className="flex-1 bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow">
                <div className="text-xs text-gray-500">Help</div>
                <div className="font-medium mt-1">Contact Support</div>
              </button>

              <button className="flex-1 bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow">
                <div className="text-xs text-gray-500">Receipt</div>
                <div className="font-medium mt-1">View Order Details</div>
              </button>
            </div>
          </div>
        </section>

        <footer id="help" className="mt-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} LaundryPartha.com  · Built with ❤️
        </footer>
      </main>
    </div>
  );
}

