import { Router } from "express";
const router = Router();
import Suggestion from "../models/suggestion.js";
router.post("/", async (req, res) => {
  const { name, email, subject, suggestion, category } = req.body;

  // Basic validation: ensure none of the fields are missing or empty
  if (!name || !email || !subject || !suggestion || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newSuggestion = new Suggestion({
      name,
      email,
      subject,
      suggestion,
      category,
    });

    await newSuggestion.save();
    res.status(201).json({ message: "Suggestion submitted successfully" });
  } catch (error) {
    console.error("Error saving suggestion:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

export default router;
