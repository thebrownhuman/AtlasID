// src/App.tsx
// Root composition — routes between Landing, Login, OTP, Success, Sign-up, and Dashboard.

import React, { useState } from 'react';
import { HeroLayout } from './components/HeroLayout';
import { AuthCard } from './components/AuthCard';
import { LoginForm } from './components/LoginForm';
import { VerificationForm } from './components/VerificationForm';
import { SignupPage } from './components/signup/SignupPage';
import { SuccessScreen } from './components/success/SuccessScreen';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { LandingPage } from './components/landing/LandingPage';
import {
  AUTH_CARD_TITLE,
  AUTH_CARD_SUBTITLE,
  BRAND_NAME,
} from './data/mockData';

// ─── Screen types ───────────────────────────────────────────────────────────────
type Screen = 'landing' | 'login' | 'otp' | 'success' | 'signup' | 'dashboard';

// ─── App ───────────────────────────────────────────────────────────────────────
export function App(): React.ReactElement {
  const [screen, setScreen] = useState<Screen>('landing');

  // Landing page — scrollable, full-width marketing page
  if (screen === 'landing') {
    return (
      <div style={{ background: '#060810' }}>
        {/* Mini nav for the landing page */}
        <nav
          className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 h-16"
          style={{ background: 'rgba(6,8,16,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          aria-label="Primary navigation"
        >
          <div className="flex items-center gap-2.5">
            <img src="/atlasid-logo.png" alt="AtlasID" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-manrope font-bold text-white text-lg">{BRAND_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setScreen('login')}
              className="px-4 py-2 rounded-control text-body-sm font-semibold
                         border border-atlas-blue/40 text-atlas-blue
                         hover:bg-atlas-blue/10 transition-all duration-200"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setScreen('signup')}
              className="px-4 py-2 rounded-control text-body-sm font-semibold text-white
                         bg-atlas-blue hover:bg-atlas-blue-dim transition-all duration-200"
            >
              Get Started Free
            </button>
          </div>
        </nav>
        {/* Push content below fixed nav */}
        <div className="pt-16">
          <LandingPage onGetStarted={() => setScreen('signup')} />
        </div>
      </div>
    );
  }

  // Dashboard — full-screen, no HeroLayout wrapper
  if (screen === 'dashboard') {
    return (
      <DashboardPage
        userName="Alex Chen"
        initials="AC"
        onSignOut={() => setScreen('login')}
      />
    );
  }

  // Success screen — full-screen with ID card reveal
  if (screen === 'success') {
    return (
      <SuccessScreen
        onRedirect={() => setScreen('dashboard')}
        headline="Your AtlasID is ready"
        subtext="Your global identity has been verified. You can now use AtlasID wherever it's accepted."
      />
    );
  }

  return (
    <HeroLayout
      onSignup={() => setScreen('signup')}
      isSignupScreen={screen === 'signup'}
      onSignin={() => setScreen('login')}
    >
      {/* ── Login screen ─────────────────────────────────────────────────── */}
      {screen === 'login' && (
        <AuthCard
          title={AUTH_CARD_TITLE}
          subtitle={AUTH_CARD_SUBTITLE}
          footer={
            <p className="text-body-sm text-white/50">
              Don't have an ID yet?{' '}
              <button
                onClick={() => setScreen('signup')}
                className="text-text-link hover:text-white font-medium transition-colors duration-150"
              >
                Create your {BRAND_NAME}
              </button>
            </p>
          }
        >
          <LoginForm onSuccess={() => setScreen('otp')} />
        </AuthCard>
      )}

      {/* ── OTP verification ──────────────────────────────────────────────── */}
      {screen === 'otp' && (
        <AuthCard title="Check your email">
          <VerificationForm
            onSuccess={() => setScreen('dashboard')}
            onBack={() => setScreen('login')}
          />
        </AuthCard>
      )}

      {/* ── Sign-up flow ─────────────────────────────────────────────────── */}
      {screen === 'signup' && (
        <SignupPage
          onSuccess={() => setScreen('success')}
          onBack={() => setScreen('login')}
        />
      )}
    </HeroLayout>
  );
}

export default App;
