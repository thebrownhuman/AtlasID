// src/data/mockData.ts
// All static content and configuration values for the AtlasID application.

import type { ActivityItem } from '../components/dashboard/ActivityList';

// ─── Sidebar navigation ────────────────────────────────────────────────────────

interface SidebarNavItem {
    readonly id: string;
    readonly icon: string;
    readonly label: string;
    readonly badge?: number;
}

interface SidebarNavGroup {
    readonly group: string;
    readonly items: readonly SidebarNavItem[];
}

export const SIDEBAR_NAV_ITEMS: readonly SidebarNavGroup[] = [
    {
        group: 'Main',
        items: [
            { id: 'overview', icon: 'dashboard', label: 'Overview' },
            { id: 'identity', icon: 'badge', label: 'My Identity' },
            { id: 'activity', icon: 'history', label: 'Activity' },
        ],
    },
    {
        group: 'Services',
        items: [
            { id: 'linked', icon: 'link', label: 'Linked Services', badge: 4 },
            { id: 'verify', icon: 'verified_user', label: 'Verification' },
        ],
    },
    {
        group: 'Account',
        items: [
            { id: 'security', icon: 'security', label: 'Security' },
            { id: 'settings', icon: 'settings', label: 'Settings' },
        ],
    },
];

// ─── Dashboard stats ───────────────────────────────────────────────────────────

interface DashboardStat {
    readonly icon: string;
    readonly label: string;
    readonly value: string | number;
    readonly subtext?: string;
    readonly trend?: 'up' | 'down' | 'neutral';
    readonly trendText?: string;
    readonly variant: string;
}

export const DASHBOARD_STATS: readonly DashboardStat[] = [
    {
        icon: 'verified_user', label: 'ID Score', value: '94/100',
        subtext: 'Excellent standing', trend: 'up', trendText: '+2',
        variant: 'highlight',
    },
    {
        icon: 'link', label: 'Linked Services', value: 4,
        subtext: 'Active connections', trend: 'up', trendText: '+1',
        variant: 'default',
    },
    {
        icon: 'task_alt', label: 'Verifications', value: 12,
        subtext: 'Last 30 days', trend: 'neutral', trendText: '—',
        variant: 'success',
    },
    {
        icon: 'shield', label: 'Security', value: 'Strong',
        subtext: '2FA + passkey active', trend: 'up', trendText: '100%',
        variant: 'default',
    },
];

// ─── Activity feed ─────────────────────────────────────────────────────────────

export const ACTIVITY_ITEMS: readonly ActivityItem[] = [
    {
        id: 'a1', icon: 'verified_user', status: 'success',
        title: 'Identity Verified',
        detail: 'Your AtlasID was verified by GlobalPay.',
        timestamp: '2 hours ago',
    },
    {
        id: 'a2', icon: 'login', status: 'info',
        title: 'Sign-in via AtlasID',
        detail: 'You signed into DocuSpace using your AtlasID.',
        timestamp: '5 hours ago',
    },
    {
        id: 'a3', icon: 'link', status: 'info',
        title: 'Service Linked',
        detail: 'HealthConnect was linked to your identity.',
        timestamp: 'Yesterday',
    },
    {
        id: 'a4', icon: 'warning', status: 'warning',
        title: 'Unrecognised Login Attempt',
        detail: 'A login attempt from Berlin, DE was blocked.',
        timestamp: '2 days ago',
    },
    {
        id: 'a5', icon: 'password', status: 'success',
        title: 'Security Questions Updated',
        detail: 'Your recovery questions were successfully updated.',
        timestamp: '2 days ago',
    },
    {
        id: 'a6', icon: 'person_add', status: 'success',
        title: 'Account Created',
        detail: 'Your AtlasID account was successfully created.',
        timestamp: '3 days ago',
    },
];



export interface NavLink {
    readonly label: string;
    readonly href: string;
}

export interface HeroFeature {
    readonly icon: string;       // Material Symbol name
    readonly title: string;
    readonly description: string;
}

export interface LoginFormDefaults {
    readonly email: string;
    readonly password: string;
    readonly rememberMe: boolean;
}

// ─── Navigation ────────────────────────────────────────────────────────────────
export const NAV_LINKS: readonly NavLink[] = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Developers', href: '#developers' },
    { label: 'Enterprise', href: '#enterprise' },
];

