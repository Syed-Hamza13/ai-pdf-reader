// /server/routes/chat.js
import express from "express";
import { retrieveChunks } from "../utils/ragflowClient.js";
import { askOllama } from "../utils/ollamaClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { datasetId, documentId, question } = req.body;

  try {
    const chunks = await retrieveChunks(datasetId, question, documentId);

    const contextText = chunks
      .map((c, i) => `### CHUNK ${i + 1}\n${c.content}`)
      .join("\n\n");
    console.log("📚 Context Text:", contextText);
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

- 🚫 CRITICAL CONTEXT RESTRICTION (STRICT):
  - You are allowed to use **ONLY** the information explicitly present in the provided Context text.
  - Do NOT use prior knowledge, assumptions, general understanding, or external information.
  - Do NOT explain anything that is not directly supported by the Context.
  - Minor rephrasing or very light clarification is allowed, but **no new facts, no extensions, no examples beyond the Context**.
  - If a detail is missing or unclear in the Context, you MUST say:
    **The answer is not found in the PDF.**

---

# 📘 Context (Extracted from PDF)
${contextText}

---

# ❓ Question
${question}

---

# 🧠 Final Answer (Markdown Styled)
Provide a perfectly formatted Markdown answer strictly grounded in the Context above:
`;

    

    const answer = await askOllama(finalPrompt);
    console.log("💡 Generated Answer:", answer);
    res.json({ answer });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;
