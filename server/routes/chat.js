// /server/routes/chat.js

import express from "express";
import { queryDataset } from "../utils/ragflowClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { datasetId, question } = req.body;

  try {
    const answer = await queryDataset(datasetId, question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Query failed" });
  }
});

export default router;

