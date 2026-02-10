import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/rooms.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import Message from "./models/messages.models.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/messages", messageRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Socket.io setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  //   socket.on("joinRoom", (roomId) => {
  //     socket.join(roomId);
  //     console.log(`User ${socket.id} joined room ${roomId}`);
  //   });
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  //   socket.on("sendMessage", (data) => {
  //     io.to(data.roomId).emit("receiveMessage", data);
  //   });
  socket.on("sendMessage", async (data) => {
    const message = new Message({
      roomId: data.roomId,
      sender: data.sender,
      text: data.text,
    });
    await message.save();
    io.to(data.roomId).emit("receiveMessage", message);
  });

  socket.on("newMessage", (message) => {
    // Emit message to all clients in the room
    io.to(message.roomId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
server.listen(5000, () => console.log("Server running on port 5000"));
