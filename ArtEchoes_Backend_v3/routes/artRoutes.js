import express from "express";
import multer from "multer";
import fs from "fs";
import Art from "../models/artModel.js";

const router = express.Router();

// Ensure the uploads directory exists
const createUploadsFolder = () => {
  const uploadPath = "uploads/";
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, createUploadsFolder());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Allowed file types
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/heif",
  "application/pdf",
  "application/octet-stream",
  "model/fbx",
  "model/obj",
  "model/stl",
  "model/glb",
  "model/gltf",
];

// Validate file type
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024, files: 1 }, // 20MB limit
});

// Middleware to parse JSON fields
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

// Upload artwork
router.post(
  "/upload",
  upload.single("artwork"),
  parseArtData,
  async (req, res) => {
    try {
      const {
        title,
        artist = "",
        categories,
        description,
        price,
        tags,
        userId,
      } = req.body;

      if (!title || !categories?.length || !userId) {
        return res
          .status(400)
          .json({ error: "Title, categories, and userId are required" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const newArt = new Art({
        title,
        artist: artist || "Unknown Artist",
        categories,
        description: description || "",
        price: price !== undefined ? parseFloat(price) : 0,
        tags: tags || [],
        filePath: req.file.path.replace(/\\/g, "/"),
        userId,
      });

      await newArt.save();

      res.status(201).json({
        message: "Artwork uploaded successfully",
        artwork: {
          id: newArt._id,
          title: newArt.title,
          artist: newArt.artist,
          filePath: newArt.filePath,
          userId: newArt.userId,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      if (req.file) fs.unlink(req.file.path, () => {});
      res
        .status(error.name === "ValidationError" ? 400 : 500)
        .json({ error: error.message || "Failed to upload artwork" });
    }
  }
);

// Get artworks by user
router.get("/artworks/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const artworks = await Art.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json({
      artworks: artworks.map((art) => ({
        ...art,
        filePath: art.filePath.replace(/\\/g, "/"),
      })),
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch user's artworks" });
  }
});

// Get all artworks with pagination
router.get("/artworks", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const artworks = await Art.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Art.countDocuments();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      artworks: artworks.map((art) => ({
        ...art,
        filePath: art.filePath?.replace(/\\/g, "/"),
      })),
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch artworks" });
  }
});

// Get single artwork by ID
router.get("/artworks/:id", async (req, res) => {
  try {
    const artwork = await Art.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.json({
      ...artwork.toObject(),
      filePath: artwork.filePath?.replace(/\\/g, "/"),
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch artwork" });
  }
});

export default router;
