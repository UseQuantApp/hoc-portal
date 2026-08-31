'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsSuccess(true);
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
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </header>

      <main className="w-full max-w-md my-8">
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 text-center">
            <div className="size-12 rounded-2xl bg-[#eff6ff] text-[#006dff] flex items-center justify-center mx-auto mb-1">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1e293b] tracking-tight">Create New Password</h1>
            <p className="text-xs text-[#64748b]">
              Enter the reset token sent to your email and your new password.
            </p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="p-4 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl flex flex-col items-center gap-2 text-xs text-[#065f46]">
                <p className="font-bold text-sm">Password Reset Successful!</p>
                <p className="text-[11px]">Your new credentials have been updated securely.</p>
              </div>

              <Link
                href="/"
                className="w-full bg-[#006dff] hover:bg-[#0056cc] text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#475569]">6-Digit Reset Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] focus:bg-white rounded-xl px-4 py-2.5 text-center text-sm font-bold tracking-widest text-[#1e293b] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#475569]">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1e293b] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#475569]">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1e293b] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#006dff] hover:bg-[#0056cc] text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
              >
                <span>Update Password</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-[#94a3b8] py-4">
        © 2025 Quant Campus Academic System.
      </footer>
    </div>
  );
}
