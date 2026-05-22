# 📘 AI PDF Reader with Document-Specific RAG

An AI-powered PDF Question Answering system built using **React.js**, **Node.js**, **RAGFlow**, and **Ollama**.  
This application allows users to upload PDFs and ask questions about the uploaded document using Retrieval-Augmented Generation (RAG).

The system performs **document-specific semantic retrieval**, ensuring answers are generated only from the uploaded PDF instead of the entire dataset.

---

# 🚀 Features

- 📄 Upload PDF files
- 🤖 Ask questions about uploaded PDFs
- 🧠 AI-generated contextual answers
- 🔍 Semantic chunk retrieval using RAGFlow
- 🎯 Document-specific retrieval using `document_id`
- ⚡ Local LLM inference using Ollama
- 📝 Markdown-formatted AI responses
- 📦 Full-stack architecture
- 🎨 Modern animated chat UI
- 📡 Real-time upload progress

---

# 🧠 How It Works

## Step 1 — Upload PDF
User uploads a PDF file from the frontend.

## Step 2 — RAGFlow Processing
Backend:
- uploads the PDF to RAGFlow
- generates chunks
- indexes semantic embeddings
- receives:
  - `datasetId`
  - `documentId`

---

## Step 3 — Ask Questions
User asks questions related to the uploaded PDF.

---

## Step 4 — Document-Specific Retrieval
The backend retrieves only relevant chunks from the uploaded document using:

```json
{
  "dataset_ids": ["DATASET_ID"],
  "document_ids": ["DOCUMENT_ID"]
}
```

This prevents retrieval from unrelated PDFs.

---

## Step 5 — AI Response Generation

Retrieved chunks are sent to Ollama (`llama3.2`) with a custom prompt.

The LLM generates:
- structured
- markdown-formatted
- context-aware answers

---

# 🏗️ Architecture

```text
Frontend (React)
       ↓
Express.js Backend
       ↓
RAGFlow Retrieval API
       ↓
Relevant PDF Chunks
       ↓
Ollama (Llama 3.2)
       ↓
Final AI Response
```

---

# 🛠️ Tech Stack

## Frontend
- React.js
- JavaScript
- CSS3
- Marked.js

---

## Backend
- Node.js
- Express.js
- Multer
- Axios
- FormData

---

## AI / RAG Stack
- RAGFlow
- Ollama
- Llama 3.2
- Semantic Search
- Vector Retrieval

---

## Infrastructure
- Docker
- Elasticsearch
- Infinity Vector Database

---

# 📂 Project Structure

```bash
client/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── styles/
│   └── utils/
│
└── .env


server/
│
├── routes/
├── utils/
├── uploads/
└── .env
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd ai-pdf-reader
```

---

# 📦 Backend Setup

## Install Dependencies

```bash
cd server
npm install
```

---

## Configure Environment Variables

Create `.env`

```env
RAGFLOW_BASE_URL=http://localhost:9380
RAGFLOW_API_KEY=your_ragflow_api_key
RAGFLOW_DATASET_ID=your_dataset_id
```

---

## Start Backend

```bash
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🎨 Frontend Setup

## Install Dependencies

```bash
cd client
npm install
```

---

## Create `.env`

```env
PORT=7576
```

---

## Start Frontend

```bash
npm start
```

Frontend runs on:

```bash
http://localhost:7576
```

---

# 🤖 Ollama Setup

Install Ollama:

```bash
https://ollama.com
```

Pull model:

```bash
ollama pull llama3.2
```

Run Ollama server:

```bash
ollama serve
```

---

# 🐳 RAGFlow Setup

Start RAGFlow using Docker:

```bash
docker compose up -d
```

Ensure these services are running:

- Elasticsearch
- Infinity
- MySQL
- Redis
- MinIO
- RAGFlow Server

---

# 🔥 API Workflow

## Upload PDF

```http
POST /upload/pdf
```

Returns:

```json
{
  "datasetId": "...",
  "documentId": "...",
  "filename": "..."
}
```

---

## Ask Question

```http
POST /chat
```

Request:

```json
{
  "datasetId": "...",
  "documentId": "...",
  "question": "What is internet?"
}
```

---

# 🧠 Core Concepts Used

- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Vector Embeddings
- Chunk-Based Retrieval
- Prompt Engineering
- Document-Specific Filtering
- Local LLM Inference
- REST APIs

---

# 🎯 Why Document-Specific Retrieval Matters

Most RAG systems search across the entire dataset.

This project improves retrieval accuracy by filtering results using:
- `dataset_id`
- `document_id`

Benefits:
- higher precision
- reduced hallucinations
- no cross-document contamination
- more reliable AI answers

---

# 📸 Future Improvements

- Multi-PDF Chat
- PDF Switching
- Streaming AI Responses
- Page Number Citations
- OCR Support
- Authentication System
- Chat History
- Highlight Referenced Chunks

---

# 📌 Resume Highlights

- Built a full-stack AI-powered PDF question-answering system
- Implemented document-specific semantic retrieval using RAGFlow
- Integrated Ollama Llama 3.2 for local AI inference
- Designed chunk-based vector retrieval architecture
- Engineered prompt system to reduce hallucinations
- Developed modern React-based chat interface

---

# 👨‍💻 Author

Developed by **Syed HamA**

---

# 📄 License

This project is licensed under the MIT License.
