import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Art from "../models/artModel.js";
import ThreeDArt from "../models/ThreeDArt.js";
import { classifyImage, moveFile } from "../utils/fileUtils.js";

const router = express.Router();

// Multer config for general uploads (classification)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

// Multer config for 3D art uploads (separate folders)
const storage3D = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads/3d-art/thumbnails or uploads/3d-art/models
    const baseDir = path.join("uploads", "3d-art");
    const subDir = file.fieldname === "thumbnail" ? "thumbnails" : "models";
    const uploadPath = path.join(baseDir, subDir);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload3D = multer({
  storage: storage3D,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Parse categories and tags if JSON strings
const parseArtData = (req, res, next) => {
  try {
    req.body.categories = req.body.categories
      ? JSON.parse(req.body.categories)
      : [];
    req.body.tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    next();
  } catch {
    return res.status(400).json({ error: "Invalid categories or tags format" });
  }
};

// Existing classification upload route
router.post(
  "/classify",
  upload.single("artwork"),
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

// New 3D art upload route
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
