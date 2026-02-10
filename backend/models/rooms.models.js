import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: String,
  createdBy: String,
}, {timestamps: true});

export default mongoose.model("Room", roomSchema);
