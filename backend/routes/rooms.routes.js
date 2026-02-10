import express from "express";
import Room from "../models/rooms.models.js";

const router = express.Router();

// Get all rooms
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// Create new room
router.post("/create", async (req, res) => {
  const { name, createdBy } = req.body;
  const room = new Room({ name, createdBy });
  await room.save();
  res.json(room);
});

export default router;
