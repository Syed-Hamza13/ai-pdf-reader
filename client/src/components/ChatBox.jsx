// ============================================
// client/src/components/ChatBox.jsx
// ============================================
import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

function ChatBox({ messages }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-area">
      {messages.length === 0 ? (
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3>Start a Conversation</h3>
          <p>Upload a PDF and ask questions about it</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble key={index} sender={msg.sender} text={msg.text} />
        ))
      )}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatBox;

