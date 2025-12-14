// /server/utils/ragflowClient.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE = process.env.RAGFLOW_BASE_URL;
const API_KEY = process.env.RAGFLOW_API_KEY;

const headers = {
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

export async function retrieveChunks(datasetId, question, documentId) {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("🔍 RETRIEVING CHUNKS FROM RAGFLOW");
    console.log("=".repeat(60));
    console.log(`\n📝 Query Details:`);
    console.log(`   • Question: "${question}"`);
    console.log(`   • Dataset ID: ${datasetId}`);
    console.log(`   • Document ID: ${documentId}`);

    const res = await axios.post(
      `${BASE}/api/v1/retrieval`,
      {
        question: `${question}`,
        dataset_ids: [datasetId],
        document_ids: [`${documentId}`],
        page: 1,
        page_size: 10,
        similarity_threshold: 0.2,
        vector_similarity_weight: 0.3,
        top_k: 1024,
        keyword: false,
        highlight: false,
        use_kg: false,
        toc_enhance: false,
        rerank_id: "",
        cross_languages: [],
        metadata_condition: { logic: "and", conditions: [] },
      },

      { headers }
    );

    console.log(`\n✅ RETRIEVAL SUCCESSFUL!`);
    console.log(`   • Status: ${res.status} ${res.statusText}`);

    // ---- SAFETY CHECKS ----
    if (!res.data || !res.data.data) {
      console.warn("\n⚠️  WARNING: No data returned from RAGFlow");
      return [];
    }

    if (!Array.isArray(res.data.data.chunks)) {
      console.warn("\n⚠️  WARNING: chunks array is missing or invalid");
      return [];
    }

    const chunks = res.data.data.chunks;
    console.log(`\n📦 CHUNKS RETRIEVED:`);
    console.log(`   • Total Chunks: ${chunks.length}`);
    
    chunks.forEach((chunk, index) => {
      console.log(`\n   Chunk #${index + 1}:`);
      console.log(`      ├─ ID: ${chunk.id}`);
      console.log(`      ├─ Size: ${chunk.content?.length || 0} characters`);
      console.log(`      └─ Preview: ${chunk.content?.substring(0, 80)}...`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("✨ CHUNK RETRIEVAL COMPLETED");
    console.log("=".repeat(60) + "\n");

    return chunks;
    
  } catch (err) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ CHUNK RETRIEVAL FAILED");
    console.error("=".repeat(60));
    console.error("Error Details:", err.response?.data || err.message);
    console.error("=".repeat(60) + "\n");
    return []; // <- NEVER THROW, ALWAYS RETURN SAFE EMPTY ARRAY
  }
}
