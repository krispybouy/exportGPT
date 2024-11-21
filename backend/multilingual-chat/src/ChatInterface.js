import React, { useState } from "react";
import { Send, Loader2, Globe, MessageCircle } from "lucide-react";
import './chat.css';

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
        text: data.response || "No response available.", // Changed from data.finalResponse
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="w-full bg-white rounded-lg shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-semibold">Export Assistant</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(languages).map(([key, lang]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLanguage(key)}
                  className={`px-4 py-2 rounded-md min-w-24 ${
                    selectedLanguage === key
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-1">{lang.native}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-gray-50 rounded-lg p-4 h-96 mb-4 overflow-y-auto">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle className="w-12 h-12 mb-2" />
                <p>{placeholders[selectedLanguage]}</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : message.isError
                      ? "bg-red-100 text-red-700"
                      : "bg-white shadow-sm border"
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  {message.intent && (
                    <div className="text-xs mt-2 pt-2 border-t opacity-75">
                      Intent: {message.intent} ({Math.round(message.confidence * 100)}%)
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholders[selectedLanguage]}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
              rows="2"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`self-end p-3 rounded-lg ${
                loading
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultilingualExportChat;