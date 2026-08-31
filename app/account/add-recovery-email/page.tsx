'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AddRecoveryEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // store in sessionStorage for the verification flow
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_recovery_email', email);
      }
      router.push('/account/verify-recovery-email');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col justify-between items-center">
      <Header showBack backHref="/account" title="Account Security" subtitle="Step 1 of 2" />

      <main className="w-full max-w-md my-8 px-4">
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <StepIndicator steps={['Add Email', 'Verify OTP', 'Completed']} currentStep={0} />

          <div className="flex flex-col gap-1.5 text-center">
            <div className="size-12 rounded-2xl bg-[#eff6ff] text-[#006dff] flex items-center justify-center mx-auto mb-1">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1e293b] tracking-tight">Add Recovery Email</h1>
            <p className="text-xs text-[#64748b]">
              Link a personal Gmail, Yahoo, or Outlook address to safeguard your academic uploads and points.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#475569]">Personal Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                <input
                  type="email"
                  required
                  placeholder="e.g. personal.scholar@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1e293b] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f60] hover:bg-[#e55600] text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
            >
              {isLoading ? <span>Sending Code...</span> : <><span>Send Verification Code</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="p-3 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] text-center">
            <p className="text-[11px] text-[#64748b]">
              A 6-digit confirmation code will be dispatched to this address immediately.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-[#94a3b8] py-4">
        © 2025 Quant Campus Academic System.
      </footer>
    </div>
  );
}
