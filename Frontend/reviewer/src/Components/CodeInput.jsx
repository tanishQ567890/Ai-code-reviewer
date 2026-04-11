import React from "react";
import {useState} from 'react'
import './Codeinput.css';
const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "Plain Text"];
const CodeInput = ({ onReviewComplete, onSubmit }) => {

    const [code, setCode] = useState("");
    const [language,setLanguage] = useState("Python")
    const [activeTab, setActiveTab] = useState("paste");
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e) =>{
        const file = e.target.files[0];
        if(!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) =>{
            setCode(event.target.result);
        }
        reader.readAsText(file);
    };

    const handleSubmit = async () =>{
          if(!code.trim()){
            setError("Please enter some code to review");
            return;
          }
          setError("");
           setLoading(true);

          onSubmit(code, language, activeTab === "file" ? "file" : "paste", fileName || null);

        try{
            const response = await fetch("http://127.0.0.1:5000/api/review",{
                 method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          source: activeTab === "file" ? "file" : "paste",
          filename: fileName || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      onReviewComplete(data);
    } catch {
      setError("Could not connect to server. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="code-input-wrapper">
        <div className="tab-switcher">
            <button className={`tab-btn ${activeTab === "paste" ? "active" : ""}`} onClick={() => setActiveTab("paste")}>
                Code
            </button>

            <button className={`tab-btn ${activeTab === "file" ? "active" : ""}`}
          onClick={() => setActiveTab("file")}>
            UploadFile
          </button>
        </div>

        <div className="Language-selector">
            <label>Language:</label>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)}>
                {LANGUAGES.map((lang)=>(<option key={lang} value={lang}>{lang}</option>
            ))}
            </select>
        </div>

        {activeTab === "paste" && (
        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          rows={14}
        />
      )}

      {activeTab === "file" && (
        <div
          className="file-dropzone"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <input
            id="fileInput"
            type="file"
            accept=".py,.js,.ts,.java,.cpp,.go,.rs,.txt"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

           {fileName ? (
            <div>
              <p className="file-name">{fileName}</p>
              <p className="file-hint">Click to change file</p>
            </div>
          ) : (
            <div>
              <p className="upload-text">Click to upload a code file</p>
              <p className="file-hint">.py .js .ts .java .cpp .go .rs supported</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "file" && code && (
        <textarea
          className="code-preview"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
        />
      )}

      {error && <p className="error-message">{error}</p>}

       <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Reviewing..." : "Review Code"}
      </button>
    </div>
  )
}

export default CodeInput