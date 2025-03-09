import { Schema, model } from "mongoose";

const ProfileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  lastEdit: { type: Date, default: null },
  artworks: {
    type: [
      {
        title: String,
        imageUrl: String,
        // Additional artwork fields if needed
      },
    ],
    default: [], // Ensure artworks is always an array
  },
});

export default model("Profile", ProfileSchema);
