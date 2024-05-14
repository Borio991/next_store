import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ModalProvider from '@/providers/modal-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'German Store',
  description: 'Ecommerce for high quality German products',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>
          <ModalProvider />
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
