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
    // console.log("User connected:", socket.id);

    const clearTyping = () => {
      const typing = socket.data.typing;
      if (!typing) return;

      socket.to(typing.roomId).emit("userStopTyping", {
        username: typing.username,
      });
      delete socket.data.typing;
    };

    socket.on("joinRoom", (roomId) => {
      if (typeof roomId !== "string" || !roomId) return;

      if (socket.data.roomId && socket.data.roomId !== roomId) {
        clearTyping();
        socket.leave(socket.data.roomId);
      }
      socket.data.roomId = roomId;
      socket.join(roomId);
      // console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
      if (socket.data.roomId !== roomId) return;

      clearTyping();
      socket.leave(roomId);
      delete socket.data.roomId;
    });

    socket.on("sendMessage", async (data) => {
      try {
        let message = new Message({
          room: data.roomId,
          sender: data.sender,
          text: data.text,
        });
        message = await message.save();
        message = await message.populate("sender", "username");

        // Emit to everyone in the room/  the backend broadcasts the saved message to everyone in that Socket.IO room using receiveMessage
        io.to(data.roomId).emit("receiveMessage", message);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("typing", (data = {}) => {
      const { roomId, username } = data;
      if ( socket.data.roomId !== roomId || typeof username !== "string" || !username) {
        return;
      }

      const currentTyping = socket.data.typing; // see what this does
      if (
        currentTyping?.roomId === roomId &&
        currentTyping?.username === username
      ) {
        return;
      }

      clearTyping();
      socket.data.typing = { roomId, username };
      socket.to(roomId).emit("userTyping", { username });
    });

    socket.on("stopTyping", (data = {}) => {
      const { roomId, username } = data;
      if (
        socket.data.typing?.roomId !== roomId ||
        socket.data.typing?.username !== username
      ) {
        return;
      }

      clearTyping();
    });

    socket.on("disconnect", () => {
      clearTyping();
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
