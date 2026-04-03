import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Study Aid',
  description: 'A friendly learning app for kids',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
