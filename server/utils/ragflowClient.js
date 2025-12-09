// /server/utils/ragflowClient.js

import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const BASE = process.env.RAGFLOW_BASE_URL;
const API_KEY = process.env.RAGFLOW_API_KEY;

const headers = {
  Authorization: `Bearer ${API_KEY}`
};

// 1️⃣ Create Dataset
export async function createDataset(name) {
  const res = await axios.post(
    `${BASE}/v1/kb/create`,
    { name },
    { headers }
  );
  return res.data.data.kb_id;
}

// 2️⃣ Upload PDF to Dataset
export async function uploadToDataset(datasetId, filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const res = await axios.post(
    `${BASE}/v1/datasets/${datasetId}/documents`,
    form,
    { headers: { ...headers, ...form.getHeaders() } }
  );

  return res.data;
}

// 3️⃣ Ask Question
export async function queryDataset(datasetId, question) {
  const res = await axios.post(
    `${BASE}/v1/dialog/next`,
    {
      kb_id: datasetId,
      question
    },
    { headers }
  );

  return res.data.data.answer;
}

