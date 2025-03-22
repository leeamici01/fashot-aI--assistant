import React, { useState } from "react";
import axios from "axios";
import { Send, Loader } from "lucide-react";

const LandingPage = () => {
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
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a luxury fashion assistant trained to write elegant, descriptive product copy for De Bijenkorf." },
          ...messages,
          newMessage
        ],
        temperature: 0.7
      }, {
        headers: {
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json"
        }
      });

      const aiReply = response.data.choices[0].message;
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error("Error contacting OpenAI API:", err);
      const fallbackReply = {
        role: "assistant",
        content: "Sorry, something went wrong while connecting to the assistant."
      };
      setMessages((prev) => [...prev, fallbackReply]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <img src="/fashot-logo.png" alt="Fashot Logo" className="h-16 mr-4" />
          <h1 className="text-4xl font-bold">De Bijenkorf x Fashot.com AI Assistant</h1>
        </div>
        <p className="text-lg mb-6">Generate fashion-forward product descriptions instantly. Just enter a product name or style below.</p>

        <div className="border p-4 rounded-lg bg-gray-50 mb-4 h-96 overflow-y-scroll">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <div className={`inline-block px-3 py-2 rounded-lg ${msg.role === "user" ? "bg-black text-white" : "bg-gray-200 text-black"}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Enter product name (e.g. Wool-blend coat)"
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-r-lg"
          >
            {loading ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
