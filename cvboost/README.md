# CVBoost

**We Don't Just Build Resumes — We Land You Jobs**

AI-powered CV optimization platform powered by äsk us! AG. Transform your career with Swiss-precision AI and real recruiter support.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e)

## ✨ Features

- **AI CV Optimization** - Tailors your resume to beat ATS systems with 94% success rate
- **AI Professional Headshots** - Transform any photo into a LinkedIn-ready headshot in seconds
- **Two Paths Approach** - Choose "Stand Out" (tools) or "Get a Job" (full recruiter support)
- **Real Recruiter Access** - Connect with Swiss recruiters from äsk us! AG
- **Multiple Templates** - Professional, Modern, Minimal, and Creative designs
- **ATS Score & Tips** - See your resume score and get actionable suggestions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for auth and database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/satyam-sharma-fr/cvboost.git
cd cvboost/cvboost
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Auth & Database**: Supabase
- **UI Components**: Radix UI / shadcn/ui
- **State Management**: Zustand

## 📁 Project Structure

```
cvboost/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Auth pages (login, signup)
│   │   ├── (dashboard)/     # Protected dashboard pages
│   │   ├── api/             # API routes
│   │   └── pricing/         # Pricing page
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utilities and configs
│   ├── store/               # Zustand stores
│   └── types/               # TypeScript types
├── public/                  # Static assets
└── package.json
```

## 🎨 Design System

The app uses äsk us! brand colors:
- Primary Green: `#009444`
- Bright Green: `#00A84D`
- Lime: `#A8C531`
- Neon: `#B5D334`
- Forest: `#0D3B22`

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `OPENAI_API_KEY` | OpenAI API key for CV generation |

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Set the **Root Directory** to `cvboost`
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/satyam-sharma-fr/cvboost)

## 📄 License

This project is proprietary software owned by äsk us! AG.

## 🤝 Support

- Website: [aesk.ch](https://aesk.ch)
- Email: contact@aesk.ch

---

Made with ❤️ in Switzerland 🇨🇭
