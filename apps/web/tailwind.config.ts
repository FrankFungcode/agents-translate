import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102033',
        mist: '#f3f7fb',
        signal: '#ff7a59',
        sea: '#0f766e',
        sky: '#0f4c81',
      },
      boxShadow: {
        soft: '0 24px 80px rgba(16, 32, 51, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
