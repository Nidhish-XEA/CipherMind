<div align="center">

# 🧠 CipherMind

**The AI Coding Mentor with Perfect Recall.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-f55036?style=flat-square)](https://groq.com/)
[![Hindsight](https://img.shields.io/badge/Hindsight-Memory-00d4ff?style=flat-square)](https://vectorize.io/)

CipherMind analyzes your code, **remembers your mistakes**, and builds a personalized picture of your weaknesses — so you never make the same mistake twice.

</div>

---

## Features

- **Real-time Code Analysis** — Instant feedback on bugs, anti-patterns, and security vulnerabilities via Groq LPU.
- **Persistent Memory** — Hindsight vector DB recalls your historical coding patterns across every session.
- **Personalized Feedback** — Advice strictly tailored to your past mistakes, not generic tips.
- **Progress Tracking** — Visual analytics to watch your mistake rate drop over time.
- **Secure Auth** — Full authentication with NextAuth.js (credentials + OAuth).
- **Premium UI** — Cyberpunk aesthetic with matrix rain, glassmorphism, and micro-animations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | Prisma ORM + SQLite |
| AI Inference | Groq SDK (Qwen-2.5-Coder-32b) |
| Memory | Hindsight Client by Vectorize |
| Styling | Tailwind CSS + Framer Motion |
| Auth | NextAuth.js |

---

## Getting Started

**1. Clone & Install**
```bash
git clone https://github.com/Nidhish-XEA/CipherMind.git
cd CipherMind
npm install --legacy-peer-deps
```

**2. Set Environment Variables**

Create a `.env` file in the root:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"

GROQ_API_KEY="your_groq_api_key"
HINDSIGHT_API_KEY="your_hindsight_api_key"
HINDSIGHT_INSTANCE_URL="your_hindsight_instance_url"
```

**3. Sync the Database**
```bash
npx prisma db push
npx prisma generate
```

**4. Run the Dev Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start.

---

## How It Works

```
Submit Code  →  Recall Memories  →  Groq Inference  →  Store New Mistakes
```

1. **Submit** — Code is sent to the `/api/analyze` endpoint.
2. **Recall** — Past user mistakes are fetched from Hindsight for context.
3. **Infer** — Groq generates feedback personalized to your history.
4. **Retain** — New bugs found are stored back into Hindsight as new memories.

---

<div align="center">

Built with ⚡ for **HackWithBengaluru 2.0**

</div>
