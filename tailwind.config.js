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
          bg: '#f6f8fa',
          card: '#ffffff',
          border: '#d0d7de',
          'border-muted': '#e6eaef',
          dark: '#1f2328',
          muted: '#656d76',
          subtle: '#8c959f',
          blue: '#0969da',
          'blue-hover': '#0860ca',
          'blue-subtle': '#ddf4ff',
          green: '#1a7f37',
          'green-subtle': '#dafbe1',
          purple: '#8250df',
          'purple-subtle': '#fbefff',
          orange: '#bc4c00',
          'orange-subtle': '#fff1e5',
          red: '#cf222e',
          'red-subtle': '#ffebe9',
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
