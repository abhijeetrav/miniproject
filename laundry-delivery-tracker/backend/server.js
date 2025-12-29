import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Delivery boy updates status or location
  socket.on("update_status", (data) => {
    console.log("Status update:", data);
    // Broadcast to all clients (admin & customer)
    io.emit("status_changed", data);
  });

  socket.on("update_location", (data) => {
    console.log("Location update:", data);
    io.emit("location_changed", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(3001, () => console.log("Socket server running on port 3001"));
