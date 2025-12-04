import axios from "axios";

export const generateEmbedding = async (text) => {
  const response = await axios.post("http://localhost:11434/api/embeddings", {
    model: "nomic-embed-text",
    prompt: text
  });

  return response.data.embedding;
}; 
