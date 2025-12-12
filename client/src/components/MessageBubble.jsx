// ============================================
// client/src/components/MessageBubble.jsx
// ============================================
function MessageBubble({ sender, text }) {
  return (
    <div className={`message-wrapper ${sender}`}>
      <div className={`message-bubble ${sender}`}>
        {sender === "ai" && (
          <div className="ai-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        )}
        <div
          className="message-text"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </div>
  );
}

export default MessageBubble;
