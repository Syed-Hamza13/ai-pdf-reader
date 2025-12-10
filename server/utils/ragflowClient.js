import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE = process.env.RAGFLOW_BASE_URL;
const API_KEY = process.env.RAGFLOW_API_KEY;

if (!BASE) console.error("❌ ERROR: RAGFLOW_BASE_URL is missing!");
 
const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
};

export async function queryDataset(datasetId, question) {
  const res = await axios.post(
    `${BASE}/api/v1/dialog/next`,
    {
      kb_id: datasetId,
      question
    },
    { headers }
  );

  return res.data.data.answer;
}
