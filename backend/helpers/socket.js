// socket.js
import { Server } from "socket.io";
import Message from "../models/messages.models.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        let message = new Message({
          roomId: data.roomId,
          sender: data.sender,
          text: data.text,
        });
        message = await message.save();
        message = await message.populate("sender", "username");

        // ✅ Emit to everyone in the room
        io.to(data.roomId).emit("receiveMessage", message);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
