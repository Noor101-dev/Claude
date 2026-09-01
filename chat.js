// api/chat.js
// Vercel serverless function version of the coding assistant backend.
// Talks to a Claude model through the NaraRouter (bynara) gateway.
// The API key stays server-side (read from a Vercel environment variable).

const BYNARA_BASE_URL = "https://router.bynara.id/v1";
const MODEL = "claude-sonnet-4.5"; // swap for claude-haiku-4.5 if you want

const SYSTEM_PROMPT = `You are a coding assistant. When the user asks for code:
- Give a short explanation (1-3 sentences) before or after the code.
- Always put code in fenced code blocks with the correct language tag.
- Prefer complete, runnable snippets over fragments when reasonable.
- If the request is ambiguous, make a sensible assumption and state it briefly rather than asking many questions.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BYNARA_API_KEY = process.env.BYNARA_API_KEY;
  if (!BYNARA_API_KEY) {
    return res.status(500).json({ error: "BYNARA_API_KEY is not set on the server." });
  }

  const { messages } = req.body || {};
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
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong contacting the model." });
  }
}
