import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import artRoutes from "./routes/artRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for cross-origin requests like API calls from frontend to backend
// we do this to allow the frontend to make requests to the backend, cors is a middleware that allows this by setting the headers of the response to allow requests from different origins (like localhost:3000 for frontend and localhost:5000 for backend)
app.use(
  cors({
    origin: true, // Allows all origins (for now) - can be changed to specific origin like "http://localhost:3000" for frontend server
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allows session cookies and other credentials to be sent along with the request
  })
);
app.options("*", cors());

// Body parsing middleware (for form data handling)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route configurations (existing API routes)
app.use("/api", artRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/suggestions", suggestionRoutes);

// New classification-based upload endpoint
app.use("/api/upload", uploadRoutes);

// 404 Error handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
