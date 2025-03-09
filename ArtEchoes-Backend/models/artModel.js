import mongoose from "mongoose";

const artSchema = new mongoose.Schema({
  title: { type: String, required: true },
  categories: { type: [String], required: true },
  description: String,
  tags: [String],
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Art = mongoose.model("Art", artSchema);

export default Art;
