import type { Metadata } from 'next';
import { QueryProvider } from './query-provider';
import './globals.css';

export const MOCK_MODE = true

export const metadata: Metadata = {
  title: 'CoreInventory',
  description: 'Production-grade Inventory Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-stone-50 text-stone-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
