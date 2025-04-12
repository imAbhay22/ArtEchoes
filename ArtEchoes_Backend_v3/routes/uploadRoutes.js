import express from "express";
import multer from "multer";
import path from "path";
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
    if (req.body.categories)
      req.body.categories = JSON.parse(req.body.categories);
    if (req.body.tags) req.body.tags = JSON.parse(req.body.tags);
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid data format" });
  }
};

// Classify and upload artwork
router.post(
  "/classify",
  upload.single("artwork"),
  parseArtData,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const {
        title,
        artist = "",
        categories,
        description,
        price,
        tags,
        userId,
      } = req.body;

      // Ensure title is provided
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      // Ensure required fields are provided for final upload
      if (!userId) {
        return res
          .status(400)
          .json({ error: "userId is required for saving artwork" });
      }
      if (!categories?.length) {
        return res.status(400).json({ error: "Categories are required" });
      }

      // Run classification only if "Auto" is one of the selected categories.
      let classification;
      if (categories.includes("Auto")) {
        classification = await classifyImage(req.file.path);
      }

      // Replace "Auto" category with the classified result,
      // or simply use the selected category if "Auto" is not chosen.
      let finalCategories = categories.includes("Auto")
        ? [...categories.filter((cat) => cat !== "Auto"), classification]
        : categories;

      // Determine which category to use for moving the file.
      // If classification was run, use that result; otherwise, use the first category.
      const categoryForMove = categories.includes("Auto")
        ? classification
        : finalCategories[0];

      // Move the file to the appropriate category folder using the determined category.
      const newPath = moveFile(req.file.path, categoryForMove);

      // Convert absolute path to relative path
      const relativeFilePath = path
        .relative(process.cwd(), newPath)
        .replace(/\\/g, "/");

      // Save artwork data in the database
      const newArt = new Art({
        title,
        artist: artist || "Unknown Artist",
        categories: finalCategories,
        description: description || "",
        price: price !== undefined ? parseFloat(price) : 0,
        tags: tags || [],
        filePath: relativeFilePath,
        userId,
      });

      await newArt.save();

      res.status(201).json({
        message: `Artwork uploaded successfully (and Categorized as "${categoryForMove}")`,
        artwork: {
          id: newArt._id,
          title: newArt.title,
          artist: newArt.artist,
          filePath: newArt.filePath,
          userId: newArt.userId,
          categories: finalCategories,
          categorizedAs: categoryForMove,
          price: newArt.price,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
