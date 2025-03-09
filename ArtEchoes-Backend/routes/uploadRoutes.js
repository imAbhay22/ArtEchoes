import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path"; // <-- Import path module
import Art from "../models/artModel.js";
import { classifyImage, moveFile } from "../utils/fileUtils.js";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// Middleware to parse JSON fields from form data
const parseArtData = (req, res, next) => {
  try {
    if (req.body.categories) {
      req.body.categories = JSON.parse(req.body.categories);
    }
    if (req.body.tags) {
      req.body.tags = JSON.parse(req.body.tags);
    }
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid data format" });
  }
};

router.post(
  "/classify",
  upload.single("artwork"),
  parseArtData,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Branch based on whether title exists.
      // If title is not provided, assume this is an auto-categorization request.
      if (!req.body.title) {
        const classification = await classifyImage(req.file.path);
        const newPath = moveFile(req.file.path, classification);
        return res.json({
          message: "Auto classification succeeded",
          category: classification,
          path: newPath ? newPath.replace(/\\/g, "/") : "",
        });
      }

      // If title is provided, this is the final upload request.
      const { title, categories, description, tags } = req.body;

      // Validate required fields for final upload
      if (!title || !categories?.length) {
        return res
          .status(400)
          .json({ error: "Title and categories are required" });
      }

      // Run classification (again, if needed)
      const classification = await classifyImage(req.file.path);

      // Replace "Auto" category with the classified result, if necessary.
      let finalCategories = categories;
      if (categories.includes("Auto")) {
        finalCategories = categories.filter((cat) => cat !== "Auto");
        if (!finalCategories.includes(classification)) {
          finalCategories.push(classification);
        }
      }

      // Move the file to the appropriate category folder
      const newPath = moveFile(req.file.path, classification);

      // Convert absolute path to relative path
      const relativeFilePath = path
        .relative(process.cwd(), newPath)
        .replace(/\\/g, "/");

      // Create a new artwork record in the database with the relative file path
      const newArt = new Art({
        title,
        categories: finalCategories,
        description: description || "",
        tags: tags || [],
        filePath: relativeFilePath, // e.g., "uploads/digital art/1741423502459-filename.jpg"
      });

      await newArt.save();

      res.status(201).json({
        message: "Artwork uploaded successfully",
        artwork: {
          id: newArt._id,
          title: newArt.title,
          filePath: newArt.filePath,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
