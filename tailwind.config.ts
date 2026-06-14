// FILE: tailwind.config.ts
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8B4513',
          accent: '#D4A017',
          dark: '#2C1A0E',
          light: '#FBF6EF',
          surface: '#FFFFFF',
          muted: '#7A6652',
          border: '#E8DDD0',
          success: '#2D6A4F',
          danger: '#C0392B',
        },
        admin: {
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          sidebar: '#1E293B',
          accent: '#8B4513',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Kalam', 'cursive'],
      },
      boxShadow: {
        warm: '0 2px 12px rgba(139,69,19,0.08)',
        'warm-md': '0 4px 24px rgba(139,69,19,0.12)',
        'warm-lg': '0 8px 40px rgba(139,69,19,0.16)',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #8B4513 0%, #D4A017 100%)',
        'gradient-dark': 'linear-gradient(135deg, #2C1A0E 0%, #8B4513 100%)',
      },
    },
  },
  plugins: [forms],
};

export default config;
