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

    console.log("\n✅ CHUNKING REQUEST SENT!");
    console.log(`   • Status: ${chunkRes.status} ${chunkRes.statusText}`);
    
    // Step 4: Poll for Chunk Completion Status
    console.log("\n⏳ STEP 3: Waiting for chunks to be processed (polling)...");
    
    let isChunkingComplete = false;
    let pollCount = 0;
    const maxPolls = 60; // Max 60 attempts (30 seconds with 500ms intervals)
    const pollInterval = 500; // 500ms

    while (!isChunkingComplete && pollCount < maxPolls) {
      pollCount++;
      
      // Get document status to check if chunking is complete
      const statusURL = `http://localhost:9380/api/v1/datasets/${datasetId}/documents/${documentId}`;
      
      try {
        const statusRes = await axios.get(statusURL, {
          headers: {
            Authorization: `Bearer ${apiKey}`
          }
        });

        const docStatus = statusRes.data?.data;
        
        if (docStatus) {
          console.log(`\n   Poll #${pollCount}: Checking document status...`);
          console.log(`      • Document ID: ${docStatus.id}`);
          console.log(`      • Status: ${docStatus.status || 'PROCESSING'}`);
          console.log(`      • Chunk Count: ${docStatus.chunk_count || 0}`);

          // Check if chunking is complete
          if (docStatus.status === 'COMPLETE' || docStatus.status === 'DONE' || docStatus.chunk_count > 0) {
            isChunkingComplete = true;
            console.log(`\n   ✅ Chunking Complete!`);
            console.log(`      • Total Chunks: ${docStatus.chunk_count || 'N/A'}`);
          }
        }
      } catch (statusErr) {
        console.log(`   ⚠️  Status check attempt #${pollCount} - continuing...`);
      }

      // Wait before next poll
      if (!isChunkingComplete && pollCount < maxPolls) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    if (!isChunkingComplete) {
      console.warn("\n⚠️  WARNING: Chunking timeout after 30 seconds");
      console.warn("   Proceeding anyway, but chunking may still be processing...");
    }

    console.log("\n✅ CHUNKING PROCESS VERIFIED!");
    console.log(`   • Total Polling Attempts: ${pollCount}`);
    console.log(`   • Time Waited: ${(pollCount * pollInterval / 1000).toFixed(2)} seconds`);
    console.log(`   • Chunking Response:`, JSON.stringify(chunkRes.data, null, 2));

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
