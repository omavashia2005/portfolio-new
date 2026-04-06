import type { Metadata } from 'next';
import { Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
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
    <html lang="en" className={`${cormorant.variable} ${mono.variable}`}>
      <body className="bg-[#080808] text-[#f0efe9]">{children}</body>
    </html>
  );
}
