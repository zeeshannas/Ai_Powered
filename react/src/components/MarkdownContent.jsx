import CopyButton from "./CopyButton";

/** Parse content into text and code blocks. Only code blocks get copy button (ChatGPT style). */
function parseContent(content) {
  if (!content) return [];
  const segments = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim();
      if (text) segments.push({ type: "text", content: text });
    }
    segments.push({
      type: "code",
      lang: match[1] || "text",
      content: match[2].trim(),
    });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim();
    if (text) segments.push({ type: "text", content: text });
  }
  if (segments.length === 0) {
    segments.push({ type: "text", content: content.trim() || content });
  }
  return segments;
}

export default function MarkdownContent({ content }) {
  const segments = parseContent(content);

  return (
    <div className="markdown-content">
      {segments.map((seg, i) =>
        seg.type === "text" ? (
          <div key={i} className="md-text" style={{ whiteSpace: "pre-wrap", marginBottom: seg.content ? "0.75rem" : 0 }}>
            {seg.content}
          </div>
        ) : (
          <div key={i} className="code-block code-block-inline">
            <div className="code-block-header">
              <span>{seg.lang || "code"}</span>
              <CopyButton text={seg.content} label="Copy code" />
            </div>
            <pre>{seg.content}</pre>
          </div>
        )
      )}
    </div>
  );
}
