// server.js
// Backend for a "Claude Code"-style chat app: a coding assistant that
// answers with explanations + code blocks. Talks to a Claude model
// through the NaraRouter (bynara) gateway. The API key stays server-side.

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Set this as an environment variable, never hardcode it.
// e.g. run: BYNARA_API_KEY=sk-nry-xxxx node server.js
const BYNARA_API_KEY = process.env.BYNARA_API_KEY;
const BYNARA_BASE_URL = "https://router.bynara.id/v1";
const MODEL = "claude-sonnet-4.5"; // good default for coding

if (!BYNARA_API_KEY) {
  console.warn("WARNING: BYNARA_API_KEY is not set. Requests will fail.");
}

const SYSTEM_PROMPT = `You are a coding assistant. When the user asks for code:
- Give a short explanation (1-3 sentences) before or after the code.
- Always put code in fenced code blocks with the correct language tag.
- Prefer complete, runnable snippets over fragments when reasonable.
- If the request is ambiguous, make a sensible assumption and state it briefly rather than asking many questions.`;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  try {
    const response = await fetch(`${BYNARA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BYNARA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("NaraRouter error:", response.status, errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "";
    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong contacting the model." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
