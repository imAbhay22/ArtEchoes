import jwt from "jsonwebtoken";
// authMiddleware.js
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Now available in all routes
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
