require('dotenv').config();
const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Analyze endpoint ───────────────────────────────────────────────────────
app.post('/api/analyze', async (req, res) => {
  const { mode, text, sender, subject } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'No content provided.' });
  }

  const prompt = `You are a cybersecurity expert specializing in phishing detection. Analyze the following ${mode || 'email'} for phishing indicators.

${sender  ? `Sender: ${sender}`   : ''}
${subject ? `Subject: ${subject}` : ''}
Content:
${text}

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "verdict": "phishing" | "suspicious" | "legitimate",
  "confidence": <0-100 integer>,
  "summary": "<2 sentence summary of verdict>",
  "signals": [
    {
      "name": "<signal name>",
      "description": "<brief detail>",
      "severity": "high" | "medium" | "low" | "safe",
      "score": "<score like +85 or -20>"
    }
  ],
  "tokens": [
    {
      "word": "<keyword from text>",
      "classification": "phishing" | "suspicious" | "safe" | "neutral"
    }
  ],
  "iocs": {
    "sender_domain": "<extracted domain or N/A>",
    "urls_found": "<count or list>",
    "urgency_score": "<0-10>",
    "impersonation": "<brand being impersonated or None>"
  },
  "recommendation": "<specific actionable recommendation for the user>"
}

Include 4-6 signals covering: sender analysis, urgency tactics, URL/link analysis, sensitive data requests, linguistic patterns.
Include 10-15 tokens that are the most significant words from the content.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text;
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.json(result);
  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ error: err.message || 'Analysis failed.' });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🛡️  PhishDetect running at http://localhost:${PORT}\n`);
});
