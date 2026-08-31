'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

export default function RecoveryEmailFailedPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col justify-between items-center">
      <Header showBack backHref="/account" title="Verification Issue" />

      <main className="w-full max-w-md my-8 px-4">
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center text-center gap-6">
          <div className="size-16 rounded-full bg-[#fef2f2] border-4 border-[#fee2e2] flex items-center justify-center text-[#ef4444]">
            <AlertCircle size={36} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-[#1e293b] tracking-tight">Verification Failed</h1>
            <p className="text-xs text-[#64748b] leading-relaxed">
              The OTP code provided was invalid or has expired. Please request a new security PIN to proceed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <Link
              href="/account/verify-recovery-email"
              className="w-full bg-[#006dff] hover:bg-[#0056cc] text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs"
            >
              <RotateCcw size={14} />
              <span>Retry Code</span>
            </Link>
            <Link
              href="/account/add-recovery-email"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] text-[#1e293b] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Change Email</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-[#94a3b8] py-4">
        © 2025 Quant Campus Academic System.
      </footer>
    </div>
  );
}
