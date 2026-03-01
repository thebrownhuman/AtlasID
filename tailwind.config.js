/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            '3xl': '1920px',   // 2K / large desktop
            '4xl': '2560px',   // True 4K
        },
        extend: {
            // ─── AtlasID Color Tokens ─────────────────────────────────────────────
            colors: {
                atlas: {
                    blue: '#2e77ff',
                    'blue-dim': '#1a5fe0',
                    'blue-deep': '#1451cc',
                    'blue-ghost': 'rgba(46,119,255,0.15)',
                },
                surface: {
                    void: '#060810',
                    navy: '#0d1117',
                    graphite: '#161b26',
                    slate: '#1e2535',
                    'glass': 'rgba(255,255,255,0.06)',
                    'glass-border': 'rgba(255,255,255,0.10)',
                },
                status: {
                    success: '#22c55e',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    'success-bg': 'rgba(34,197,94,0.15)',
                    'warning-bg': 'rgba(245,158,11,0.15)',
                    'error-bg': 'rgba(239,68,68,0.15)',
                },
                text: {
                    primary: '#ffffff',
                    secondary: 'rgba(255,255,255,0.75)',
                    muted: 'rgba(255,255,255,0.45)',
                    link: '#5b9aff',
                },
            },

            // ─── Typography ───────────────────────────────────────────────────────
            fontFamily: {
                manrope: ['Manrope', 'sans-serif'],
            },
            fontSize: {
                'display-1': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
                'display-2': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
                'display-3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
                'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '500' }],
                'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
                'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
                'label': ['0.75rem', { lineHeight: '1.0', letterSpacing: '0.08em', fontWeight: '600' }],
            },

            // ─── Border Radius ────────────────────────────────────────────────────
            borderRadius: {
                card: '16px',
                control: '8px',
                pill: '9999px',
            },

            // ─── Box Shadows ──────────────────────────────────────────────────────
            boxShadow: {
                'elevation-1': '0 2px 8px rgba(0,0,0,0.30)',
                'elevation-2': '0 8px 24px rgba(0,0,0,0.40)',
                'elevation-3': '0 24px 64px rgba(0,0,0,0.60)',
                'glow-blue-sm': '0 0 0 3px rgba(46,119,255,0.25)',
                'glow-blue-md': '0 4px 24px rgba(46,119,255,0.40)',
                'glow-blue-hero': '0 0 80px rgba(46,119,255,0.20)',
                'glow-success': '0 4px 16px rgba(34,197,94,0.30)',
                'glow-error': '0 4px 16px rgba(239,68,68,0.30)',
                'btn-primary': '0 4px 16px rgba(46,119,255,0.30)',
            },

            // ─── Backdrop Blur ────────────────────────────────────────────────────
            backdropBlur: {
                'glass-sm': '8px',
                'glass': '12px',
                'glass-lg': '20px',
            },

            // ─── Spacing (8pt grid) ───────────────────────────────────────────────
            spacing: {
                '4.5': '1.125rem',  // 18px
                '13': '3.25rem',   // 52px – OTP digit width
                '15': '3.75rem',   // 60px
                '18': '4.5rem',    // 72px
                '22': '5.5rem',    // 88px
                '30': '7.5rem',    // 120px
                '120': '30rem',     // 480px – auth card max-width
                '140': '35rem',     // 560px
            },

            // ─── Max Widths ───────────────────────────────────────────────────────
            maxWidth: {
                'auth-card': '30rem',     // 480px
                'content': '70rem',       // 1120px
            },

            // ─── Transitions ──────────────────────────────────────────────────────
            transitionDuration: {
                '150': '150ms',
                '200': '200ms',
            },
        },
    },
    plugins: [
        // @tailwindcss/forms not imported here because it may not be available
        // depending on version — we handle form resets manually in index.css
    ],
};
