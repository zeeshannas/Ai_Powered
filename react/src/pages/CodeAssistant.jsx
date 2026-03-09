import { useState, useRef, useEffect } from "react";
import { API } from "../services/api";
import CopyButton from "../components/CopyButton";
import MarkdownContent from "../components/MarkdownContent";

const HISTORY_KEY = "ai-assist-code-history";
const MAX_HISTORY = 50;

export default function CodeAssistant() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
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

  const submit = async () => {
    if (!prompt.trim()) return;
    setError("");
    setLoading(true);

    const userMsg = { id: Date.now(), role: "user", content: prompt, language };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");

    try {
      const res = await API.post("/debug-code", { code: prompt, language });
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
    setLanguage(msg.language || "javascript");
    setEditingId(msg.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-messages">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            <div>
              <p style={{ marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
                Paste your code below and select the language.
              </p>
              <p>AI will debug, fix bugs, and suggest improvements.</p>
            </div>
          </div>
        )}

        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="chat-message user">
              <div className="msg-avatar">U</div>
              <div className="msg-body">
                <div className="code-block">
                  <div className="code-block-header">
                    <span>{msg.language || "code"}</span>
                    <CopyButton text={msg.content} label="Copy code" />
                  </div>
                  <pre>{msg.content}</pre>
                </div>
                <div className="msg-actions">
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
                Analyzing your code...
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
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ maxWidth: "160px" }}
            >
              <option value="javascript">JavaScript</option>
              <option value="php">PHP</option>
              <option value="python">Python</option>
            </select>
          </div>
          <textarea
            className="textarea"
            placeholder="Paste your code here... (Enter to send)"
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
              onClick={submit}
              className="btn btn-primary"
              disabled={loading || !prompt.trim()}
            >
              {loading ? "Analyzing..." : "Debug Code"}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