// ─── Hero Feature Cards ─────────────────────────────────────────────────────────
export const HERO_FEATURES: readonly HeroFeature[] = [
    {
        icon: 'language',
        title: 'Universal Acceptance',
        description: 'Accepted by 500+ institutions across 190+ countries.',
    },
    {
        icon: 'security',
        title: 'Bank-Grade Security',
        description: 'AES-256 encryption with SOC2 Type II compliance built-in.',
    },
    {
        icon: 'bolt',
        title: 'Instant Verification',
        description: 'Onboard in seconds, not days. Real-time identity checks.',
    },
];

// ─── Form Defaults ──────────────────────────────────────────────────────────────
export const LOGIN_FORM_DEFAULTS: LoginFormDefaults = {
    email: '',
    password: '',
    rememberMe: false,
};

// ─── Branding & Copy ────────────────────────────────────────────────────────────
export const BRAND_NAME = 'AtlasID';
export const TAGLINE = 'One world. One identity.';
export const HERO_HEADLINE = 'One world. One identity.';
export const HERO_SUBTEXT =
    'The premium standard for global digital identity. Verify instantly across borders with high-trust fintech-grade security.';

export const AUTH_CARD_TITLE = 'Welcome back';
export const AUTH_CARD_SUBTITLE =
    'Enter your credentials to access your global ID.';

export const FOOTER_TEXT = '© 2024 AtlasID Inc. All rights reserved.';
export const FOOTER_LINKS: readonly NavLink[] = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Help', href: '#help' },
];

// ─── OTP Verification ────────────────────────────────────────────────────────
/** Number of digits in the OTP code */
export const OTP_DIGIT_COUNT = 6;
/** Cooldown in seconds before user can request another code */
export const OTP_RESEND_COOLDOWN = 30;
/** Maximum resend attempts allowed */
export const OTP_MAX_ATTEMPTS = 3;
/** How long the OTP code stays valid */
export const OTP_VALIDITY_MINUTES = 10;
/** Masked destination shown on verification screen */
export const OTP_MASKED_EMAIL = 'j***@atlasid.com';

// ─── Sign-up: Country options ─────────────────────────────────────────────────
import type { SelectOption } from '../components/SelectField';

export const COUNTRY_OPTIONS: readonly SelectOption[] = [
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'IN', label: 'India' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'SG', label: 'Singapore' },
    { value: 'AE', label: 'United Arab Emirates' },
    { value: 'JP', label: 'Japan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'MX', label: 'Mexico' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'OTHER', label: 'Other' },
];

// ─── Sign-up: Security questions ──────────────────────────────────────────────
export const SECURITY_QUESTIONS: readonly SelectOption[] = [
    { value: 'q1', label: 'What was the name of your first pet?' },
    { value: 'q2', label: 'What city were you born in?' },
    { value: 'q3', label: 'What is your mother\'s maiden name?' },
    { value: 'q4', label: 'What was the make and model of your first car?' },
    { value: 'q5', label: 'What was the name of your primary school?' },
    { value: 'q6', label: 'What is the name of the street you grew up on?' },
    { value: 'q7', label: 'What was your childhood nickname?' },
    { value: 'q8', label: 'What is your oldest sibling\'s middle name?' },
    { value: 'q9', label: 'In what city did your parents meet?' },
    { value: 'q10', label: 'What was the name of your favourite childhood friend?' },
];

// ─── Features section ──────────────────────────────────────────────────────────

export const FEATURES = [
    { icon: 'shield_locked', title: 'Military-Grade Encryption', body: 'Every identity credential is encrypted with AES-256 and stored in a zero-knowledge architecture.' },
    { icon: 'public', title: 'Globally Recognized', body: 'Accepted by 200+ platforms, banks, and government agencies across 150 countries.' },
    { icon: 'speed', title: 'Instant Verification', body: 'Real-time biometric and document checks complete in under 3 seconds — no waiting, no friction.' },
    { icon: 'privacy_tip', title: 'Zero Data Sharing', body: 'You own your identity. AtlasID never sells or transfers your personal data to third parties.' },
    { icon: 'devices', title: 'Works Everywhere', body: 'Native mobile apps, browser extensions, and developer APIs for seamless multi-platform access.' },
    { icon: 'support_agent', title: '24/7 Expert Support', body: 'Dedicated identity specialists available around the clock via chat, email, and phone.' },
] as const;

