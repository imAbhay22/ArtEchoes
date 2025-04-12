import mongoose from "mongoose";

const artSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  categories: { type: [String], required: true },
  description: String,
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  tags: [String],
  filePath: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Art = mongoose.model("Art", artSchema);

export default Art;
