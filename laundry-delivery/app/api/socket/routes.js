import { Server } from "socket.io";

let io;

export async function GET(req) {
  if (!io) {
    const server = req.socket?.server;
    if (!server.io) {
      io = new Server(server, {
        path: "/api/socket",
        cors: { origin: "*" },
      });

      io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("update_status", (data) => {
          console.log("Status Update:", data);
          io.emit("status_changed", data);
        });

        socket.on("update_location", (data) => {
          console.log("Location Update:", data);
          io.emit("location_changed", data);
        });

        socket.on("disconnect", () => {
          console.log("Client disconnected:", socket.id);
        });
      });

      server.io = io;
      console.log("✅ WebSocket Server started at /api/socket");
    } else {
      io = server.io;
    }
  }
  return new Response("Socket server is running", { status: 200 });
}
