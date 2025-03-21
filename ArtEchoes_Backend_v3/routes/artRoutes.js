import express from "express";
import multer from "multer"; // Middleware for handling `multipart/form-data`
import fs from "fs"; // File system module for Node.js (to manage files)
import Art from "../models/artModel.js";

const router = express.Router();

// Configure storage with proper error handling
const createUploadsFolder = () => {
  const uploadPath = "uploads/";
  if (!fs.existsSync(uploadPath)) {
    // if the folder doesn't exist yet, create it
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

const storage = multer.diskStorage({
  // diskStorage is a storage engine for multer that gives you full control over storing files to disk
  destination: (req, file, cb) => {
    cb(null, createUploadsFolder());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Enhanced file validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/bmp", // BMP format
    "image/tiff", // TIFF format
    "image/heif", // HEIF format
    "application/pdf",
    "application/octet-stream", // For some 3D model types
    "model/fbx", // FBX format
    "model/obj", // OBJ format
    "model/stl", // STL format
    "model/glb", // GLB format
    "model/gltf", // GLTF format
  ];

  if (allowedTypes.includes(file.mimetype)) {
    // mimetype is the type of the file that was uploaded by the user (e.g. image/jpeg)
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
    files: 1,
  },
});

// Middleware to handle form data parsing
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

// Upload endpoint
router.post(
  "/upload",
  upload.single("artwork"),
  parseArtData,
  async (req, res) => {
    try {
      const { title, categories, description, tags } = req.body;

      if (!title || !categories?.length) {
        return res
          .status(400)
          .json({ error: "Title and categories are required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const newArt = new Art({
        title,
        categories,
        description: description || "",
        tags: tags || [],
        // Ensure filePath is always a string; replacing backslashes for consistency
        filePath: req.file.path ? req.file.path.replace(/\\/g, "/") : "",
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

      // Cleanup uploaded file if error occurred
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }

      const statusCode = error.name === "ValidationError" ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || "Failed to upload artwork",
      });
    }
  }
);
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
        filePath: art.filePath ? art.filePath.replace(/\\/g, "/") : "",
      })),
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch artworks" });
  }
});

// Get single artwork
router.get("/artworks/:id", async (req, res) => {
  try {
    const artwork = await Art.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    res.json({
      ...artwork.toObject(),
      // Check if filePath exists before calling replace
      filePath: artwork.filePath ? artwork.filePath.replace(/\\/g, "/") : "",
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch artwork" });
  }
});

export default router;