// ─── How It Works section ──────────────────────────────────────────────────────

export const HOW_IT_WORKS_STEPS = [
    { number: '01', icon: 'person_add', title: 'Create Your Account', body: 'Sign up with your email in under 60 seconds. No credit card required.' },
    { number: '02', icon: 'verified_user', title: 'Verify Your Identity', body: 'We verify your account through a thorough background check — no uploads needed, fully automated and secure.' },
    { number: '03', icon: 'badge', title: 'Get Your AtlasID', body: 'Receive your holographic digital ID card, cryptographically signed and globally recognized.' },
    { number: '04', icon: 'public', title: 'Use It Everywhere', body: "Link your AtlasID to services, sign in with one tap, and share only what's needed." },
] as const;

// ─── Trust section ─────────────────────────────────────────────────────────────

export const TRUST_STATS = [
    { value: '50M+', label: 'Identity verifications' },
    { value: '200+', label: 'Integrated platforms' },
    { value: '150', label: 'Countries supported' },
    { value: '99.99%', label: 'Uptime SLA' },
] as const;

export const PARTNER_LOGOS = [
    { name: 'NovaPay Bank', icon: 'account_balance' },
    { name: 'TravelCore', icon: 'flight_takeoff' },
    { name: 'HealthConnect', icon: 'local_hospital' },
    { name: 'GovID Services', icon: 'gavel' },
    { name: 'SecureFi', icon: 'lock' },
    { name: 'GlobalEdge', icon: 'public' },
] as const;

export const TESTIMONIALS = [
    {
        quote: 'AtlasID reduced our onboarding friction by 80%. Our compliance team finally sleeps at night.',
        name: 'Sarah K.',
        role: 'CTO',
        company: 'NovaPay',
        badge: 'Fintech',
        initials: 'SK',
    },
    {
        quote: "The fastest KYC flow we've ever integrated. Went live in a single sprint.",
        name: 'James R.',
        role: 'Head of Product',
        company: 'TravelCore',
        badge: 'Travel',
        initials: 'JR',
    },
] as const;

// ─── Pricing section ───────────────────────────────────────────────────────────

export const PRICING_PLANS = [
    {
        tier: 'Free',
        badge: undefined as string | undefined,
        monthlyPrice: '$0',
        annualPrice: '$0',
        subtitle: 'Perfect for individuals',
        features: ['1 identity profile', '5 linked services', 'Standard verification', 'Email support', 'AtlasID card (digital)'],
        cta: 'Get Started',
        variant: 'default',
    },
    {
        tier: 'Pro',
        badge: 'MOST POPULAR' as string | undefined,
        monthlyPrice: '$12',
        annualPrice: '$9.60',
        subtitle: 'For power users & professionals',
        features: ['Everything in Free', '25 linked services', 'Priority verification (<1s)', 'Biometric auth', 'Physical ID card', 'API access (1000 calls/mo)'],
        cta: 'Start Free Trial',
        variant: 'featured',
    },
    {
        tier: 'Enterprise',
        badge: undefined as string | undefined,
        monthlyPrice: 'Custom',
        annualPrice: 'Custom',
        subtitle: 'For teams and organizations',
        features: ['Everything in Pro', 'Unlimited profiles', 'SSO & team management', 'Compliance reporting', 'SLA 99.99%', 'Dedicated account manager'],
        cta: 'Contact Sales',
        variant: 'enterprise',
    },
];

// ─── Footer columns ────────────────────────────────────────────────────────────

export const FOOTER_COLUMNS = [
    {
        heading: 'Product',
        links: ['Features', 'How it Works', 'Pricing', 'Security', 'Changelog', 'Status'],
    },
    {
        heading: 'Developers',
        links: ['API Docs', 'SDKs', 'Sandbox', 'Webhooks', 'OpenID Connect', 'GitHub'],
    },
    {
        heading: 'Company',
        links: ['About', 'Blog', 'Careers', 'Press', 'Partners', 'Contact'],
    },
];
