// src/components/signup/StepperLayout.tsx
// Vertical step-indicator + action footer shell for multi-step forms.
// Wraps each step's content and provides consistent navigation controls.

import React from 'react';
import { SIGNUP_STEPS, type SignupStep } from '../../hooks/useSignupForm';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface StepperLayoutProps {
    readonly currentStep: SignupStep;
    readonly allStepErrors: Readonly<Partial<Record<string, string>>[]>;
    readonly isSubmitting?: boolean;
    readonly onBack?: () => void;
    readonly onNext: () => void;
    readonly onStepClick?: (step: SignupStep) => void;
    readonly children: React.ReactNode;
    readonly className?: string;
}

// ─── StepDot ───────────────────────────────────────────────────────────────────

interface StepDotProps {
    readonly index: number;
    readonly current: SignupStep;
    readonly hasErrors: boolean;
    readonly isLast: boolean;
    readonly onClick?: () => void;
}

const StepDot: React.FC<StepDotProps> = ({ index, current, hasErrors, isLast, onClick }) => {
    const step = index as SignupStep;
    const isActive = step === current;
    const isDone = step < current;
    const isPast = step <= current;

    return (
        <li className="flex items-center flex-1 last:flex-none">
            {/* Circle — no label, just the dot */}
            <button
                type="button"
                onClick={isPast && onClick ? onClick : undefined}
                disabled={!isPast || isActive}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${index + 1}: ${SIGNUP_STEPS[index]}`}
                className={[
                    'relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                    'text-sm font-bold font-manrope transition-all duration-200',
                    isActive
                        ? 'bg-atlas-blue text-white shadow-glow-blue-sm'
                        : isDone
                            ? hasErrors
                                ? 'bg-status-error/15 border border-status-error/40 text-status-error cursor-pointer hover:bg-status-error/25'
                                : 'bg-status-success/15 border border-status-success/40 text-status-success cursor-pointer hover:bg-status-success/25'
                            : 'bg-white/[0.06] border border-white/[0.10] text-white/40 cursor-default',
                ].join(' ')}
            >
                {isDone ? (
                    hasErrors
                        ? <span className="material-symbols-outlined text-base">warning</span>
                        : <span className="material-symbols-outlined text-base">check</span>
                ) : (
                    index + 1
                )}
            </button>

            {/* Connector line — fills space between dots */}
            {!isLast && (
                <div className="flex-1 h-px mx-2" style={{
                    background: isDone
                        ? 'rgba(46,119,255,0.40)'
                        : 'rgba(255,255,255,0.08)',
                }} />
            )}
        </li>
    );
};

// ─── StepperLayout ─────────────────────────────────────────────────────────────

export const StepperLayout: React.FC<StepperLayoutProps> = ({
    currentStep, allStepErrors, isSubmitting = false,
    onBack, onNext, onStepClick, children, className = '',
}) => {
    const isLastStep = currentStep === SIGNUP_STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {/* ── Stepper indicator ─────────────────────────────────────────────── */}
            <nav aria-label="Sign-up progress">
                {/* Dots row — compact, labels removed */}
                <ol className="flex items-center w-full">
                    {SIGNUP_STEPS.map((_, i) => (
                        <StepDot
                            key={i}
                            index={i}
                            current={currentStep}
                            hasErrors={Object.keys(allStepErrors[i] ?? {}).length > 0}
                            isLast={i === SIGNUP_STEPS.length - 1}
                            onClick={onStepClick ? () => onStepClick(i as SignupStep) : undefined}
                        />
                    ))}
                </ol>

                {/* Current step name only — count is already shown in the card subtitle above */}
                <div className="mt-3">
                    <span className="text-label font-semibold text-white">
                        {SIGNUP_STEPS[currentStep]}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-0.5 w-full rounded-pill bg-white/[0.06] overflow-hidden">
                    <div
                        className="h-full rounded-pill bg-atlas-blue transition-all duration-500"
                        style={{ width: `${(currentStep / (SIGNUP_STEPS.length - 1)) * 100}%` }}
                        aria-hidden="true"
                    />
                </div>
            </nav>

            {/* ── Step content slot ───────────────────────────────────────────── */}
            <div className="flex-1 min-h-0">
                {children}
            </div>

            {/* ── Navigation footer ───────────────────────────────────────────── */}
            <footer className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                {/* Back */}
                {!isFirstStep && (
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="flex items-center gap-1.5 px-5 py-3 rounded-control
                       border border-white/[0.12] text-white/65 text-body-sm font-semibold
                       hover:text-white hover:border-white/25 hover:bg-white/[0.04]
                       transition-all duration-200 disabled:opacity-40"
                    >
                        <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span>
                        Back
                    </button>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Next / Submit */}
                <button
                    type="button"
                    onClick={onNext}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-7 py-3 rounded-control
                     bg-atlas-blue text-white font-semibold text-body-md
                     shadow-btn-primary
                     hover:bg-atlas-blue-dim hover:shadow-glow-blue-md
                     active:scale-[0.98]
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-200
                     focus-visible:outline-none focus-visible:shadow-glow-blue-sm"
                >
                    {isSubmitting ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                            Submitting…
                        </>
                    ) : isLastStep ? (
                        <>
                            <span className="material-symbols-outlined text-lg" aria-hidden="true">check_circle</span>
                            Create Account
                        </>
                    ) : (
                        <>
                            Continue
                            <span className="material-symbols-outlined text-lg" aria-hidden="true">arrow_forward</span>
                        </>
                    )}
                </button>
            </footer>
        </div>
    );
};

export default StepperLayout;
