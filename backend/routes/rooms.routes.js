import express from "express";
import Room from "../models/rooms.models.js";

const router = express.Router();

// Get all rooms
router.get("/getRooms", async (req, res) => {
  try {
    const rooms = await Room.find().populate("createdBy", "username");
    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
});

// Create new room
router.post("/create", async (req, res) => {
  try {
    const { roomName, userId } = req.body;

    // Check if room already exists
    const roomExist = await Room.findOne({ roomName });
    if (roomExist) {
      return res.status(409).json({
        message: "Room name already exists",
        success: false,
      });
    }

    // Create new room
    const room = await Room.create({
      roomName,
      createdBy: userId, // matches schema
    });

    res.status(201).json({
      message: "Room created successfully",
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

export default router;
