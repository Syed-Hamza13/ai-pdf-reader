// /server/server.js
import express from "express";
import cors from "cors";
import uploadRoute from "./routes/upload.js";
import chatRoute from "./routes/chat.js";
const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/upload", uploadRoute);
app.use("/chat", chatRoute);
// test route
app.get("/", (req, res) => {
  res.send("Backend running...");
});




const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


