'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto advance
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      router.push('/email-verified');
    }, 600);
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
        <Link href="/sign-up" className="text-xs font-bold text-[#64748b] hover:text-[#1e293b] flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </Link>
      </header>

      <main className="w-full max-w-md my-8">
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 text-center">
            <div className="size-12 rounded-2xl bg-[#eff6ff] text-[#006dff] flex items-center justify-center mx-auto mb-1">
              <Mail size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1e293b] tracking-tight">Verify Your Email</h1>
            <p className="text-xs text-[#64748b]">
              We've sent a 6-digit confirmation code to your institutional mailbox.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-2xl text-xs text-[#991b1b] text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div className="flex justify-center items-center gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="size-11 sm:size-12 text-center text-lg font-black text-[#1e293b] bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] focus:bg-white rounded-xl outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#f60] hover:bg-[#e55600] text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isVerifying ? <span>Verifying...</span> : <><span>Verify Email</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-[#64748b] pt-2 border-t border-[#f2f4f7]">
            <span>Didn't receive code?</span>
            {timer > 0 ? (
              <span className="font-semibold text-[#94a3b8]">Resend in {timer}s</span>
            ) : (
              <button
                onClick={() => setTimer(45)}
                className="font-bold text-[#006dff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} /> Resend code
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-[#94a3b8] py-4">
        © 2025 Quant Campus Academic System.
      </footer>
    </div>
  );
}
