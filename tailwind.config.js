/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        mono: [
          'JetBrains Mono',
          'Cascadia Code',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Consolas',
          'monospace',
        ],
      },
      colors: {
        terminal: {
          bg: '#09090b',
          surface: '#111114',
          elevated: '#18181c',
          border: '#27272d',
          'border-strong': '#3a3a44',
          muted: '#71717a',
          subtle: '#a1a1aa',
          text: '#f4f4f5',
          accent: '#38bdf8',
          amber: '#f59e0b',
          emerald: '#34d399',
          violet: '#a78bfa',
          rose: '#fb7185',
        },
      },
      boxShadow: {
        'node-idle': '0 4px 20px -4px rgba(0, 0, 0, 0.7)',
        'node-active': '0 0 0 1px rgba(56, 189, 248, 0.6), 0 8px 30px -6px rgba(56, 189, 248, 0.22)',
        dock: '0 12px 40px -8px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
};
