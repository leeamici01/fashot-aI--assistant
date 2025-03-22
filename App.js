import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a product copywriting assistant for De Bijenkorf and Fashot.com.
              When a user enters a Product Title, SKU, or uploads an image, generate a detailed product description file with:

              - English and Dutch product descriptions
              - Search-friendly keywords
              - The Editors’ Note lifestyle scenarios
              - Accessorising suggestions
              - Fabric Composition
              - Care Label
              - Visual Concept with DALL·E prompts and breakdown

              Ask the user to paste a product title or SKU to begin.`
            },
            ...messages,
            newMessage
          ]
        })
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (err) {
      console.error("Client error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Try again later." }]);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <h1>De Bijenkorf x Fashot.com AI Assistant</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-bar">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Enter product name or SKU"
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
