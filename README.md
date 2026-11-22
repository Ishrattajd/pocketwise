# PocketWise 🎓💰

**Smart, Mobile-First Financial Companion for College Students**

PocketWise is an INR-first, mobile-first Progressive Web App (PWA) designed to help students track micro-expenses (chai, canteen meals, photocopy, auto fares), manage monthly allowances, achieve milestone savings goals, and discover scholarships and campus work.

---

## 🌟 Live Demo

🔗 **Live Deployment:** [https://pocketwise-55a8f.web.app](https://pocketwise-55a8f.web.app) *(Placeholder)*

---

## 📌 The Problem

College students face unique financial hurdles:
- **Micro-spending leaks**: Daily ₹20–₹120 cafeteria, photocopy, and transit expenses add up unnoticed.
- **Budget anxiety**: Students rarely know how much they actually have left to spend per day before semester end.
- **Goal friction**: Saving for big purchases (e.g. ₹45,000 coding laptop, ₹6,000 exam fee) is overwhelming without incremental tracking.
- **Missed financial aid**: State and central scholarships (NSP, state merit) slip by due to untracked application deadlines.

PocketWise solves this by combining quick capture, real-time Firestore synchronization, and on-device/Gemini AI assistance with zero friction.

---

## ✨ Features

- **INR-First Multi-Currency Support**:
  - Native `en-IN` formatting (`₹60`, `₹8,000`, `₹1,00,000`) using `Intl.NumberFormat`.
  - Zero hardcoded currency symbols; instant switching between INR (`₹`), USD (`$`), EUR (`€`), and GBP (`£`).
- **Real-Time Firestore Synchronization**:
  - Live `onSnapshot` listeners on expenses, monthly budget, savings goals, custom scholarships, and bookmarked jobs under `users/{uid}/**`.
  - Proper unsubscription on unmount for leak-free performance.
- **Left to Spend This Month Hero Card**:
  - Real-time allowance tracking with visual meters.
  - Switches to coral (`#F87171`) warning mode upon overspending.
- **AI Quick Add with Gemini & Fallback**:
  - Quick parse natural text like `"120 chai and samosa"` into structured JSON `{ amount: 120, category: 'Food', note: 'Chai and samosa' }`.
  - Client-side confirmation dialog before saving.
  - Zero-dependency local regex parser fallback ensures the app works offline or without live credentials.
- **Gemini AI Financial Insights**:
  - Analyzes the last 30 days of spending to deliver 3 actionable student tips.
  - Debounced refresh button with `aria-live="polite"` feedback.
- **Savings Goals & Milestones**:
  - Add, track, deposit towards, and complete savings targets (e.g. laptop, semester fees).
- **Scholarships & Campus Jobs**:
  - Curated + custom student scholarships sorted by deadline with urgency badges (coral when under 7 days).
  - "Am I eligible?" AI eligibility advisor using Gemini.
  - Campus jobs board with bookmarked filtering saved in Firestore.
- **Isolated Demo Mode**:
  - Instant exploration with "Try Demo Account" without touching Firestore or requiring active Firebase keys.
- **Zero-Blank Starter State**:
  - Fresh sign-in users start with a clean zero state—no placeholder mock data mixed into real accounts.

---

## 🎨 Design System

PocketWise adheres to an intentional, high-contrast palette:
- **Background**: Warm off-white (`#FAF7F2`)
- **Card Surfaces**: Crisp white (`#FFFFFF`) with subtle borders (`#E5E0D8`)
- **Primary / Brand**: Deep teal (`#0F766E`)
- **Accent**: Warm amber (`#F59E0B`)
- **Alert / Overspending**: Coral (`#F87171` / `#DC2626`)
- **Text**: Dark slate (`#1E293B`) and muted slate (`#64748B`)
- **Typography**: Plus Jakarta Sans for headings, Inter for body copy
- **Iconography**: Lucide React icons (no emoji icons)
- **Touch Targets**: Minimum 44px × 44px across all buttons and inputs

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7
- **Styling**: Tailwind CSS
- **PWA**: `vite-plugin-pwa` with Workbox precaching and web manifest
- **Routing**: React Router v7 with lazy-loaded route splitting
- **Backend & Auth**: Firebase 12 (Google Sign-In, Cloud Firestore)
- **AI Integration**: Firebase AI Logic (`firebase/ai`, `getAI` with `GoogleAIBackend`, `gemini-2.5-flash`)
- **Validation**: Zod v4 schemas (`ExpenseSchema`, `SavingsGoalSchema`, `ScholarshipSchema`)
- **Testing**: Vitest, React Testing Library, jsdom
- **Code Quality**: ESLint, Prettier

---

## 🏗 Architecture

```
pocketwise/
├── public/                 # Static assets, web manifest icons
├── src/
│   ├── components/         # Reusable UI (AppLayout, BottomNav, ExpenseForm, Header, etc.)
│   ├── hooks/              # Custom hooks (useAuth, useExpenses, useCurrency)
│   ├── pages/              # Lazy-loaded views (Home, Expenses, Goals, Scholarships, Jobs, SignIn)
│   ├── services/           # Firebase init, Gemini AI logic, and shims
│   ├── types/              # TypeScript interfaces
│   └── utils/              # Currency formatting, date math, Zod schemas
├── firestore.rules         # Strict granular Cloud Firestore security rules
├── firebase.json           # Hosting rewrite, security headers, Firestore config
├── .firebaserc             # Firebase project configuration
└── vite.config.ts          # Vite build, PWA config, Vitest environment
```

---

## 🤖 How Gemini Is Used

PocketWise integrates Gemini 2.5 Flash via Firebase AI Logic (`getAI` with `GoogleAIBackend`):
1. **`parseExpense(text)`**: Translates informal student inputs (`"50 bus pass"`, `"450 xerox notes"`) into validated JSON with structured category and amount.
2. **`getInsights(expenses, budget)`**: Reviews recent spending distribution and monthly budget pacing to generate 3 contextual saving tips.
3. **`checkScholarshipEligibility(name, profile)`**: Compares a student's degree, year, and criteria against scholarship requirements.

> **Resilience Guarantee**: If Gemini fails or the user is in Demo Mode, PocketWise seamlessly falls back to local regex keyword heuristics and rule-based advice. The user experience is never blocked.

---

## 🔒 Security

- **Strict Firestore Rules (`firestore.rules`)**:
  - All read/write operations strictly restricted to `users/{uid}/**` where `request.auth.uid == uid`.
  - Explicit payload validation:
    - Expense `amount` must be a number `> 0` and `< 10,000,000`.
    - `note` must be a string up to 200 characters.
    - `category` must match `['Food', 'Transport', 'Books', 'Rent', 'Fun', 'Other']`.
  - All other root and document paths are denied by default (`allow read, write: if false;`).
- **Security Headers (`firebase.json`)**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Zero Secrets Logged**: `.env` and local credential files are git-ignored; runtime configuration logs only check variable names, never values.
- **XSS Prevention**: Zero usage of `dangerouslySetInnerHTML` across the entire codebase.

---

## ♿ Accessibility (WCAG 2.1 AA)

- **Visible Labels**: Every form input (`Amount`, `Category`, `Note`, `Date`, `Target`) has an explicitly associated `<label htmlFor="...">` matching `id="..."`.
- **Keyboard Navigation & Skip Link**: Dedicated "Skip to content" link at the top of every page.
- **Visible Focus Rings**: Prominent `focus:ring-2 focus:ring-[#0F766E]` focus rings on all interactive elements.
- **Color Contrast**: All text pairings maintain $\ge 4.5:1$ contrast against their respective backgrounds.
- **Semantic ARIA**:
  - `aria-current="page"` on the active bottom navigation tab.
  - `aria-live="polite"` on AI generation states and dynamic error banners.
  - Descriptive `aria-label`s on icon-only action buttons.
  - `<html lang="en">` with mobile viewport configuration.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone & Install
```bash
git clone <repo-url>
cd pocketwise
npm install
```

### 2. Configure Environment
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Fill in your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development Server
```bash
npm run dev
```

---

## 🧪 Testing

PocketWise includes a comprehensive test suite covering Zod validation schemas, formatters, remaining budget math, deadline countdowns, regex parsing fallbacks, Firebase auth logic, and component accessibility.

Run the test suite:
```bash
npm test
```

### Test Count
**50 passing tests across 9 test suites:**
- `src/utils/__tests__/currency.test.ts` (3 tests)
- `src/utils/__tests__/formatters.test.ts` (8 tests)
- `src/utils/__tests__/schemas.test.ts` (9 tests)
- `src/services/__tests__/firebase.test.ts` (3 tests)
- `src/services/__tests__/gemini.test.ts` (14 tests)
- `src/components/__tests__/BottomNav.test.tsx` (3 tests)
- `src/components/__tests__/ExpenseForm.test.tsx` (5 tests)
- `src/components/__tests__/ProtectedRoute.test.tsx` (3 tests)
- `src/pages/__tests__/SignIn.test.tsx` (2 tests)

Run linting and production build verification:
```bash
npm run lint
npm run build
```

---

## 📄 License
MIT License. Built for students everywhere.
