import { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./OptimizedCode.css";

export default function OptimizedCode({ optimizedCode, language }) {
  const [copied, setCopied] = useState(false);

  if (!optimizedCode) return null;

  // clean escaped characters from Gemini response
  const cleanCode = optimizedCode
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLanguage = language === "c++" ? "cpp" : language;

  return (
    <div className="optimized-code">
      <h2>Optimized Code</h2>

      <div className="code-wrapper">

        <div className="code-header">
          <div className="code-lang-badge">
            <span className="lang-dot" />
            <span className="code-lang">{language}</span>
          </div>
          <button
            className={`copy-btn ${copied ? "copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>

        <SyntaxHighlighter
          language={displayLanguage}
          style={atomOneDark}
          showLineNumbers={true}
          wrapLines={true}
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            borderRadius: "0 0 12px 12px",
            fontSize: "14px",
            lineHeight: "1.7",
            padding: "20px 16px",
            maxHeight: "520px",
            overflowY: "auto",
            overflowX: "auto",
            whiteSpace: "pre",
          }}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "#6b7280",
            userSelect: "none",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'Courier New', Courier, monospace",
              whiteSpace: "pre",
            },
          }}
        >
          {cleanCode}
        </SyntaxHighlighter>

      </div>
    </div>
  );
}