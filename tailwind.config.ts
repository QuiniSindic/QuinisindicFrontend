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
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        focus: 'var(--focus)',
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
            primary: '#fff',
            secondary: '#5502a6',
            focus: '#00bcd4',
          },
        },
        dark: {
          colors: {
            primary: '#121212',
            secondary: '#bb86fc',
            focus: '#03dac5',
          },
        },
      },
    }),
  ],
} satisfies Config;
