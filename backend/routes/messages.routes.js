import express from "express";
import Message from "../models/messages.models.js";

const router = express.Router();

// Get messages for a room
router.get("/:roomId", async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId });
  res.json(messages);
});

// Save new message
router.post("/", async (req, res) => {
  const { roomId, sender, text } = req.body;
  const message = new Message({ roomId, sender, text });
  await message.save();
  res.json(message);
});

export default router;
