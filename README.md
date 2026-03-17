# 🛡️ PhishDetect — Multimodal Phishing Detection System

AI-powered phishing detection for emails, URLs, and SMS messages using Claude.

## Project Structure

```
phishdetect/
├── server.js          ← Express backend + Anthropic API calls
├── public/
│   └── index.html     ← Full frontend (HTML/CSS/JS)
├── package.json
├── .env               ← Your API key goes here (create from .env.example)
└── .env.example
```

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.example .env
```
Open `.env` and replace `your_api_key_here` with your key from https://console.anthropic.com

### 3. Run the server

**Development** (auto-restarts on file changes):
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### 4. Open in browser
Visit http://localhost:3000

## Features

- **3 analysis modes** — Email, URL, SMS
- **Verdict** — Phishing / Suspicious / Legitimate with confidence score
- **Detection signals** — 4–6 scored indicators per analysis
- **Token analysis** — Color-coded linguistic risk tokens
- **IOC extraction** — Sender domain, URL count, urgency score, impersonation brand
- **Actionable recommendations** — Specific guidance based on verdict
- **4 built-in samples** — Test immediately without real phishing emails

## Requirements

- Node.js 18+
- Anthropic API key
