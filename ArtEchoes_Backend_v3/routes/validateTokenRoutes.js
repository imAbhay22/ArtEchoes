// routes/validateTokenRoutes.js
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
