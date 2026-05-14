import type React from 'react';
import type { Metadata } from 'next';
import { Poppins, Geist } from 'next/font/google';
// import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Providers from './providers';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Insidia | Unlock Your Insight, Ignite Your Idea',
  description: 'Insidia adalah platform edukasi digital yang menghadirkan pengalaman belajar personal, relevan, dan berwawasan global untuk mengubah wawasan menjadi karya inovatif.',
  generator: 'Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn('font-sans', geist.variable, poppins.variable)} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
