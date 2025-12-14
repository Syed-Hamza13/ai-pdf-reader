// /server/utils/ollamaClient.js
import axios from "axios";

export async function askOllama(prompt) {
  console.log("\n" + "=".repeat(60));
  console.log("🤖 SENDING REQUEST TO OLLAMA");
  console.log("=".repeat(60));
  console.log(`\n📤 Request Details:`);
  console.log(`   • Model: llama3.2:latest`);
  console.log(`   • Streaming: Yes`);
  console.log(`   • Prompt Length: ${prompt.length} characters`);

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

  console.log(`\n✅ CONNECTION ESTABLISHED WITH OLLAMA`);
  console.log(`   • Status: 200 OK`);
  console.log(`\n📡 STREAMING RESPONSE FROM AI:\n`);
  console.log("─".repeat(60));

  return new Promise((resolve) => {
    let full = "";
    let tokenCount = 0;
    let startTime = Date.now();

    res.data.on("data", (chunk) => {
      try {
        const str = chunk.toString().trim();
        if (!str) return;

        const json = JSON.parse(str);
        if (json.response) {
          full += json.response;
          tokenCount++;
          
          // Print each token/chunk as it arrives
          process.stdout.write(json.response);
          
          // Log metadata if available
          if (json.done) {
            console.log("\n" + "─".repeat(60));
          }
        }
      } catch {}
    });

    res.data.on("end", () => {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log("\n" + "=".repeat(60));
      console.log("✨ AI RESPONSE COMPLETE");
      console.log("=".repeat(60));
      console.log(`\n📊 Response Statistics:`);
      console.log(`   • Total Tokens: ${tokenCount}`);
      console.log(`   • Response Length: ${full.length} characters`);
      console.log(`   • Time Taken: ${duration} seconds`);
      console.log(`   • Speed: ${(tokenCount / parseFloat(duration)).toFixed(2)} tokens/sec`);
      console.log("\n" + "=".repeat(60) + "\n");
      
      resolve(full.trim());
    });

    res.data.on("error", (err) => {
      console.error("\n❌ STREAMING ERROR:", err);
    });
  });
}
