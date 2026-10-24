import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'GoPratle | Event Requirement Platform',
  description: 'Post and hire verified event planners, artists, performers, and technical crew with dynamic workflow customization.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-serif bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
