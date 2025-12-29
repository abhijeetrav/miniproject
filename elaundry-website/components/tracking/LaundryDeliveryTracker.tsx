// "use client";

// import React, { useState } from "react";
// import dynamic from "next/dynamic";

// // Dynamic import of MapView to avoid SSR issues
// const MapView = dynamic(() => import("./MapView"), { ssr: false });

// type LatLng = { lat: number; lng: number };

// interface LaundryTrackerProps {
//   orderId: string;
//   currentLocation: LatLng;
//   destination: LatLng;
//   status: "Order Placed" | "Picked Up" | "Washing" | "Ironing" | "Out for Delivery" | "Delivered";
//   driverName: string;
//   driverPhone: string;
//   etaMinutes: number;
//   lastUpdate: string;
//   progress: number; // 0 - 100
// }

// export default function LaundryDeliveryTracker({
//   orderId,
//   currentLocation,
//   destination,
//   status,
//   driverName,
//   driverPhone,
//   etaMinutes,
//   lastUpdate,
//   progress,
// }: LaundryTrackerProps) {
//   const [laundryStages] = useState([
//     "Order Placed",
//     "Picked Up",
//     "Washing",
//     "Ironing",
//     "Out for Delivery",
//     "Delivered",
//   ]);

//   const currentStageIndex = laundryStages.indexOf(status);

//   return (
//     <div className="w-full h-screen flex flex-col bg-white">
//       {/* ==================== HEADER SECTION ==================== */}
//       <div className="bg-[#0891b2] text-white p-4 shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-lg font-semibold">Order #{orderId}</h2>
//             <p className="text-sm text-blue-100">Live Laundry Delivery Tracker</p>
//           </div>
//           <div className="text-right">
//             <p className="font-semibold text-sm">ETA: {etaMinutes} min</p>
//             <p className="text-xs text-blue-100">Last updated: {lastUpdate}</p>
//           </div>
//         </div>

//         {/* Driver Info */}
//         <div className="flex justify-between items-center mt-3">
//           <div>
//             <p className="font-medium">{driverName}</p>
//             <p className="text-xs text-blue-100">{driverPhone}</p>
//           </div>
//           <div className="bg-white text-[#0891b2] px-3 py-1 rounded-full text-xs font-semibold">
//             {status}
//           </div>
//         </div>
//       </div>

//       {/* ==================== MAP SECTION ==================== */}
//       <div className="relative flex-1">
//         <MapView
//           currentLocation={currentLocation}
//           destination={destination}
//           progress={progress}
//           fitBounds
//           className="w-full h-full"
//         />

//         {/* Floating Status Card (like Zepto-style) */}
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg p-4 rounded-2xl w-11/12 max-w-md">
//           <h3 className="text-sm font-semibold text-gray-800 mb-2">Delivery Progress</h3>
//           <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
//             <div
//               className="bg-[#0891b2] h-2 transition-all duration-500"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//           <p className="text-xs text-gray-500 text-center">{status}</p>
//         </div>
//       </div>

//       {/* ==================== LAUNDRY STATUS TIMELINE ==================== */}
//       <div className="bg-gray-50 border-t border-gray-200 p-4">
//         <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">
//           Laundry Order Timeline
//         </p>

//         <div className="flex justify-between">
//           {laundryStages.map((stage, idx) => {
//             const isDone = idx < currentStageIndex;
//             const isCurrent = idx === currentStageIndex;
//             return (
//               <div key={stage} className="flex flex-col items-center flex-1">
//                 <div
//                   className={`w-7 h-7 flex items-center justify-center rounded-full mb-1 text-xs font-bold ${
//                     isDone
//                       ? "bg-[#0891b2] text-white"
//                       : isCurrent
//                       ? "bg-[#e0f2fe] text-[#0369a1] border border-[#0891b2]"
//                       : "bg-gray-200 text-gray-500"
//                   }`}
//                 >
//                   {isDone ? "✓" : idx + 1}
//                 </div>
//                 <p
//                   className={`text-[10px] text-center ${
//                     isCurrent ? "text-[#0891b2]" : "text-gray-500"
//                   }`}
//                 >
//                   {stage}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

