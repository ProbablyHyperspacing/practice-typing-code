import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Inter, Outfit, Caveat } from 'next/font/google';
import './globals.css';

// Configure fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwriting',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Practice Typing Code',
  description: 'Improve your coding speed and accuracy with a minimalist typing practice app for developers',
  keywords: 'typing, practice, coding, programming, speed, accuracy, developer',
  authors: [{ name: 'Practice Typing Code' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Practice Typing Code',
    description: 'Improve your coding speed and accuracy',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${caveat.variable} bg-bg-light-primary dark:bg-bg-primary text-text-light-primary dark:text-text-primary min-h-screen`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}