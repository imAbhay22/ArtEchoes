import { Router } from "express";
import fs from "fs";
import path from "path";
const router = Router();
import Profile from "../models/profile.js";
import multer, { diskStorage } from "multer";

// Define a new folder name for profile pictures
const profilePicsFolder = "ProfileUpload";

// Create the folder if it doesn't exist
if (!fs.existsSync(profilePicsFolder)) {
  fs.mkdirSync(profilePicsFolder, { recursive: true });
}

// Set up Multer for file uploads (storing files in "ProfilePics" folder)
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, profilePicsFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// GET /api/profile/:userId – Fetch user profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let profile = await Profile.findOne({ userId });

    // If no profile exists, create a default one
    if (!profile) {
      profile = new Profile({ userId });
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile/:userId – Update user profile
router.put("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Update the profile document with new data
    const profile = await Profile.findOneAndUpdate({ userId }, updateData, {
      new: true,
    });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/profile/:userId/upload – Handle profile picture upload
router.post(
  "/profile/:userId/upload",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      // req.file contains the file info provided by Multer
      const filePath = req.file.path;

      // Update the profile with the new profilePic path
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { profilePic: filePath },
        { new: true }
      );
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json({ profilePic: filePath });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