// ✅ Firebase Config (अपना config यहां भरो)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MSG_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

type LatLng = { lat: number; lng: number };

interface LaundryDeliveryTrackerProps {
  orderId: string;
  destination: LatLng;
}

export default function LaundryDeliveryTracker({
  orderId,
  destination,
}: LaundryDeliveryTrackerProps) {
  // ------------------ STATES ------------------
  const [driverLocation, setDriverLocation] = useState<LatLng>({ lat: 0, lng: 0 });
  const [status, setStatus] = useState<string>("Order Placed");
  const [eta, setEta] = useState<number>(25);
  const [progress, setProgress] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string>("Loading...");

  // ------------------ MAP REFS ------------------
  const mapRef = useRef<google.maps.Map | null>(null);
  const vehicleMarkerRef = useRef<google.maps.Marker | null>(null);
  const destMarkerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ------------------ GOOGLE MAP INIT ------------------
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return console.error("Google Maps API key missing!");

    if (!(window as any).google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!containerRef.current) return;
      mapRef.current = new google.maps.Map(containerRef.current, {
        center: destination,
        zoom: 14,
        streetViewControl: false,
        mapTypeControl: false,
      });

      // Destination marker
      destMarkerRef.current = new google.maps.Marker({
        position: destination,
        map: mapRef.current,
        title: "Destination",
        label: { text: "🏠", fontSize: "16px" } as any,
      });
    }
  }, [destination]);

  // ------------------ FIREBASE LIVE UPDATE ------------------
  useEffect(() => {
    const locRef = ref(db, `orders/${orderId}/location`);
    const statusRef = ref(db, `orders/${orderId}/status`);

    const unsubLoc = onValue(locRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const { lat, lng } = val;
        setDriverLocation({ lat, lng });
        setLastUpdate(new Date().toLocaleTimeString());

        // Map update
        if (vehicleMarkerRef.current) {
          vehicleMarkerRef.current.setPosition({ lat, lng });
        } else if (mapRef.current) {
          vehicleMarkerRef.current = new google.maps.Marker({
            position: { lat, lng },
            map: mapRef.current,
            title: "Delivery Boy",
            label: { text: "🚚", fontSize: "18px" } as any,
          });
        }

        mapRef.current?.panTo({ lat, lng });
      }
    });

    const unsubStatus = onValue(statusRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setStatus(val.status || "Order Placed");
        setEta(val.eta || 15);
        setProgress(val.progress || 0);
      }
    });

    return () => {
      unsubLoc();
      unsubStatus();
    };
  }, [orderId]);

  // ------------------ TIMELINE ------------------
  const stages = ["Order Placed", "Picked Up", "Washing", "Ironing", "Out for Delivery", "Delivered"];
  const currentIndex = stages.indexOf(status);

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* ================= HEADER ================= */}
      <div className="bg-[#0891b2] text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Order #{orderId}</h2>
            <p className="text-sm text-blue-100">Live Laundry Tracker</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">ETA: {eta} min</p>
            <p className="text-xs text-blue-100">Last update: {lastUpdate}</p>
          </div>
        </div>
      </div>

      {/* ================= MAP ================= */}
      <div className="relative flex-1">
        <div ref={containerRef} className="w-full h-full rounded-none" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg p-4 rounded-2xl w-11/12 max-w-md">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-800">Status: {status}</p>
            <p className="text-xs text-gray-500">{progress}% done</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#0891b2] h-2 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= TIMELINE ================= */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">Laundry Progress</p>
        <div className="flex justify-between">
          {stages.map((s, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            return (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full mb-1 text-xs font-bold ${
                    done
                      ? "bg-[#0891b2] text-white"
                      : current
                      ? "bg-[#e0f2fe] text-[#0369a1] border border-[#0891b2]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <p
                  className={`text-[10px] text-center ${
                    current ? "text-[#0891b2]" : "text-gray-500"
                  }`}
                >
                  {s}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

