export const colors = {
    // Primary
    primary: {
        50: '#e0e7ff',
        100: '#c7d2fe',
        200: '#a5b4fc',
        300: '#818cf8',
        400: '#6366f1',
        500: '#4f46e5',
        600: '#4338ca',
        700: '#3730a3',
        800: '#312e81',
        900: '#1e1b4b',
    },

    // Secondary (Emerald)
    secondary: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
    },

    // Accent (Amber)
    accent: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },

    // Danger (Red)
    danger: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },

    // Neutrals
    gray: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
    },

    // Semantic names
    white: '#ffffff',
    black: '#000000',
};

export const semanticColors = {
    text: {
        primary: colors.gray[900],
        secondary: colors.gray[600],
        inverted: colors.white,
    },
    background: {
        primary: colors.white,
        secondary: colors.gray[50],
        dark: colors.gray[800],
    },
    border: {
        light: colors.gray[200],
        dark: colors.gray[700],
    },
  };