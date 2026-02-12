import express from "express";
import Message from "../models/messages.models.js";
import { io } from "../server.js";

const router = express.Router();

// Get messages for a room
router.get("/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save new message via REST
router.post("/send", async (req, res) => {
  try {
    const { roomId, senderId, text } = req.body;

    let message = await Message.create({
      room: roomId, // ✅ correct field
      sender: senderId, // ObjectId
      text,
    });

    message = await message.populate("sender", "username");

    // ✅ unified event name
    io.to(roomId).emit("receiveMessage", message);

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
