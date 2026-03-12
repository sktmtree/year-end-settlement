/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d5ddff',
          300: '#b8c6ff',
          400: '#8f9fff',
          500: '#6371ff',
          600: '#434bf5',
          700: '#3438df',
          800: '#2b2dc0',
          900: '#252998', // Deep blue from reference
        },
        accent: {
          50: '#f8f4ff',
          100: '#f0e6ff',
          500: '#a855f7', // Purple accent
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'float': '0 20px 40px -10px rgba(67, 75, 245, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
