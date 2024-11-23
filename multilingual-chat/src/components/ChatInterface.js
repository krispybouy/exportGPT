import React, { useState } from "react";
import { Send, Loader2, Globe, MessageCircle } from "lucide-react";

const MultilingualExportChat = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const languages = {
    english: { name: "English", code: "en", native: "English" },
    hindi: { name: "Hindi", code: "hi", native: "हिंदी" },
    kannada: { name: "Kannada", code: "kn", native: "ಕನ್ನಡ" },
    tamil: { name: "Tamil", code: "ta", native: "தமிழ்" },
  };

  const placeholders = {
    english: "Ask about export documentation, trade compliance...",
    hindi: "निर्यात दस्तावेज़, व्यापार अनुपालन के बारे में पूछें...",
    kannada: "ರಫ್ತು ದಾಖಲೆಗಳು, ವ್ಯಾಪಾರ ಅನುಪಾಲನೆಯ ಬಗ್ಗೆ ಕೇಳಿ...",
    tamil: "ஏற்றுமதி ஆவணங்கள், வர்த்தக இணக்கம் பற்றி கேளுங்கள்...",
  };

  const handleSend = async () => {
    if (!query.trim()) return;

    const newMessage = {
      text: query,
      type: "user",
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          language: languages[selectedLanguage].code,
        }),
      });

      const data = await response.json();

      const botMessage = {
        text: data.response || "No response available.",
        type: "bot",
        intent: data.intent || "Unknown",
        confidence: data.confidence || 0,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        text: "Sorry, there was an error processing your request.",
        type: "bot",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "16px" }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.05)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "24px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Globe style={{ width: "24px", height: "24px", color: "#3b82f6" }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Export Assistant</h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {Object.entries(languages).map(([key, lang]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLanguage(key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    minWidth: "6rem",
                    backgroundColor: selectedLanguage === key ? "#3b82f6" : "#f3f4f6",
                    color: selectedLanguage === key ? "#ffffff" : "#1f2937",
                    cursor: "pointer"
                  }}
                >
                  <span>{lang.native}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "16px",
            height: "24rem",
            marginBottom: "16px",
            overflowY: "auto"
          }}>
            {messages.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#6b7280" }}>
                <MessageCircle style={{ width: "48px", height: "48px", marginBottom: "8px" }} />
                <p>{placeholders[selectedLanguage]}</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} style={{ marginBottom: "16px", textAlign: message.type === "user" ? "right" : "left" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "12px",
                    borderRadius: "8px",
                    maxWidth: "80%",
                    backgroundColor: message.type === "user" ? "#3b82f6" : message.isError ? "#fef2f2" : "#ffffff",
                    color: message.type === "user" ? "#ffffff" : "#1f2937",
                    boxShadow: message.type === "bot" ? "0 2px 5px rgba(0, 0, 0, 0.05)" : "none"
                  }}
                >
                  <div style={{ fontSize: "0.875rem" }}>{message.text}</div>
                  {message.intent && (
                    <div style={{ fontSize: "0.75rem", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #e5e7eb", opacity: 0.75 }}>
                      Intent: {message.intent} ({Math.round(message.confidence * 100)}%)
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Loader2 style={{ width: "24px", height: "24px", animation: "spin 1s linear infinite", color: "#3b82f6" }} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ display: "flex", gap: "8px" }}>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholders[selectedLanguage]}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                outline: "none",
                transition: "border-color 0.3s ease",
                resize: "none",
                backgroundColor: "#ffffff"
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "12px",
                backgroundColor: "#3b82f6",
                borderRadius: "8px",
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Send />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultilingualExportChat;
