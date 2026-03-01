// src/components/signup/ReviewStep.tsx
// Step 4 — read-only summary of all collected data before final submit.

import React from 'react';
import type { SignupFormData } from '../../hooks/useSignupForm';
import { SECURITY_QUESTIONS, COUNTRY_OPTIONS } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ReviewStepProps {
    readonly formData: SignupFormData;
    readonly className?: string;
}

// ─── ReviewRow ─────────────────────────────────────────────────────────────────

const ReviewRow: React.FC<{ label: string; value: string; className?: string }> = ({
    label, value, className = '',
}) => (
    <div className={`flex flex-col gap-0.5 ${className}`}>
        <span className="text-label font-semibold text-white/45 uppercase tracking-widest">{label}</span>
        <span className="text-body-sm text-white font-medium break-all">{value || '—'}</span>
    </div>
);

// ─── ReviewSection ─────────────────────────────────────────────────────────────

const ReviewSection: React.FC<{
    title: string; icon: string; children: React.ReactNode
}> = ({ title, icon, children }) => (
    <div className="rounded-card glass-1 overflow-hidden">
        <div
            className="flex items-center gap-3 px-5 py-3.5"
            style={{ background: 'rgba(46,119,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
            <span className="material-symbols-outlined text-atlas-blue text-xl" aria-hidden="true">{icon}</span>
            <h4 className="text-body-sm font-semibold text-white">{title}</h4>
        </div>
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {children}
        </div>
    </div>
);

// ─── ReviewStep ────────────────────────────────────────────────────────────────

export const ReviewStep: React.FC<ReviewStepProps> = ({ formData, className = '' }) => {
    const { personal, address, security } = formData;

    const countryLabel = COUNTRY_OPTIONS.find(c => c.value === address.country)?.label ?? address.country;
    const question1Label = SECURITY_QUESTIONS.find(q => q.value === security.question1)?.label ?? security.question1;
    const question2Label = SECURITY_QUESTIONS.find(q => q.value === security.question2)?.label ?? security.question2;

    return (
        <section className={`flex flex-col gap-5 ${className}`} aria-label="Review your information">
            <header className="flex flex-col gap-1">
                <h3 className="text-display-3 font-bold text-white">Review & Confirm</h3>
                <p className="text-body-sm text-white/55 leading-relaxed">
                    Please review your details before creating your {' '}
                    <span className="text-white font-medium">AtlasID</span>.
                    Click any step in the progress bar above to make changes.
                </p>
            </header>

            {/* ── Personal info ──────────────────────────────────────────────── */}
            <ReviewSection title="Personal Information" icon="person">
                <ReviewRow label="First name" value={personal.firstName} />
                <ReviewRow label="Last name" value={personal.lastName} />
                <ReviewRow label="Email" value={personal.email} />
                <ReviewRow label="Phone" value={personal.phone || 'Not provided'} />
                <ReviewRow label="Date of birth" value={personal.dateOfBirth} />
            </ReviewSection>

            {/* ── Address ───────────────────────────────────────────────────── */}
            <ReviewSection title="Address" icon="location_on">
                <ReviewRow label="Country" value={countryLabel} />
                <ReviewRow label="Street" value={[address.streetLine1, address.streetLine2].filter(Boolean).join(', ')} />
                <ReviewRow label="City" value={address.city} />
                <ReviewRow label="State" value={address.state || '—'} />
                <ReviewRow label="Postal code" value={address.postalCode} />
            </ReviewSection>

            {/* ── Security ──────────────────────────────────────────────────── */}
            <ReviewSection title="Security Questions" icon="lock">
                <div className="col-span-2 flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-label font-semibold text-white/45 uppercase tracking-widest">Password</span>
                        <span className="text-body-sm font-medium text-white">{security.password ? '••••••••' : '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-label font-semibold text-white/45 uppercase tracking-widest">Question 1</span>
                        <span className="text-body-sm text-white/80">{question1Label || '—'}</span>
                        <span className="text-body-sm font-medium text-white">{security.answer1 ? '••••••••' : '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-label font-semibold text-white/45 uppercase tracking-widest">Question 2</span>
                        <span className="text-body-sm text-white/80">{question2Label || '—'}</span>
                        <span className="text-body-sm font-medium text-white">{security.answer2 ? '••••••••' : '—'}</span>
                    </div>
                </div>
            </ReviewSection>

            {/* Legal notice */}
            <p className="flex items-start gap-2 text-label text-white/35 leading-relaxed">
                <span className="material-symbols-outlined text-sm mt-0.5 flex-shrink-0" aria-hidden="true">info</span>
                By creating your account you agree to our{' '}
                <a href="#terms" className="text-text-link hover:text-white underline transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#privacy" className="text-text-link hover:text-white underline transition-colors">Privacy Policy</a>.
            </p>
        </section>
    );
};

export default ReviewStep;
