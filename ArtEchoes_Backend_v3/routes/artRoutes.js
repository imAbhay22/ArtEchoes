// routes/artworkRoutes.js
import express from "express";
import Art from "../models/artModel.js";
import ThreeDArt from "../models/ThreeDArt.js";

const router = express.Router();

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
    if (!artwork) return res.status(404).json({ error: "Artwork not found" });
    res.json({
      ...artwork.toObject(),
      filePath: artwork.filePath?.replace(/\\/g, "/"),
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch artwork" });
  }
});

// to get 3d artworks
router.get("/3d-artworks", async (req, res) => {
  try {
    const artworks = await ThreeDArt.find().sort({ createdAt: -1 }).lean();
    res.json({ artworks });
  } catch (err) {
    console.error("Fetch 3D art error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
