import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";

const router = express.Router();

// ✅ Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed!"));
    }
    cb(null, true);
  },
});

// ✅ POST /upload/pdf
router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF uploaded" });
    }

    const datasetId = process.env.RAGFLOW_DATASET_ID; // ✅ VERY IMPORTANT
    const ragflowURL = `http://localhost:9380/v1/dataset/${datasetId}/documents`;
    const apiKey = process.env.RAGFLOW_API_KEY;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post(ragflowURL, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
      },
    });

    res.json({
      message: "PDF uploaded to RAGFlow successfully",
      file: req.file,
      ragflow: response.data,
    });
  } catch (err) {
    console.error("RAG upload failed:", err.response?.data || err.message);
    res.status(500).json({ error: "RAG upload failed" });
  }
});

export default router;
