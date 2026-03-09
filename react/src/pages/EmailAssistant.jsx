import { useState, useRef, useEffect } from "react";
import { API } from "../services/api";
import MarkdownContent from "../components/MarkdownContent";

const HISTORY_KEY = "ai-assist-email-history";
const MAX_HISTORY = 50;

export default function EmailAssistant() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    try {
      const toSave = messages.slice(-MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(toSave));
    } catch {
      // ignore
    }
  }, [messages]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setError("");
    setLoading(true);

    const userMsg = { id: Date.now(), role: "user", content: prompt, tone };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");

    try {
      const res = await API.post("/generate-email", { content: prompt, tone });
      const result = typeof res.data === "string" ? res.data : JSON.stringify(res.data, null, 2);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: result }]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (msg) => {
    setPrompt(msg.content);
    setTone(msg.tone || "professional");
    setEditingId(msg.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-messages">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            <div>
              <p style={{ marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
                Describe your email idea below and choose a tone.
              </p>
              <p>AI will draft a professional email for you.</p>
            </div>
          </div>
        )}

        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="chat-message user">
              <div className="msg-avatar">U</div>
              <div className="msg-body">
                <div className="msg-content">{msg.content}</div>
                <div className="msg-actions">
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Tone: {msg.tone}
                  </span>
                  <button type="button" className="btn-icon" onClick={() => handleEdit(msg)}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="chat-message assistant">
              <div className="msg-avatar">AI</div>
              <div className="msg-body">
                <MarkdownContent content={msg.content} />
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="chat-message assistant">
            <div className="msg-avatar">AI</div>
            <div className="msg-body">
              <div className="msg-content" style={{ color: "var(--text-muted)" }}>
                Generating email...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-inner">
        <div className="chat-input-wrapper">
          {error && <div className="error-msg">{error}</div>}
          <div className="chat-input-row">
            <select
              className="select"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={{ maxWidth: "160px" }}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="apology">Apology</option>
            </select>
          </div>
          <textarea
            className="textarea"
            placeholder="Describe your email... (Enter to send)"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (editingId) setEditingId(null);
            }}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <div className="chat-input-footer">
            <button
              onClick={generate}
              className="btn btn-primary"
              disabled={loading || !prompt.trim()}
            >
              {loading ? "Generating..." : "Generate Email"}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
