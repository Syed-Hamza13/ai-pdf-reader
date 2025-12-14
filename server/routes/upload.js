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
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, cleanName);
  },
});


const upload = multer({ storage });

// ======================
// PDF UPLOAD + CHUNKING
// ======================
router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 PDF UPLOAD & CHUNKING PROCESS STARTED");
    console.log("=".repeat(60));

    const datasetId = process.env.RAGFLOW_DATASET_ID;
    const apiKey = process.env.RAGFLOW_API_KEY;

    const uploadURL = `http://localhost:9380/api/v1/datasets/${datasetId}/documents`;
    const chunkURL  = `http://localhost:9380/api/v1/datasets/${datasetId}/chunks`;

    // Step 1: File Details
    console.log("\n📁 FILE INFORMATION:");
    console.log(`   • Filename: ${req.file.originalname}`);
    console.log(`   • Size: ${(req.file.size / 1024).toFixed(2)} KB`);
    console.log(`   • MIME Type: ${req.file.mimetype}`);
    console.log(`   • Path: ${req.file.path}`);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    // Step 2: Upload to RAGFlow
    console.log("\n⏳ STEP 1: Uploading PDF to RAGFlow...");
    console.log(`   🔗 URL: ${uploadURL}`);
    console.log(`   🔑 Dataset ID: ${datasetId}`);

    const uploadRes = await axios.post(uploadURL, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${apiKey}`
      }
    });

    const documentId = uploadRes.data.data[0].id;

    console.log("\n✅ UPLOAD SUCCESSFUL!");
    console.log(`   • Document ID: ${documentId}`);
    console.log(`   • Status: ${uploadRes.status} ${uploadRes.statusText}`);
    console.log(`   • Full Response:`, JSON.stringify(uploadRes.data, null, 2));
    
    // Step 3: Chunk Creation
    console.log("\n⏳ STEP 2: Creating chunks from document...");
    console.log(`   🔗 Chunk URL: ${chunkURL}`);
    console.log(`   📝 Document IDs: [${documentId}]`);

    const chunkRes = await axios.post(
      chunkURL,
      { document_ids: [documentId] },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("\n✅ CHUNKING SUCCESSFUL!");
    console.log(`   • Status: ${chunkRes.status} ${chunkRes.statusText}`);
    console.log(`   • Chunking Response:`, JSON.stringify(chunkRes.data, null, 2));

    if (chunkRes.data?.data?.chunks) {
      const chunkCount = Array.isArray(chunkRes.data.data.chunks) 
        ? chunkRes.data.data.chunks.length 
        : Object.keys(chunkRes.data.data.chunks).length;
      console.log(`   • Total Chunks Created: ${chunkCount}`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ PDF UPLOAD & CHUNKING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60) + "\n");

    res.json({
      message: "PDF uploaded & chunked successfully",
      file: {
        ...req.file,
        datasetId,
        documentId,
      }
    });

  } catch (err) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ PDF UPLOAD & CHUNKING FAILED!");
    console.error("=".repeat(60));
    console.error("Error Details:", err.response?.data || err.message);
    console.error("=".repeat(60) + "\n");
    res.status(500).json({ error: "RAG upload failed" });
  }
});

export default router;
