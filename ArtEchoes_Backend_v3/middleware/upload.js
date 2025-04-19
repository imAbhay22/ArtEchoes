// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Create directory if it doesn't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// 1️⃣ — FILE FILTERS
const imageFileFilter = (_req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  cb(isImage ? null : new Error("Only image files are allowed"), isImage);
};

const modelMimeTypes = [
  "model/obj",
  "model/stl",
  "application/octet-stream",
  "application/3mf",
  "application/vnd.ms-pki.stl",
  "model/gltf+json",
  "model/gltf-binary",
];
const modelFileFilter = (_req, file, cb) => {
  const isModel = modelMimeTypes.includes(file.mimetype);
  cb(isModel ? null : new Error("Only 3D model files are allowed"), isModel);
};

// 2️⃣ — CLASSIFY ARTWORK (single image upload to /uploads)
const classifyStorage = multer.diskStorage({
  destination: (_, _f, cb) => cb(null, ensureDir("uploads")),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
export const uploadClassify = multer({
  storage: classifyStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

// 3️⃣ — 3D ART UPLOAD (thumbnail + model file)
const threeDBase = path.join("uploads", "3d-art");
const threeDStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const folder = file.fieldname === "thumbnail" ? "thumbnails" : "models";
    cb(null, ensureDir(path.join(threeDBase, folder)));
  },
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
export const upload3D = multer({
  storage: threeDStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "thumbnail") return imageFileFilter(req, file, cb);
    if (file.fieldname === "modelFile") return modelFileFilter(req, file, cb);
    cb(new Error("Unexpected field"), false);
  },
});

// 4️⃣ — PROFILE PICTURE UPLOAD
const profileStorage = multer.diskStorage({
  destination: (_, _f, cb) => cb(null, ensureDir("uploads/profile-pics")),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
export const uploadProfilePic = multer({
  storage: profileStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: imageFileFilter, // now supports all image types
});
