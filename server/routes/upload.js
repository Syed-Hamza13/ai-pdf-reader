// server/routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";
import { extractTextFromPDF } from "../lib/pdfParser.js";

const router = express.Router();

// TEMP storage (later we handle properly)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // folder auto bana lena
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files allowed!"));
        }
        cb(null, true);
    }
});

// POST /upload/pdf
router.post("/pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF uploaded!" });
  }

  try {
    const text = await extractTextFromPDF(req.file.path);

    res.json({
      message: "PDF received & parsed",
      text: text.substring(0, 500) + "...", // just preview
      file: req.file
    });
  } catch (err) {
    console.error("PDF parse error:", err);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});


export default router;
 




