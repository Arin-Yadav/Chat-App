import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: String,
    sender: String,
    roomId: String,
  },
  { timestamps: true }, // ✅ adds createdAt and updatedAt automatically
);

export default mongoose.model("Message", messageSchema);
