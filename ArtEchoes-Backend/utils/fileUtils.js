import fs from "fs";
import path from "path";
import { spawn } from "child_process";

export const moveFile = (sourcePath, category) => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  const targetDir = path.join(uploadsDir, category);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fileName = path.basename(sourcePath);
  const newPath = path.join(targetDir, fileName);

  fs.renameSync(sourcePath, newPath);
  return newPath;
};

export const classifyImage = async (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("C:\\Program Files\\Python311\\python.exe", [
      "clip_script.py",
      filePath,
    ]);

    let result = "";
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
      reject(data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) return reject("Classification failed");
      resolve(result.trim());
    });
  });
};

export const cleanupUploads = () => {
  const tempDir = path.join(process.cwd(), "uploads");
  fs.readdirSync(tempDir).forEach((file) => {
    if (file !== ".gitkeep") {
      // Keep a .gitkeep file in empty directories
      const filePath = path.join(tempDir, file);
      fs.unlinkSync(filePath);
    }
  });
};
