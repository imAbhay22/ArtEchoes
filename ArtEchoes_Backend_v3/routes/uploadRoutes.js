// routes/uploadRoutes.js
import express from "express";
import path from "path";
import Art from "../models/artModel.js";
import ThreeDArt from "../models/ThreeDArt.js";
import { classifyImage, moveFile } from "../utils/fileUtils.js";
import { extractZipModel } from "../utils/unzipModel.js";

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

router.post(
  "/api/upload/3d",
  upload3D.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "modelFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const modelFile = req.files?.modelFile?.[0];

      if (!modelFile)
        return res.status(400).json({ error: "Model file missing" });

      const isZip = modelFile.mimetype.includes("zip");
      if (isZip) {
        const outputDir = path.join(
          path.dirname(modelFile.path),
          path.basename(modelFile.filename, path.extname(modelFile.filename))
        );

        fs.mkdirSync(outputDir, { recursive: true });

        const modelFiles = extractZipModel(modelFile.path, outputDir);

        if (!modelFiles) {
          return res.status(500).json({ error: "Failed to extract ZIP file" });
        }

        fs.unlinkSync(modelFile.path); // delete ZIP

        return res.status(200).json({
          message: "ZIP extracted",
          extractedTo: outputDir,
          modelsFound: modelFiles.map((file) => file.replace(/\\/g, "/")), // convert \ to / for compatibility
        });
      }

      res.status(200).json({
        message: "3D model uploaded",
        modelFile: modelFile.filename,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

router.get("/3d-art/model-path/:id", async (req, res) => {
  try {
    const art = await ThreeDArt.findById(req.params.id);
    if (!art) return res.status(404).json({ error: "Artwork not found" });

    const zipFilePath = art.modelFile;
    const baseFolder = zipFilePath.replace(/\.zip$/i, "");

    const absolutePath = path.join(process.cwd(), baseFolder);

    if (!fs.existsSync(absolutePath)) {
      return res
        .status(404)
        .json({ error: "Extracted model folder not found" });
    }

    const allFiles = [];
    const SUPPORTED_MODEL_EXTENSIONS = [
      ".obj",
      ".stl",
      ".fbx",
      ".dae",
      ".gltf",
      ".glb",
      ".3ds",
      ".ply",
      ".3mf",
    ];

    function searchDir(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          searchDir(fullPath);
        } else {
          const ext = path.extname(fullPath).toLowerCase();
          if (SUPPORTED_MODEL_EXTENSIONS.includes(ext)) {
            allFiles.push(fullPath);
          }
        }
      }
    }

    searchDir(absolutePath);

    if (allFiles.length === 0) {
      return res.status(404).json({ error: "No valid 3D model found" });
    }

    const firstModel = allFiles[0];
    const relPath = path
      .relative(process.cwd(), firstModel)
      .replace(/\\/g, "/");

    res.json({ modelUrl: `http://localhost:5000/${relPath}` });
  } catch (err) {
    console.error("Error getting model path:", err);
    res.status(500).json({ error: "Failed to get model path" });
  }
});

export default router;
