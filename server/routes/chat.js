// /server/routes/chat.js
import express from "express";
import { retrieveChunks } from "../utils/ragflowClient.js";
import { askOllama } from "../utils/ollamaClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { datasetId, question } = req.body;

  try {
    const chunks = await retrieveChunks(datasetId, question);

    const contextText = chunks
      .map((c, i) => `### CHUNK ${i + 1}\n${c.content}`)
      .join("\n\n");

    // 🔥 SUPER IMPORTANT BETTER PROMPT
    const finalPrompt = `
You are an AI that outputs answers ONLY in **clean, beautiful Markdown**.

### HARD RULES:
- MUST use proper Markdown headings (#, ##, ###)
- MUST include bold titles, subheadings, bullet lists
- MUST structure content into sections
- MUST never output plain paragraphs only
- MUST make the answer visually readable and formatted
- If the PDF doesn't contain the answer → ONLY reply:
  **The answer is not found in the PDF.**

---

# 📘 Context (Extracted from PDF)
${contextText}

---

# ❓ Question
${question}

---

# 🧠 Final Answer (Markdown Styled)
Provide a perfectly formatted Markdown answer:
`;

    const answer = await askOllama(finalPrompt);

    res.json({ answer });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;
