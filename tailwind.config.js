/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gh: {
          bg: '#ffffff',
          card: '#ffffff',
          border: '#e2e8f0',
          'border-muted': '#f1f5f9',
          dark: '#0f172a',
          muted: '#64748b',
          subtle: '#94a3b8',
          blue: '#ea580c',
          'blue-hover': '#c2410c',
          'blue-subtle': '#fff7ed',
          green: '#ea580c',
          'green-subtle': '#fff7ed',
          purple: '#ea580c',
          'purple-subtle': '#fff7ed',
          orange: '#ea580c',
          'orange-subtle': '#fff7ed',
          red: '#dc2626',
          'red-subtle': '#fef2f2',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Noto Sans"',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace'
        ]
      }
    },
  },
  plugins: [],
}
