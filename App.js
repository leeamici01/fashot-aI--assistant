import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    setLoading(true);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_OPENAI_API_KEY"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{
          role: "user",
          content: `Generate structured content for: "${prompt}". Format in this order:
1. English product description
2. Dutch translation
3. Editor’s note
4. Lifestyle scenarios
5. Customer segment
6. Fabric composition
7. Care label
8. Suggested Product SEO phrases ranked in order.`
        }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No output.";
    setOutput(result);
    setLoading(false);
  };

  const copyContent = () => navigator.clipboard.writeText(output);
  const exportPDF = () => {
    const blob = new Blob([output], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated_content.pdf";
    link.click();
  };
  const downloadTrace = () => {
    const trace = `Prompt: ${prompt}\n\nModel: gpt-4\n\nOutput:\n${output}`;
    const blob = new Blob([trace], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "legal_trace_report.txt";
    link.click();
  };

  return (
    <div className="container">
      <h1>AMI – Fashot.com Content Director</h1>
      <textarea placeholder="Enter product name or SKU..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <div className="buttons">
        <button onClick={generateContent} disabled={loading}>{loading ? "Generating..." : "Generate"}</button>
        <button onClick={copyContent}>Copy</button>
        <button onClick={exportPDF}>Export PDF</button>
        <button onClick={downloadTrace}>Legal Trace Report</button>
      </div>
      <pre>{output || "Generated content will appear here..."}</pre>
    </div>
  );
}

export default App;
