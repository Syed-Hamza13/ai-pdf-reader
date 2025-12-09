// client/src/pages/App.jsx
// ============================================
import { useState } from "react";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import ChatInput from "../components/ChatInput";
import ChatBox from "../components/ChatBox";

function App() {
  const [pdfFileInfo, setPdfFileInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleFileUploaded = (response) => {
    console.log("upload response", response);
    setPdfFileInfo(response.file || null);
    setMessages((prev) => [
      ...prev,
      {
        sender: "system",
        text: `✓ PDF uploaded successfully: ${
          response.file?.originalname || "unknown"
        }`,
      },
    ]);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        datasetId: pdfFileInfo.datasetId,
        question: userMsg,
      }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, { sender: "ai", text: data.answer }]);
  };

  return (
    <div className="app">
      <Header />

      <div className="main-content">
        <FileUpload onFileUploaded={handleFileUploaded} />

        {pdfFileInfo && (
          <div className="file-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            </svg>
            <div className="file-details">
              <strong>{pdfFileInfo.originalname}</strong>
              <span>{Math.round((pdfFileInfo.size || 0) / 1024)} KB</span>
            </div>
          </div>
        )}

        <ChatBox messages={messages} />
      </div>

      <ChatInput
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
      />
    </div>
  );
}

export default App;
