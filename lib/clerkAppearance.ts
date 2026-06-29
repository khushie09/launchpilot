export const clerkAppearance = {
  variables: {
    colorBackground: '#0c0c10',
    colorInputBackground: '#111114',
    colorInputText: '#e4e4e7',
    colorText: '#e4e4e7',
    colorTextSecondary: '#52525b',
    colorPrimary: '#2563eb',
    colorDanger: '#ef4444',
    borderRadius: '8px',
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    fontSize: '14px',
  },
  elements: {
    card: {
      backgroundColor: '#0c0c10',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 0 60px rgba(10,8,20,0.8)',
      borderRadius: '12px',
    },
    headerTitle: {
      color: '#f1f5f9',
      fontSize: '18px',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    headerSubtitle: {
      color: '#52525b',
      fontSize: '13px',
    },
    socialButtonsBlockButton: {
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderColor: 'rgba(255,255,255,0.07)',
      color: '#a1a1aa',
    },
    socialButtonsBlockButtonText: {
      color: '#a1a1aa',
      fontWeight: '400',
    },
    dividerLine: {
      backgroundColor: 'rgba(255,255,255,0.06)',
    },
    dividerText: {
      color: '#3f3f46',
    },
    formFieldLabel: {
      color: '#71717a',
      fontSize: '12px',
      fontWeight: '500',
    },
    formFieldInput: {
      backgroundColor: '#111114',
      borderColor: 'rgba(255,255,255,0.08)',
      color: '#e4e4e7',
    },
    formButtonPrimary: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontWeight: '500',
    },
    footerActionLink: {
      color: '#818cf8',
    },
    footerActionText: {
      color: '#3f3f46',
    },
    identityPreviewText: {
      color: '#a1a1aa',
    },
    identityPreviewEditButtonIcon: {
      color: '#52525b',
    },
    otpCodeFieldInput: {
      backgroundColor: '#111114',
      borderColor: 'rgba(255,255,255,0.08)',
      color: '#e4e4e7',
    },
    alertText: {
      color: '#a1a1aa',
    },
  },
} as const
