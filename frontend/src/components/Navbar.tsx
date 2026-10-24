'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ListOrdered, Layers, CheckCircle2, Circle } from 'lucide-react';
import { checkBackendHealth } from '@/lib/api';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendHealth().then((res) => setIsBackendHealthy(res.connected));
    const interval = setInterval(() => {
      checkBackendHealth().then((res) => setIsBackendHealthy(res.connected));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const isHome = pathname === '/';
  const isFeed = pathname.startsWith('/requirements');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent tracking-tight">
              GoPratle
            </span>
            <span className="text-xs text-emerald-600 font-medium -mt-1">
              Event Requirement Platform
            </span>
          </div>
        </Link>

        {/* Center Capsule Navigation (As in Screenshot 1 & dummyStyles) */}
        <nav className="flex items-center bg-white border border-emerald-200 p-1.5 rounded-full shadow-lg shadow-emerald-900/5">
          <Link
            href="/"
            className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              isHome
                ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100 ring-2 ring-emerald-200'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Post Requirement</span>
            {isHome && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
            )}
          </Link>

          <Link
            href="/requirements"
            className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              isFeed
                ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100 ring-2 ring-emerald-200'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
            }`}
          >
            <ListOrdered className="w-4 h-4 text-emerald-600" />
            <span>Browse Feed</span>
            {isFeed && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
            )}
          </Link>
        </nav>

        {/* Right Status Capsule */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/80 border border-emerald-200 text-xs font-medium text-emerald-800 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isBackendHealthy ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isBackendHealthy ? 'bg-emerald-600' : 'bg-rose-500'
                }`}
              />
            </span>
            <span>
              API: {isBackendHealthy ? (
                <strong className="text-emerald-700 font-bold">Online (MongoDB)</strong>
              ) : (
                <strong className="text-rose-600 font-bold">Connecting...</strong>
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
