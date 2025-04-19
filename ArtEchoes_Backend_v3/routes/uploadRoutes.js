// routes/uploadRoutes.js
import express from "express";
import path from "path";
import Art from "../models/artModel.js";
import ThreeDArt from "../models/ThreeDArt.js";
import { classifyImage, moveFile } from "../utils/fileUtils.js";

// ← pull in both upload middlewares
import { uploadClassify, upload3D } from "../middleware/upload.js";

const router = express.Router();

// Parse categories/tags JSON
const parseArtData = (req, res, next) => {
  try {
    req.body.categories = req.body.categories
      ? JSON.parse(req.body.categories)
      : [];
    req.body.tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    next();
  } catch {
    return res.status(400).json({ error: "Invalid JSON for categories/tags" });
  }
};

// — classify route (image + auto‑categorization) —
router.post(
  "/classify",
  uploadClassify.single("artwork"),
  parseArtData,
  async (req, res) => {
    try {
      const {
        title,
        artist = "Unknown Artist",
        categories = [],
        description = "",
        price = 0,
        tags = [],
        userId,
      } = req.body;

      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      if (!title) return res.status(400).json({ error: "Title is required" });
      if (!userId) return res.status(400).json({ error: "userId is required" });
      if (!categories.length)
        return res
          .status(400)
          .json({ error: "At least one category is required" });

      let finalCategories = [...categories];
      let targetCategory = categories[0];

      if (categories.includes("Auto")) {
        const autoCategory = await classifyImage(req.file.path);
        finalCategories = categories
          .filter((c) => c !== "Auto")
          .concat(autoCategory);
        targetCategory = autoCategory;
      }

      const movedPath = moveFile(req.file.path, targetCategory);
      const relativePath = path
        .relative(process.cwd(), movedPath)
        .replace(/\\/g, "/");

      const newArt = new Art({
        title,
        artist,
        categories: finalCategories,
        description,
        price: parseFloat(price),
        tags,
        filePath: relativePath,
        userId,
      });
      await newArt.save();

      return res.status(201).json({
        message: `Artwork uploaded successfully${
          categories.includes("Auto")
            ? ` and categorized as "${targetCategory}"`
            : ""
        }`,
        artwork: {
          id: newArt._id,
          title,
          artist,
          filePath: relativePath,
          categories: finalCategories,
          price: newArt.price,
          userId,
          categorizedAs: targetCategory,
        },
      });
    } catch (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

// — 3D art upload —
router.post(
  "/3d-art",
  upload3D.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "modelFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description = "",
        price = 0,
        userId,
        artist = "Unknown Artist",
      } = req.body;

      if (!req.files?.thumbnail || !req.files?.modelFile) {
        return res
          .status(400)
          .json({ error: "Thumbnail and modelFile are required" });
      }
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const thumbFile = req.files.thumbnail[0];
      const modelFile = req.files.modelFile[0];

      const thumbRel = path
        .relative(process.cwd(), thumbFile.path)
        .replace(/\\/g, "/");
      const modelRel = path
        .relative(process.cwd(), modelFile.path)
        .replace(/\\/g, "/");

      const newArt3D = new ThreeDArt({
        title,
        description,
        price: parseFloat(price),
        thumbnail: thumbRel,
        modelFile: modelRel,
        category: "3d-art",
        artist,
        userId,
      });
      await newArt3D.save();

      return res
        .status(201)
        .json({ message: "3D art uploaded successfully", artwork: newArt3D });
    } catch (err) {
      console.error("3D upload error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;
