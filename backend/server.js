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
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      let message = new Message({
        room: data.roomId, // ✅ correct field
        sender: data.sender, // ObjectId
        text: data.text,
      });
      await message.save();
      message = await message.populate("sender", "username");

      // ✅ unified event name
      io.to(data.roomId).emit("receiveMessage", message);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // ✅ Typing indicator events
  socket.on("typing", ({ roomId, username }) => {
    socket.to(roomId).emit("userTyping", { username });
  });
  socket.on("stopTyping", ({ roomId, username }) => {
    socket.to(roomId).emit("userStopTyping", { username });
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected:", socket.id);
  // });
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

export { io, server };
