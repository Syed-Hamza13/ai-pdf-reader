// /server/utils/ollamaClient.js
import axios from "axios";

export async function askOllama(prompt) {
  const res = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "llama3.2:latest",
      prompt,
      stream: true
    },
    {
      responseType: "stream",
      headers: { "Content-Type": "application/json" }
    }
  );

  return new Promise((resolve) => {
    let full = "";

    res.data.on("data", (chunk) => {
      try {
        const str = chunk.toString().trim();
        if (!str) return;

        const json = JSON.parse(str);
        if (json.response) full += json.response;
      } catch {}
    });

    res.data.on("end", () => resolve(full.trim()));
  });
}
