import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    const datasetId = process.env.RAGFLOW_DATASET_ID;
    const apiKey = process.env.RAGFLOW_API_KEY;

    const uploadURL = `http://localhost:9380/api/v1/datasets/${datasetId}/documents`;
    const chunkURL  = `http://localhost:9380/api/v1/datasets/${datasetId}/chunks`;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    // ✅ STEP 1 — Upload document
    const uploadRes = await axios.post(uploadURL, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const documentId = uploadRes.data.data.document_id;

    // ✅ STEP 2 — Create chunks
    await axios.post(chunkURL, {
      document_ids: [documentId],
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    res.json({
      message: "PDF uploaded & chunked successfully",
      file: {
        ...req.file,
        datasetId,
        documentId
      }
    });

  } catch (err) {
    console.error("RAG upload failed:", err.response?.data || err.message);
    res.status(500).json({ error: "RAG upload failed" });
  }
});

export default router;
