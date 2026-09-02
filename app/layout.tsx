import type { Metadata } from 'next';
import React from 'react';
import '../styles/globals.css';
import { SessionProvider } from '@/components/session-provider';

export const metadata: Metadata = {
  title: 'PULSE - Business Management Platform',
  description:
    'PULSE: Enterprise business management SaaS platform for inventory, orders, invoices, and analytics.',
  icons: {
    icon: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
