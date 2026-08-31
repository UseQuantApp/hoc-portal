'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col justify-between items-center p-4 sm:p-6">
      <header className="w-full max-w-5xl flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-[#006dff] flex items-center justify-center text-white font-black text-lg shadow-xs">
            Q
          </div>
          <span className="font-extrabold text-2xl text-[#006dff] tracking-tight">Quant</span>
        </Link>
      </header>

      <main className="w-full max-w-md my-8">
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center text-center gap-6">
          <div className="size-16 rounded-full bg-[#ecfdf5] border-4 border-[#d1fae5] flex items-center justify-center text-[#00b368]">
            <CheckCircle2 size={36} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-[#1e293b] tracking-tight">Email Verified!</h1>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Your institutional email has been successfully authenticated. Welcome to the Quant Scholar Community!
            </p>
          </div>

          <div className="w-full p-4 bg-[#eff6ff] rounded-2xl border border-[#dbeafe] text-left flex items-start gap-3">
            <Sparkles size={20} className="text-[#006dff] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5 text-xs">
              <span className="font-bold text-[#1e293b]">Welcome Bonus +100 Points</span>
              <span className="text-[#64748b]">Your starting tier milestone is now active.</span>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="w-full bg-[#f60] hover:bg-[#e55600] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>Enter Scholar Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-[#94a3b8] py-4">
        © 2025 Quant Campus Academic System.
      </footer>
    </div>
  );
}
