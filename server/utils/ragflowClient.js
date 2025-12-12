// /server/utils/ragflowClient.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE = process.env.RAGFLOW_BASE_URL;
const API_KEY = process.env.RAGFLOW_API_KEY;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
};

export async function retrieveChunks(datasetId, question) {
  try {
    const res = await axios.post(
      `${BASE}/api/v1/retrieval`,
      {
        question,
        dataset_ids: [datasetId],
        page: 1,
        page_size: 10,
        similarity_threshold: 0.2,
        vector_similarity_weight: 0.3,
        top_k: 50,
        keyword: false,
        highlight: false,
        use_kg: false,
        toc_enhance: false,
        rerank_id: "",
        cross_languages: [],
        metadata_condition: { logic: "and", conditions: [] }
      },
      { headers }
    );

    // ---- SAFETY CHECKS ----
    if (!res.data || !res.data.data) {
      console.warn("⚠ No data returned from RAGFlow");
      return [];
    }

    if (!Array.isArray(res.data.data.chunks)) {
      console.warn("⚠ chunks missing or invalid");
      return [];
    }

    return res.data.data.chunks;

  } catch (err) {
    console.error("❌ Retrieval error:", err.response?.data || err);
    return []; // <- NEVER THROW, ALWAYS RETURN SAFE EMPTY ARRAY
  }
}
