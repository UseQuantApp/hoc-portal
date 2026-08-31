'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col justify-between items-center p-4 sm:p-6">
      <header className="w-full max-w-5xl flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-[#006dff] flex items-center justify-center text-white font-black text-lg shadow-xs">
            Q
          </div>
          <span className="font-extrabold text-2xl text-[#006dff] tracking-tight">Quant</span>
        </Link>
        <Link href="/" className="text-xs font-bold text-[#64748b] hover:text-[#1e293b] flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </Link>
      </header>

      <main className="w-full max-w-md my-8">
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 text-center">
            <div className="size-12 rounded-2xl bg-[#eff6ff] text-[#006dff] flex items-center justify-center mx-auto mb-1">
              <KeyRound size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1e293b] tracking-tight">Two-Factor OTP</h1>
            <p className="text-xs text-[#64748b]">
              Enter the one-time authentication code generated for your session.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#475569]">6-Digit Security PIN</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] focus:bg-white rounded-xl px-4 py-3 text-center text-lg font-black tracking-widest text-[#1e293b] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#006dff] hover:bg-[#0056cc] text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isLoading ? <span>Verifying OTP...</span> : <><span>Confirm & Proceed</span><ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-xs text-[#94a3b8] py-4">
        © 2025 Quant Campus Academic System.
      </footer>
    </div>
  );
}
