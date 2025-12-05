import React, { ReactNode } from 'react';
import { PublicDbProvider } from '../lib/firebase';
import './globals.css'; // <-- Imports the actual CSS file

export const metadata = {
  title: 'Dynamic Ledger (Public TS)',
  description: 'A dynamic expense tracking application using React and Firebase without authentication.',
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <PublicDbProvider>
          {children}
        </PublicDbProvider>
      </body>
    </html>
  );
}