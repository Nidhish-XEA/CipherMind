# 🧠 CipherMind — The AI Coding Mentor with Perfect Recall

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma 7](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-f55036?style=for-the-badge)](https://groq.com/)
[![Hindsight](https://img.shields.io/badge/Hindsight-Memory-00d4ff?style=for-the-badge)](https://vectorize.io/)

**CipherMind** is a premium, hackathon-ready AI coding mentor that doesn't just analyze your code—it *remembers* your growth. Built with a dark cyberpunk aesthetic, it uses **Hindsight by Vectorize** to build a persistent memory of your past mistakes, ensuring you never trip over the same bug twice.

---

## ✨ Core Features

- 🕵️ **Real-time Code Analysis**: Instant feedback on bugs, anti-patterns, and vulnerabilities using the ultra-fast Groq LPU (Qwen-2.5-Coder model).
- 🧠 **Persistent Memory (Hindsight)**: Uses vector database technology to recall your historical coding patterns. If you've made a similar mistake before, CipherMind will call it out.
- 🎨 **Premium Cyberpunk UI**: A state-of-the-art dark mode interface with matrix rain backgrounds, glowing neon accents, and glassmorphic components.
- 📊 **Progress Tracking**: Visual analytics and memory heatmaps (powered by Recharts) to see your improvement over time.
- 🔐 **Secure Identity**: Fully integrated authentication with NextAuth.js.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [Prisma 7](https://www.prisma.io/) with SQLite (local-first, fast)
- **AI Inference**: [Groq SDK](https://groq.com/) (Qwen-2.5-Coder-32b)
- **Memory Layer**: [Hindsight Client](https://vectorize.io/) (Positional API)
- **Styling**: Tailwind CSS + Framer Motion (Animations) + Lucide Icons
- **Auth**: NextAuth.js

---

## 🛠️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Nidhish-XEA/CipherMind.git
cd CipherMind
npm install --force
```

### 2. Configure Environment `.env`
Create a `.env` or `.env.local` file in the root:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"

GROQ_API_KEY="your_groq_key"
HINDSIGHT_API_KEY="your_hindsight_key"
HINDSIGHT_INSTANCE_URL="your_hindsight_url"
```

### 3. Sync Database
```bash
npx prisma db push
npx prisma generate
```

### 4. Launch the Mind
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to begin.

---

## 🏛️ Architecture: The Adaptive Loop

1. **Submit**: Code is sent to the `/api/analyze` endpoint.
2. **Recall**: The backend queries **Hindsight** for past user mistakes in that specific language.
3. **Inference**: **Groq** processes the code alongside the retrieved context (past mistakes) to generate specialized advice.
4. **Retain**: New architectural flaws or bugs found are stored back into Hindsight as new memories.

---

## 🎨 Visual Preview

> Every hover has a micro-interaction. Every mistake has a memory.

- **Landing**: Animated Matrix Rain + Typewriter effects.
- **Dashboard**: Integrated Monaco Editor with real-time AI results panel.
- **Memory**: Semantic search over your past coding errors.

---

Built with ⚡ by the **CipherMind Team** for Hackers everywhere.
