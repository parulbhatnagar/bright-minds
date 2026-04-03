import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
