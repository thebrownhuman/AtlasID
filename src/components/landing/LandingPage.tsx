// src/components/landing/LandingPage.tsx
// Composes all landing page sections in sequence.

import React from 'react';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TrustSection } from './TrustSection';
import { FooterSection } from './FooterSection';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LandingPageProps {
    /** Called when the user clicks any "Get Started" / "Create AtlasID" CTA */
    readonly onGetStarted?: () => void;
    readonly className?: string;
}

// ─── LandingPage ───────────────────────────────────────────────────────────────

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, className = '' }) => (
    <main className={`w-full ${className}`} id="landing-main">
        <FeaturesSection />
        <HowItWorksSection onGetStarted={onGetStarted} />
        <TrustSection />
        <FooterSection />
    </main>
);

export default LandingPage;
