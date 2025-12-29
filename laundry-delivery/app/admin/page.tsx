// app/page.tsx
// "use client";

// import React from "react";
// import LaundryDeliveryTracker from "../components/LaundryDeliveryTracker";

// export default function HomePage() {
//   return (
//     <main className="w-full h-screen">
//       <LaundryDeliveryTracker
//         orderId="LND-3021"
//         destination={{ lat: 23.6039, lng: 77.209 }}
//       />
//     </main>
//   );
// }


"use client";
import { useLiveTracker } from "@/hooks/useLiveTracker";

export default function AdminPage() {
  const { updateStatus, updateLocation } = useLiveTracker();

  return (
    <div className="p-4">
      <h1>Admin Control</h1>
      <button onClick={() => updateStatus("Picked Up")}>Mark Picked</button>
      <button onClick={() => updateStatus("Delivered")}>Mark Delivered</button>
      <button onClick={() => updateLocation(23.6039, 77.2090)}>Send Delhi Location</button>
    </div>
  );
}
