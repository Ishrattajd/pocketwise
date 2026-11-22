/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF7F2',
        card: '#FFFFFF',
        teal: {
          DEFAULT: '#0F766E',
          dark: '#115E59',
          light: '#F0FDFA',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        coral: {
          DEFAULT: '#F87171',
          light: '#FEF2F2',
        },
        slate: {
          primary: '#1E293B',
          secondary: '#64748B',
          border: '#E5E0D8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
