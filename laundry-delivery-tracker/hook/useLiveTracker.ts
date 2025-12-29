import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export function useLiveTracker() {
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    socket.on("status_changed", (data) => setStatus(data.status));
    socket.on("location_changed", (data) => setLocation(data));
    return () => {
      socket.off("status_changed");
      socket.off("location_changed");
    };
  }, []);

  const updateStatus = (status: string) => socket.emit("update_status", { status });
  const updateLocation = (lat: number, lng: number) =>
    socket.emit("update_location", { lat, lng });

  return { status, location, updateStatus, updateLocation };
}
