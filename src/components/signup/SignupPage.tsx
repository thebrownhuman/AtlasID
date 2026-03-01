// src/components/signup/SignupPage.tsx
// Orchestrates the 5-step sign-up flow:
// 1=Personal, 2=Address, 3=Security, 4=Google Auth Setup, 5=Review & Create

import React from 'react';
import { AuthCard } from '../AuthCard';
import { StepperLayout } from './StepperLayout';
import { PersonalInfoStep } from './PersonalInfoStep';
import { AddressStep } from './AddressStep';
import { SecurityQuestionsStep } from './SecurityQuestionsStep';
import { GoogleAuthSetupStep } from './GoogleAuthSetupStep';
import { ReviewStep } from './ReviewStep';
import { useSignupForm } from '../../hooks/useSignupForm';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SignupPageProps {
    /** Called when account creation succeeds */
    readonly onSuccess?: () => void;
    /** Called when user clicks "back to login" */
    readonly onBack?: () => void;
}

// ─── Success overlay ───────────────────────────────────────────────────────────

const SignupSuccess: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
    <div className="flex flex-col items-center gap-5 py-6 text-center animate-fade-slide-up">
        <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.30)' }}
        >
            <span className="material-symbols-outlined text-4xl text-status-success" aria-hidden="true">
                verified_user
            </span>
        </div>
        <div>
            <h3 className="text-display-3 font-bold text-white">AtlasID created!</h3>
            <p className="text-body-sm text-white/60 mt-2 leading-relaxed">
                Your global identity has been registered and 2FA is active. You can now sign in.
            </p>
        </div>
        {onBack && (
            <button
                onClick={onBack}
                className="px-7 py-3 rounded-control bg-atlas-blue text-white font-semibold
                   text-body-md shadow-btn-primary hover:bg-atlas-blue-dim
                   transition-all duration-200"
            >
                Go to sign in
            </button>
        )}
    </div>
);

// ─── SignupPage ────────────────────────────────────────────────────────────────

export const SignupPage: React.FC<SignupPageProps> = ({ onSuccess, onBack }) => {
    const form = useSignupForm();

    // Fire onSuccess on state completion
    React.useEffect(() => {
        if (form.isComplete) onSuccess?.();
    }, [form.isComplete, onSuccess]);

    const stepTitles = [
        'Create your AtlasID',
        'Where are you based?',
        'Secure your account',
        'Enable 2-Factor Auth',
        'Almost done!',
    ];
    const stepSubtitles = [
        'Step 1 of 5 — Tell us about yourself.',
        'Step 2 of 5 — Add your address details.',
        'Step 3 of 5 — Set your password and recovery questions.',
        'Step 4 of 5 — Set up Google Authenticator for security.',
        'Step 5 of 5 — Review before creating your identity.',
    ];

    if (form.isComplete) {
        return (
            <AuthCard title="Welcome to AtlasID">
                <SignupSuccess onBack={onBack} />
            </AuthCard>
        );
    }

    // Google Auth step (step 3) renders without the stepper "Next" button — it advances via onVerified
    if (form.currentStep === 3) {
        return (
            <AuthCard
                title={stepTitles[form.currentStep]}
                subtitle={stepSubtitles[form.currentStep]}
                footer={
                    <p className="text-body-sm text-white/50">
                        Already have an ID?{' '}
                        <button
                            onClick={onBack}
                            className="text-text-link hover:text-white font-medium transition-colors duration-150"
                        >
                            Sign in
                        </button>
                    </p>
                }
            >
                <GoogleAuthSetupStep
                    onVerified={() => {
                        form.set2faVerified();
                        form.goNext();
                    }}
                    onSkip={form.goNext}
                    onBack={form.goBack}
                />
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title={stepTitles[form.currentStep]}
            subtitle={stepSubtitles[form.currentStep]}
            footer={
                <p className="text-body-sm text-white/50">
                    Already have an ID?{' '}
                    <button
                        onClick={onBack}
                        className="text-text-link hover:text-white font-medium transition-colors duration-150"
                    >
                        Sign in
                    </button>
                </p>
            }
        >
            <StepperLayout
                currentStep={form.currentStep}
                allStepErrors={form.allStepErrors}
                isSubmitting={form.isSubmitting}
                onBack={form.goBack}
                onNext={form.currentStep === 4 ? form.handleSubmit : form.goNext}
                onStepClick={form.goToStep}
            >
                {form.currentStep === 0 && (
                    <PersonalInfoStep
                        data={form.formData.personal}
                        errors={form.errors}
                        onChange={form.updatePersonal}
                    />
                )}
                {form.currentStep === 1 && (
                    <AddressStep
                        data={form.formData.address}
                        errors={form.errors}
                        onChange={form.updateAddress}
                    />
                )}
                {form.currentStep === 2 && (
                    <SecurityQuestionsStep
                        data={form.formData.security}
                        errors={form.errors}
                        onChange={form.updateSecurity}
                    />
                )}
                {form.currentStep === 4 && (
                    <ReviewStep formData={form.formData} />
                )}
            </StepperLayout>
        </AuthCard>
    );
};

export default SignupPage;
