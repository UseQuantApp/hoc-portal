'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RecoveryEmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col justify-between items-center">
      <Header showBack backHref="/account" title="Account Security" subtitle="Completed" />

      <main className="w-full max-w-md my-8 px-4">
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center text-center gap-6">
          <StepIndicator steps={['Add Email', 'Verify OTP', 'Completed']} currentStep={2} />

          <div className="size-16 rounded-full bg-[#ecfdf5] border-4 border-[#d1fae5] flex items-center justify-center text-[#00b368]">
            <CheckCircle2 size={36} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-[#1e293b] tracking-tight">Recovery Email Linked!</h1>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Your secondary address has been authenticated. You can now use it to restore access and secure your scholar points.
            </p>
          </div>

          <Link
            href="/account"
            className="w-full bg-[#006dff] hover:bg-[#0056cc] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>Return to Account Settings</span>
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
