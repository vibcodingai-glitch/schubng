# ChainCred - Professional Verification Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?logo=supabase)](https://supabase.com/)

A professional verification platform for supply chain experts in Nigeria. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Core Features
- **Professional Registration & Profiles** - Supply chain professionals can create verified profiles
- **Certification Verification** - Upload and verify professional certifications
- **Trust Score System** - Build credibility with verified credentials (Experience, Education, Certifications)
- **Admin Dashboard** - Review and verify certifications
- **Social Networking** - Connect with other professionals, create posts, and engage

### Technical Features
- **Authentication** - Secure login/registration via Supabase Auth
- **File Upload** - Secure document upload via Supabase Storage
- **Real-time Updates** - Server components with proper caching
- **Mobile Responsive** - Fully responsive design

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | Shadcn/ui + Radix UI |
| **Forms** | React Hook Form + Zod |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 7 |
| **Authentication** | Supabase Auth + NextAuth |
| **File Storage** | Supabase Storage |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Animation** | Framer Motion |

## 📦 Project Structure

```
src/
├── app/
│   ├── (marketing)/        # Public pages (landing, about)
│   ├── (auth)/             # Authentication pages (login, register)
│   ├── (dashboard)/        # Protected professional dashboard
│   ├── (admin)/            # Admin verification dashboard
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── layout/             # Header, Footer, Sidebar
│   ├── network/            # Feed and network components
│   ├── profile/            # Profile components
│   └── shared/             # Shared/reusable components
├── lib/
│   ├── actions/            # Server actions
│   ├── supabase/           # Supabase client
│   ├── validations/        # Zod schemas
│   └── utils.ts            # Utility functions
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── generated/              # Prisma generated client
prisma/
├── schema.prisma           # Database schema
└── migrations/             # Database migrations
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- PostgreSQL database (Supabase recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/chaincred.git
   cd chaincred
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your actual values in `.env.local` (see [Environment Variables](#-environment-variables))

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database viewer |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema changes to database |

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (pooler) | ✅ |
| `DIRECT_URL` | Direct PostgreSQL connection (migrations) | ✅ |
| `AUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |

See `.env.example` for detailed instructions.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` file includes:
- Security headers (HSTS, X-Frame-Options, etc.)
- Static asset caching
- Proper build configuration

### Environment Variables in Vercel

Set these in your Vercel project settings → Environment Variables:
- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#0F172A` | Main dark color |
| Secondary | `#3B82F6` | Action/CTA color |
| Accent | `#10B981` | Success/Verified |
| Warning | `#F59E0B` | Pending states |
| Danger | `#EF4444` | Errors/Failed |
| Background | `#F8FAFC` | Light background |

### Badge Styles

- 🟢 **Verified:** `bg-emerald-100 text-emerald-700 border-emerald-300`
- 🟡 **Pending:** `bg-amber-100 text-amber-700 border-amber-300`
- 🔴 **Failed:** `bg-red-100 text-red-700 border-red-300`
- ⚪ **Unverified:** `bg-slate-100 text-slate-600 border-slate-300`

## 👥 User Types

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Professional** | Supply chain professionals | Create profile, upload certs, connect |
| **Admin** | Platform administrators | Verify certifications, manage users |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

All rights reserved © 2024 ChainCred

---

**Built with ❤️ for Nigerian Supply Chain Professionals**
