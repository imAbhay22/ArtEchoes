import mongoose from "mongoose";

const threeDArtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    thumbnail: { type: String, required: true }, // path or URL
    modelFile: { type: String, required: true }, // path or URL
    category: { type: String, default: "3d-art" },
    artist: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ThreeDArt", threeDArtSchema);
