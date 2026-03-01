# AtlasID

> **One world. One identity.**

AtlasID is a premium global digital identity platform that lets users create, verify, and use a cryptographically-signed digital ID card across borders. Built as a full-featured, production-grade frontend SPA with a deep-space dark design system, glassmorphic UI components, and a multi-step KYC onboarding flow — all with zero external UI libraries.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [App Architecture](#app-architecture)
- [Screens & Pages](#screens--pages)
- [Component Reference](#component-reference)
- [Custom Hooks](#custom-hooks)
- [Design System](#design-system)
- [Notable Implementations](#notable-implementations)

---

## Overview

AtlasID eliminates the need for multiple identity documents across different platforms and countries. Users complete a KYC (Know Your Customer) onboarding flow once, receive a verified digital ID, and can then sign in to 200+ linked services — banks, government portals, and platforms — using their single AtlasID.

**Key value propositions:**
- Military-grade AES-256 encryption
- Zero-knowledge architecture (AtlasID never stores raw identity data)
- Bank-grade SOC 2 Type II compliance
- Accepted by 500+ institutions across 150+ countries
- One-tap authentication for linked services

---

## Features

### For End Users
- **Multi-step KYC Signup** — 5-step guided onboarding: personal info, address, security setup, 2FA, and review
- **Digital ID Card** — Animated holographic digital identity card with a verification score
- **Google Authenticator Integration** — Optional 2FA setup during registration (with QR code + manual key)
- **Dashboard** — Complete identity management hub with real-time activity feed, linked services, and security controls
- **Service Linking** — Connect to 200+ platforms and instantly verify your identity on them
- **Security Center** — Manage password, security questions, 2FA, and review login history
- **OTP Email Verification** — 6-digit code input with auto-advance, paste support, and resend cooldown
- **Auto-redirect Success Screen** — Animated ID card reveal with countdown before dashboard entry

### For Developers
- Fully custom component library — no Headless UI, Radix, or Chakra dependencies
- Tailwind CSS v4 with CSS-first design tokens
- TypeScript throughout, strict mode
- Custom hook-based form orchestration
- Portal-based floating UI (date picker calendar)
- Dark-theme autofill override (no white flash)

---

## Tech Stack

| Category | Tool | Version |
|---|---|---|
| Framework | React | ^19.2.0 |
| Language | TypeScript | ~5.9.3 |
| Build Tool | Vite | ^7.3.1 |
| Compiler | SWC (via @vitejs/plugin-react) | ^1.15.17 |
| Styling | Tailwind CSS | ^4.2.1 |
| CSS Processing | PostCSS + @tailwindcss/postcss | ^4.2.1 |
| Form Styling Plugin | @tailwindcss/forms | ^0.5.11 |
| Autoprefixer | autoprefixer | ^10.4.27 |
| Icons | Material Symbols (Google Fonts, CDN) | — |
| Fonts | Manrope (Google Fonts, CDN) | — |
| Linting | ESLint + typescript-eslint | ^9.39.1 |

> No external UI component libraries. Every component is handcrafted to match the AtlasID design system.

---

## Project Structure

```
AtlasID/
├── public/
│   └── atlasid-logo.png          # Brand logo
├── src/
│   ├── components/
│   │   ├── landing/              # Marketing homepage sections
│   │   │   ├── LandingPage.tsx   # Root orchestrator
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── TrustSection.tsx
│   │   │   └── FooterSection.tsx
│   │   ├── signup/               # 5-step KYC onboarding
│   │   │   ├── SignupPage.tsx     # Step router
│   │   │   ├── StepperLayout.tsx  # Progress dots + step name
│   │   │   ├── PersonalInfoStep.tsx
│   │   │   ├── AddressStep.tsx
│   │   │   ├── SecurityQuestionsStep.tsx
│   │   │   ├── GoogleAuthSetupStep.tsx
│   │   │   └── ReviewStep.tsx
│   │   ├── dashboard/            # Authenticated app shell
│   │   │   ├── DashboardPage.tsx  # Page router
│   │   │   ├── AppShell.tsx       # Sidebar + content layout
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopNavigation.tsx
│   │   │   ├── DigitalIdHeroCard.tsx
│   │   │   ├── InfoWidget.tsx
│   │   │   ├── ActivityList.tsx
│   │   │   ├── ChangePasswordModal.tsx
│   │   │   └── pages/
│   │   │       ├── MyIdentityPage.tsx
│   │   │       ├── ActivityPage.tsx
│   │   │       ├── LinkedServicesPage.tsx
│   │   │       ├── SecurityPage.tsx
│   │   │       ├── SettingsPage.tsx
│   │   │       └── DocumentsPage.tsx
│   │   ├── success/              # Post-signup reveal screen
│   │   │   ├── SuccessScreen.tsx
│   │   │   ├── DigitalIdCard.tsx
│   │   │   └── DigitalIdCardReveal.tsx
│   │   ├── AuthCard.tsx          # Glassmorphic form container
│   │   ├── HeroLayout.tsx        # Two-column auth shell
│   │   ├── LoginForm.tsx
│   │   ├── VerificationForm.tsx  # OTP verification screen
│   │   ├── OtpInput.tsx          # 6-digit digit grid
│   │   ├── DatePicker.tsx        # Custom 3-view calendar
│   │   ├── FormField.tsx         # Text input wrapper
│   │   └── SelectField.tsx       # Dropdown wrapper
│   ├── hooks/
│   │   ├── useSignupForm.ts      # 5-step state + per-step validation
│   │   ├── useLoginForm.ts       # Login state + validation
│   │   ├── useOtpInput.ts        # OTP array + keyboard behaviour
│   │   ├── useResendTimer.ts     # Cooldown countdown for OTP resend
│   │   └── useAutoRedirectCountdown.ts  # Success screen ring timer
│   ├── data/
│   │   └── mockData.ts           # Static content, countries list, questions
│   ├── App.tsx                   # Root screen router
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles + design tokens
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── eslint.config.js
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (v22 recommended)
- **npm** v9+

### Installation

```bash
# Clone the repository
git clone git@github.com:thebrownhuman/AtlasID.git
cd AtlasID

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173` with HMR enabled.

### Build

```bash
npm run build
```

Outputs to `dist/` — TypeScript compiled via `tsc -b` followed by Vite bundle.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## App Architecture

AtlasID uses **state-driven screen routing** inside `App.tsx` — no client-side router library. The current screen is a discriminated union:

```ts
type Screen = 'landing' | 'login' | 'otp' | 'success' | 'signup' | 'dashboard'
```

Each screen maps to a top-level component. Transitions happen through callback props (`onLogin`, `onSignup`, `onSuccess`, etc.) passed down the tree.

```
App
├── LandingPage          (screen = 'landing')
├── HeroLayout           (screen = 'login' | 'otp' | 'signup')
│   ├── LoginForm        (screen = 'login')
│   ├── VerificationForm (screen = 'otp')
│   └── SignupPage       (screen = 'signup')
│       └── StepperLayout
│           ├── PersonalInfoStep
│           ├── AddressStep
│           ├── SecurityQuestionsStep
│           ├── GoogleAuthSetupStep
│           └── ReviewStep
├── SuccessScreen        (screen = 'success')
└── DashboardPage        (screen = 'dashboard')
    └── AppShell
        ├── Sidebar
        ├── TopNavigation
        └── [active sub-page]
```

**State management:** All state is local `useState` within custom hooks — no Redux, Zustand, or Context API. Each domain area has its own hook (`useSignupForm`, `useLoginForm`, etc.) that encapsulates field state, validation logic, and navigation.

---

## Screens & Pages

### Landing Page
Full-width marketing homepage composed of:
- **Hero** — Headline, CTA buttons, hero card visual
- **Features** — 6-feature grid (encryption, global reach, instant verification, zero data sharing, multi-platform, 24/7 support)
- **How It Works** — Numbered 4-step flow
- **Trust** — Stats (10M+ users, 150 countries, 500+ institutions), partner logos, testimonials
- **Footer** — Multi-column links and legal

### Login Screen
Two-column split layout. Left: branded hero panel with feature callouts. Right: email + password form with show/hide password toggle, remember-me checkbox, and inline error states.

### OTP Verification
6-digit code input with:
- Auto-advance on digit entry
- Backspace deletes current digit and focuses previous cell
- Full paste support (distributes digits across cells)
- 30-second resend cooldown with 3-attempt limit

### Signup — 5-Step KYC Flow

| Step | Fields |
|---|---|
| 1. Personal Info | First name, last name, email, phone, date of birth |
| 2. Address | Country, street address, city, state/province, postal code |
| 3. Security | Password + confirm, 2x security question + answer pairs |
| 4. 2FA Setup | Google Authenticator QR code + manual key (skippable) |
| 5. Review | Read-only summary of all entered data before submission |

Progress is shown via a dot stepper at the top of the form — one dot per step, current step name displayed below the row.

### Success Screen
Full-screen animated reveal with:
- Staggered entrance (header → card → countdown)
- Animated holographic ID card with shimmer gradient sweep
- SVG countdown ring (8-second auto-redirect, cancellable)
- Orbiting sparkle dots around a verification shield icon

### Dashboard
Persistent sidebar navigation with 6 sub-pages:

| Page | Purpose |
|---|---|
| **Overview** | Hero ID card, stats widgets, recent activity feed, quick actions |
| **My Identity** | Full identity details, verification status, document links |
| **Activity** | Complete event log (sign-ins, verifications, service links) with filters |
| **Linked Services** | Connected platforms with status badges (active / pending / revoked) |
| **Security** | Password change modal, 2FA status, recovery questions, session management |
| **Settings** | Profile editing, notification preferences, privacy controls |

---

## Component Reference

### Layout Components

**`HeroLayout`**
Wraps all auth screens (login, OTP, signup). Two-column on desktop (`lg:`), stacked on mobile. Left panel is a fixed branded hero; right panel is a scrollable form area with a fixed-height spacer that prevents content sliding behind the navbar. Nav shows a "Sign In" CTA on signup screens and a "Create AtlasID" CTA on login screens.

**`AuthCard`**
Glassmorphic form container (Glass Level 2 surface). Renders title, subtitle, body slot, optional footer, and optional info slot. Consistent padding and border-radius across all auth screens.

**`AppShell`**
Dashboard wrapper. Fixed sidebar on the left, scrollable main content area on the right. `TopNavigation` is rendered at the top of the main content area.

### Form Components

**`FormField`**
Labeled text input with optional icon suffix slot, error state (red border + message below), and disabled state. Used across all forms.

**`SelectField`**
Styled `<select>` dropdown with dark theme. Accepts an options array of `{ value, label }` objects.

**`DatePicker`**
Fully custom calendar picker replacing `<input type="date">`. See [Notable Implementations](#notable-implementations).

**`OtpInput`**
Array of 6 single-character inputs behaving as one controlled field. See [Notable Implementations](#notable-implementations).

---

## Custom Hooks

### `useSignupForm`
Orchestrates the entire 5-step signup flow.
- Holds all field state across steps (personal info, address, security, 2FA)
- Per-step validators — only validates the current step when "Next" is clicked
- Clears individual field errors the moment the user starts editing
- Tracks completion state per step
- Exposes `goNext`, `goBack`, `goToStep`, and per-section `updateField` helpers
- Tracks Google Authenticator verification status

### `useLoginForm`
Manages login form state and validation.
- Email format validation on submit
- Password required check
- Simulates async auth with loading state
- Server-level error display
- Clears a field's error on any change to that field

### `useOtpInput`
Manages a 6-element digit array for OTP inputs.
- `onChange` auto-advances focus to the next cell
- `onKeyDown` handles Backspace (clear → move left) and arrow keys (move left/right)
- `onPaste` extracts digits from clipboard and fills cells in sequence
- Fires `onComplete` callback when all 6 digits are present
- Returns `digits`, `inputRefs`, and event handlers

### `useResendTimer`
Manages the OTP resend cooldown.
- 30-second countdown before resend is re-enabled
- Tracks attempt count (max 3 by default)
- Exposes `canResend`, `secondsLeft`, `attemptsLeft`, and `handleResend`
- Runs a 1-second interval internally

### `useAutoRedirectCountdown`
Powers the success screen countdown ring.
- Counts down from a configurable number of seconds (default 8)
- Exposes `secondsLeft` and `progress` (0–1 ratio) for SVG arc animation
- `cancel()` function stops the redirect
- Fires a callback on completion to trigger screen transition

---

## Design System

AtlasID uses a custom Tailwind CSS v4 design token system defined in `src/index.css` via `@theme`.

### Color Palette

| Role | Token | Hex |
|---|---|---|
| Canvas | `--color-void-black` | `#060810` |
| App Background | `--color-deep-navy` | `#0d1117` |
| Card Surface | `--color-graphite-navy` | `#161b26` |
| Modal Surface | `--color-slate-navy` | `#1e2535` |
| Brand Primary | `--color-atlas-blue` | `#2e77ff` |
| Brand Hover | `--color-atlas-blue-dim` | `#1a5fe0` |
| Success | `--color-status-success` | `#22c55e` |
| Warning | `--color-status-warning` | `#f59e0b` |
| Error | `--color-status-error` | `#ef4444` |

### Typography

Font: **Manrope** (geometric sans-serif, loaded via Google Fonts CDN)

| Token | Size | Weight | Use |
|---|---|---|---|
| `text-display-1` | 48px | 700 | Hero headlines |
| `text-display-2` | 36px | 700 | Section headings |
| `text-display-3` | 24px | 600 | Card titles |
| `text-body-lg` | 18px | 500 | Lead text |
| `text-body` | 16px | 400 | Body copy |
| `text-body-sm` | 14px | 400 | Secondary text |
| `text-label` | 12px | 600 | Labels, badges |
| `text-code` | 14px | 500 | Monospace / QR keys |

### Glassmorphism Surfaces

| Level | Background | Blur | Use |
|---|---|---|---|
| Glass 1 — Frosted | `rgba(255,255,255,0.06)` | 12px | Cards, nav items |
| Glass 2 — Deep Modal | `rgba(14,20,36,0.85)` | 20px | Auth forms, modals |
| Glass 3 — Sidebar | `rgba(6,8,16,0.90)` | 8px | Sidebar panel |

### Shadows

| Token | Value | Use |
|---|---|---|
| `shadow-elevation-1` | `0 2px 8px rgba(0,0,0,0.30)` | Subtle lift |
| `shadow-elevation-2` | `0 8px 24px rgba(0,0,0,0.40)` | Cards, dropdowns |
| `shadow-elevation-3` | `0 24px 64px rgba(0,0,0,0.60)` | Modals, popovers |

### Border Radius

| Token | Value | Use |
|---|---|---|
| `rounded-control` | 8px | Inputs, buttons |
| `rounded-card` | 16px | Cards, panels |
| `rounded-pill` | 9999px | Badges, chips |

### Spacing Grid

All spacing follows an **8px base grid** (4px micro-adjustments allowed). Column grids:
- Mobile (`< 768px`): 4-column, 16px gutters, 20px side margins
- Tablet (`768–1024px`): 8-column, 20px gutters, 40px side margins
- Desktop (`> 1024px`): 12-column, 24px gutters, 80px side margins

### Animations

| Name | Description |
|---|---|
| `animate-fade-slide-up` | Fades in + slides up 8px over 0.5s ease |
| `glow-pulse` | Opacity oscillation 2s infinite for ambient glow rings |
| `holographic-shine` | Gradient sweep across ID card surface |
| `stamp-in` | Scale + rotate entrance for ID card reveal (0.6s ease-out) |
| `particle-orbit` | Continuous 360° rotation for sparkle dots |

---

## Notable Implementations

### Custom Date Picker (`DatePicker.tsx`)

Replaces the browser-native `<input type="date">` with a fully dark-themed calendar widget:

- **3-view navigation:** Day grid → click header to open Year grid (4×4, 16 years per page) → click a year to open Month grid → click a month to return to Day grid. Makes jumping years fast.
- **Portal rendering:** Calendar DOM is appended to `document.body` via `createPortal`, escaping any parent `overflow: hidden` or `z-index` stacking context.
- **Smart flip:** Measures the trigger's `getBoundingClientRect()`. If there is insufficient space below, the calendar opens above the field.
- **Keyboard:** `Escape` closes the picker.
- **Utility buttons:** "Today" jumps to the current date. "Clear" resets to empty.
- **Format:** Stored as ISO `YYYY-MM-DD` internally, displayed as `DD-MM-YYYY` on the trigger.

### OTP Input Grid (`OtpInput.tsx` + `useOtpInput.ts`)

6 separate `<input>` elements that behave as a single controlled digit field:

- **Auto-advance:** Entering a digit moves focus to the next cell automatically.
- **Backspace logic:** If the current cell has a digit, clear it. If it is already empty, clear the previous cell and focus it.
- **Paste:** Extracts all digit characters from the clipboard string and distributes them across cells from the current position onward.
- **Mobile / IME:** `inputMode="numeric"` for numeric soft keyboard. Handles IME composition events correctly.
- **Autocomplete hint:** `autoComplete="one-time-code"` on the first cell so browsers offer the OTP from SMS or email.
- **Status-driven styling:** `idle | error | success` states change border colour, text colour, and focus glow.

### Autofill White Flash Fix (`index.css`)

Browsers override dark input backgrounds on autofill with a white or yellow tint. Fixed with two complementary techniques:

```css
html {
    color-scheme: dark; /* modern browsers */
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #161b26 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    caret-color: #ffffff;
    transition: background-color 9999999s ease-in-out 0s;
}
```

`color-scheme: dark` handles modern browsers. The inset `box-shadow` trick forces the fill colour for WebKit. The `9999999s` transition delay prevents the browser from ever animating the background colour back to white.

### Scrollbar Hidden but Functional

The auth right panel scrolls when the form is taller than the viewport, but the scrollbar is invisible:

```css
.scrollbar-hidden { scrollbar-width: none; -ms-overflow-style: none; }
.scrollbar-hidden::-webkit-scrollbar { display: none; }
```

### Vertical Centering Without Breaking Scroll

Short forms (login) need vertical centering. Tall forms (signup) need to scroll. Both work without layout shifts:

```tsx
<div className="flex-1 overflow-y-auto scrollbar-hidden px-6">
  <div className="min-h-full flex flex-col items-center justify-center py-3">
    <div className="w-full max-w-auth-card">{children}</div>
  </div>
</div>
```

`min-h-full` makes the inner div at least as tall as the scroll container, which enables `justify-center`. When content overflows, the inner div grows beyond `min-h-full` and scrolling kicks in naturally.

### Navbar Overlap Prevention

A fixed-height spacer div outside the scroll container prevents the form from sliding behind the fixed navbar:

```tsx
<div className="flex-shrink-0 h-24" aria-hidden="true" />  {/* navbar height guard */}
<div className="flex-1 overflow-y-auto scrollbar-hidden">
  {/* form content */}
</div>
```

Because the spacer sits outside the scrollable region, it is always visible and physically pushes all content below the navbar regardless of scroll position — unlike `padding-top` which scrolls away.

---

## Browser Support

Targets modern evergreen browsers:

| Browser | Minimum Version |
|---|---|
| Chrome | 110+ |
| Firefox | 110+ |
| Safari | 16+ |
| Edge | 110+ |
| iOS Safari | 16+ |
| Chrome for Android | 110+ |

---

## License

This project is private. All rights reserved.
