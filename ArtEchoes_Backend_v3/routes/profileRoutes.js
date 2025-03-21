import { Router } from "express";
import fs from "fs";
import path from "path";
const router = Router();
import Profile from "../models/profile.js";
import multer, { diskStorage } from "multer";
import { authenticate } from "./authMiddleware.js"; // Import your auth middleware

// Define paths and configuration
const profilePicsFolder = path.resolve("ProfileUpload");
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/tiff",
  "image/bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/vnd.wap.wbmp",
  "image/apng",
  "image/avif",
  "image/flif",
  "image/x-portable-pixmap",
  "image/x-portable-anymap",
  "image/x-portable-bitmap",
  "image/x-xbitmap",
  "image/x-xbm",
  "image/x-ico",
  "image/x-win-bitmap",
  "image/x-jg",
  "image/x-jng",
];

// Create upload directory if missing
if (!fs.existsSync(profilePicsFolder)) {
  fs.mkdirSync(profilePicsFolder, { recursive: true });
}

// Configure Multer with security filters
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, profilePicsFolder),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  allowedMimeTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Invalid file type. Only images are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Get current user's profile
router.get("/", authenticate, async (req, res) => {
  try {
    const profile =
      (await Profile.findOne({ userId: req.userId })) ||
      new Profile({ userId: req.userId });

    if (!profile._id) await profile.save();

    res.json(profile);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile (bio and other text fields)
router.put("/", authenticate, async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, lastEdit: Date.now() },
      { new: true, runValidators: true }
    );

    updatedProfile
      ? res.json(updatedProfile)
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
  upload.single("profilePic"),
  async (req, res) => {
    console.log("Upload route hit. Request received.");
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No valid image uploaded" });
      }

      const profilePicPath = `/profile-pictures/${req.file.filename}`;

      const updatedProfile = await Profile.findOneAndUpdate(
        { userId: req.userId },
        { profilePic: profilePicPath },
        { new: true, upsert: true } // Create the profile if it doesn't exist
      );

      // Check if updatedProfile is not null (shouldn't be with upsert: true)
      if (!updatedProfile) {
        return res.status(500).json({ message: "Failed to update profile." });
      }

      res.json({
        profilePic: updatedProfile.profilePic,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Image upload failed" });
    }
  }
);

// Error handling for file uploads
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

export default router;
