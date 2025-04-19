// routes/profileRoutes.js
import express from "express";
import { authenticate } from "../authentication/authMiddleware.js";
import Profile from "../models/profile.js";
import Art from "../models/artModel.js";

// ← import the centralized profile‑pic uploader
import { uploadProfilePic } from "../middleware/upload.js";

const router = express.Router();

// Get current user's profile + artworks
router.get("/", authenticate, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      profile = new Profile({ userId: req.userId });
      await profile.save();
    }

    const artworks = await Art.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    const profileObj = profile.toObject();
    profileObj.artworks = artworks.map((art) => ({
      ...art,
      filePath: art.filePath ? art.filePath.replace(/\\/g, "/") : "",
    }));

    res.json(profileObj);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile fields
router.put("/", authenticate, async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, lastEdit: Date.now() },
      { new: true, runValidators: true }
    );
    updated
      ? res.json(updated)
      : res.status(404).json({ message: "Profile not found" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Upload profile picture
router.post(
  "/upload",
  authenticate,
  uploadProfilePic.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No valid image uploaded" });
      }

      const profilePicPath = `/uploads/profile-pics/${req.file.filename}`;
      const updated = await Profile.findOneAndUpdate(
        { userId: req.userId },
        { profilePic: profilePicPath },
        { new: true, upsert: true }
      );

      res.json({
        profilePic: updated.profilePic,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Image upload failed" });
    }
  }
);

// Multer error handler (unchanged)
router.use((err, _req, res, next) => {
  if (err.name === "MulterError")
    return res.status(400).json({ message: err.message });
  next(err);
});

export default router;
