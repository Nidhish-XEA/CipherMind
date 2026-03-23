<div align="center">

# 🧠 CipherMind
### The AI Coding Mentor with Perfect Recall

*An AI-powered coding mentor that doesn't just analyze your code — it remembers your growth.*

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![Hindsight](https://img.shields.io/badge/Hindsight_by_Vectorize-00d4ff?style=for-the-badge)](https://hindsight.vectorize.io/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**[🚀 Live Demo](https://ciphermind.vercel.app)** • **[📹 Demo Video](#)** • **[📖 Article](#)**

Built for **HackWithBengaluru 2.0** · PS3: AI Coding Practice Mentor

</div>

---

## 🚨 The Problem

Every coding tool forgets you the moment you close the tab.

You make the same SQL injection mistake in January. Fix it. Move on. Then make it again in March — because nothing remembered it was *your* recurring blind spot.

Existing tools produce generic feedback. They don't know you made this exact mistake three times before. They don't adapt. They don't grow with you.

**There is no memory. No continuity. No real mentorship.**

---

## 💡 The Solution

**CipherMind** uses [Hindsight by Vectorize](https://hindsight.vectorize.io/) — a persistent vector memory system — to build a permanent profile of your coding weaknesses.

Every mistake you make is stored. Every session, the AI recalls your history and gives you feedback that is tailored *specifically to you*. The more you use it, the smarter it gets.

> *"It's not a code scanner. It's a mentor that remembers."*

---

## 🏛️ The Adaptive Loop

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   1. SUBMIT    →   You paste code or submit a repo      │
│                                                         │
│   2. RECALL    →   Hindsight fetches your past          │
│                    mistakes for this language           │
│                                                         │
│   3. INFER     →   Groq analyzes code + your history    │
│                    → personalized feedback              │
│                                                         │
│   4. RETAIN    →   New findings stored in Hindsight     │
│                    → memory grows stronger              │
│                                                         │
│   5. IMPROVE   →   Dashboard tracks your progress       │
│                    over time                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🕵️ **Real-time Code Analysis** | Instant feedback on bugs, anti-patterns, and vulnerabilities via Groq LPU |
| 🧠 **Persistent Memory** | Hindsight by Vectorize remembers ALL your past mistakes across sessions |
| 🔁 **Adaptive Learning** | AI recalls your history and improves suggestions every session |
| 🎯 **Personalized Feedback** | Advice tailored to YOUR specific coding patterns and weak areas |
| 📊 **Progress Dashboard** | Visual analytics and memory heatmaps to track improvement over time |
| 🎨 **Premium Cyberpunk UI** | Matrix rain, glassmorphism, neon glows, and micro-interactions everywhere |
| 🔐 **Secure Identity** | Full authentication with NextAuth.js — your memory is private |

---

## 🧠 How Hindsight Memory Works

This is the core of CipherMind. Not just analysis — **adaptive memory**.

```typescript
// lib/hindsight.ts

// After every analysis — store the mistake permanently
await client.retain(
  userId,
  `User made a ${severity} mistake in ${language}: ${issueType}.
   Code: ${codeSnippet}. Fix: ${suggestedFix}`
);

// Before every analysis — recall past mistakes
const memories = await client.recall(
  userId,
  `past mistakes in ${language}`
);

// Inject memory into Groq prompt → personalized feedback
const memoryContext = memories.results
  .map(m => m.content)
  .join('\n');
```

**What gets stored:**
- Every bug, anti-pattern, and vulnerability detected
- Programming language and severity
- The suggested fix that was provided
- Timestamp and session context

**What gets recalled:**
- Your full mistake history for the current language
- Recurring patterns across all sessions
- Context injected directly into the AI prompt

**The result:** A feedback loop where CipherMind continuously learns → gives better guidance → learns again.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **AI Inference** | Groq SDK — Qwen-2.5-Coder-32b |
| **Memory Layer** | [Hindsight by Vectorize](https://hindsight.vectorize.io/) |
| **Database** | Prisma 7 + SQLite |
| **Styling** | Tailwind CSS + Framer Motion |
| **Code Editor** | Monaco Editor (@monaco-editor/react) |
| **Charts** | Recharts |
| **Auth** | NextAuth.js |
| **Icons** | Lucide React |

---

## 🛠️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Nidhish-XEA/CipherMind.git
cd CipherMind
npm install --force
```

### 2. Configure Environment
Create a `.env.local` file in the root:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"

GROQ_API_KEY="your_groq_api_key"
HINDSIGHT_API_KEY="your_hindsight_api_key"
HINDSIGHT_INSTANCE_URL="https://api.hindsight.vectorize.io"
```

Get your keys:
- 🤖 Groq API Key → [groq.com](https://groq.com/) (free tier available)
- 🧠 Hindsight API Key → [ui.hindsight.vectorize.io](https://ui.hindsight.vectorize.io/) (use code `MEMHACK315` for $50 free credits)

### 3. Sync Database
```bash
npx prisma db push
npx prisma generate
```

### 4. Launch
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 📁 Project Structure

```
CipherMind/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── dashboard/            # Main IDE + analysis
│   │   ├── memory/               # Full memory history
│   │   ├── login/ & signup/      # Auth pages
│   │   └── api/
│   │       ├── analyze/          # Groq + Hindsight integration
│   │       ├── memory/           # Memory CRUD
│   │       └── auth/             # NextAuth
│   ├── components/               # Reusable UI components
│   └── lib/
│       ├── hindsight.ts          # Hindsight client
│       └── groq.ts               # Groq client
├── prisma/
│   └── schema.prisma             # DB schema
├── .env.local                    # Your API keys (never commit!)
└── package.json
```

---

## 🎨 UI Highlights

- **Landing Page** — Animated Matrix Rain + Typewriter hero text
- **Dashboard** — Monaco Editor + real-time AI results panel + memory sidebar
- **Memory Page** — Semantic search over your full coding history + heatmaps
- Every hover has a micro-interaction. Every mistake has a memory.

---

## 👥 Team

| Name | Role |
|---|---|
| Nidhish K | Full Stack + AI Integration |
| Abhijna S P | Frontend + UI |
| Vinay Kengal | Backend + DevOps |
| Tejas MN | AI + Memory Integration |

Built for **HackWithBengaluru 2.0**
Theme: *AI Agents That Learn Using Hindsight*

---

## 🔗 Resources

- [Hindsight GitHub](https://github.com/vectorize-io/hindsight)
- [Hindsight Documentation](https://hindsight.vectorize.io/)
- [Agent Memory — Vectorize](https://vectorize.io/features/agent-memory)
- [Groq API](https://groq.com/)

---

<div align="center">

Built with ⚡ by the CipherMind Team

*Every hover has a micro-interaction. Every mistake has a memory.*

</div>
