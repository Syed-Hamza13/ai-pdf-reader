// ============================================
// client/src/components/ChatInput.jsx
// ============================================
import { useRef, useEffect } from "react";

function ChatInput({ message, setMessage, onSend }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 180) + "px";
    }
  }, [message]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="input-container">
      <div className="input-box">
        <textarea
          ref={textareaRef}
          placeholder="Ask anything about your PDF..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`send-btn ${message.trim() ? 'active' : ''}`}
          onClick={onSend}
          disabled={!message.trim()}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
