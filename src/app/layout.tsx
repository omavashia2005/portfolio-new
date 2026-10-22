import type { Metadata } from 'next';
import { Fragment_Mono, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import ThemeToggle from './ThemeToggle';

// Swansea by Roger White, free for personal use (see fonts/swansea/SWANSE__.TXT); served as the original TTF since the license forbids format conversion; only regular is used (the bold italic file also fails Chrome's font sanitizer)
const display = localFont({
  src: [
    { path: './fonts/swansea/SWANSE__.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-display-face',
  display: 'swap',
});

// secondary text
const body = Fragment_Mono({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-body-face',
  display: 'swap',
});

// code blocks
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono-face',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Om Avashia',
  description: 'CS @ ASU · Full Stack · Open Source',
  openGraph: {
    title: 'Om Avashia',
    description: 'CS @ ASU · Full Stack · Open Source',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} dark`} suppressHydrationWarning>
      <head>
        {/* apply saved theme before paint so there's no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body className="bg-(--c-bg) text-(--c-fg)">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
