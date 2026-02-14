import { heroui } from '@heroui/react';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',

        surface: 'var(--surface)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        border: 'var(--border)',

        brand: 'var(--brand)',
        'brand-contrast': 'var(--brand-contrast)',
        ring: 'var(--ring)',

        'quinisindic-grey': 'var(--grey-background)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: '#fbf6ff',
            foreground: '#14081f',
          },
        },
        dark: {
          colors: {
            background: '#08000f',
            foreground: '#f3ecff',
          },
        },
      },
    }),
  ],
} satisfies Config;
