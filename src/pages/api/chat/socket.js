import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Starting WebSocket server...");

    const io = new Server(res.socket.server, {
      path: "/api/chat/socket",
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      socket.on("sendMessage", ({ roomId, message }) => {
        const payload = {
          senderId: socket.id,
          text: message,
          timestamp: new Date(),
        };
        io.to(roomId).emit("receiveMessage", payload);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
