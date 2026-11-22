# PocketWise 🎓💰

**Smart, Mobile-First Financial Companion for College Students**

PocketWise is an INR-first, mobile-first Progressive Web App (PWA) designed to help students track micro-expenses (chai, canteen meals, photocopy, auto fares), manage monthly allowances, achieve milestone savings goals, and discover scholarships and campus work.

---

## 🌟 Live Demo

🔗 **Live Deployment:** [https://pocketwise-55a8f.web.app](https://pocketwise-55a8f.web.app) 

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
VITE_FIREBASE_API_KEY=AIzaSyAsDpIsS1O5vS_4IKBmYrURZy6f_Zl_kI8
VITE_FIREBASE_AUTH_DOMAIN=pocketwise-55a8f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pocketwise-55a8f
VITE_FIREBASE_STORAGE_BUCKET=pocketwise-55a8f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=119547390855
VITE_FIREBASE_APP_ID=1:119547390855:web:5dc7267d9efe6def73c122
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

## Screenshots
Login
<img width="456" height="639" alt="Screenshot 2026-11-22 140628" src="https://github.com/user-attachments/assets/e55e102b-4032-471c-b83a-9394f19b0a58" />

Home
<img width="445" height="637" alt="Screenshot 2026-11-22 140324" src="https://github.com/user-attachments/assets/64b93b72-8de4-4f52-a743-137d35f6091b" />

Insights
<img width="443" height="643" alt="Screenshot 2026-11-22 140347" src="https://github.com/user-attachments/assets/a5904649-a1a8-4f95-b14b-e5cb3ff35208" />

<img width="438" height="637" alt="Screenshot 2026-11-22 140401" src="https://github.com/user-attachments/assets/c20ea118-ae22-4f24-ac1c-40703811e592" />

<img width="440" height="639" alt="Screenshot 2026-11-22 140416" src="https://github.com/user-attachments/assets/d69872ba-3551-417d-9ca5-0f7358d2f817" />

Expenses
<img width="438" height="638" alt="Screenshot 2026-11-22 140430" src="https://github.com/user-attachments/assets/abd287e6-48a4-4a2d-b848-03184d524d34" />

<img width="446" height="635" alt="Screenshot 2026-11-22 140442" src="https://github.com/user-attachments/assets/dc9e9053-de78-4cd5-8d40-1e714630a5e3" />

Goals
<img width="446" height="641" alt="Screenshot 2026-11-22 140501" src="https://github.com/user-attachments/assets/7b299093-e480-4d31-a462-ff07fa2296b7" />

Scholerships
<img width="442" height="638" alt="Screenshot 2026-11-22 140521" src="https://github.com/user-attachments/assets/ce2bbca0-626d-4d84-bc20-0486b21cb6bc" />

<img width="443" height="619" alt="Screenshot 2026-11-22 140536" src="https://github.com/user-attachments/assets/c7593526-5fe1-4692-917e-544ae2622340" />

Jobs
<img width="434" height="636" alt="Screenshot 2026-11-22 140552" src="https://github.com/user-attachments/assets/679f8172-e912-4a20-a209-382e89cd3c1c" />

## 📄 License
MIT License. Built for students everywhere.
