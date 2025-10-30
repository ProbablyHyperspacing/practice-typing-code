import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode colors (MonkeyType inspired with seafoam green)
        'bg-primary': '#1e1e1e',
        'bg-secondary': '#2c2c2c',
        'text-primary': '#e4e4e4',
        'text-secondary': '#646464',
        'accent-primary': '#5ED4B8', // Bright seafoam green
        'accent-secondary': '#3A8B7A', // Darker seafoam

        // Light mode colors (NuPhy inspired with seafoam accents)
        'bg-light-primary': '#f5f7f6',  // Soft off-white with green tint
        'bg-light-secondary': '#fdfffe', // Very soft white, not pure white
        'text-light-primary': '#3a4442',  // Soft dark green-gray
        'text-light-secondary': '#7a8a88', // Muted gray-green
        'accent-light-primary': '#4FC3A8', // Soft seafoam green
        'accent-light-secondary': '#B8E6DA', // Very light seafoam

        // Shared colors - softer versions for light mode
        'correct': '#4cd137',
        'correct-light': '#6fb58e', // Softer green for light mode
        'incorrect': '#ff4757',
        'incorrect-light': '#d98f93', // Softer red for light mode
        'text-error': '#ff4757',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        'sans': ['var(--font-sans)', 'system-ui', 'sans-serif'],
        'display': ['var(--font-display)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-sans)', 'system-ui', 'sans-serif'],
        'handwriting': ['var(--font-handwriting)', 'Comic Sans MS', 'cursive'],
      },
      fontWeight: {
        'thin': '100',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
        'super': '950',
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config