'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import { KeyRound, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function VerifyRecoveryEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [targetEmail, setTargetEmail] = useState('your personal email');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = sessionStorage.getItem('pending_recovery_email');
      if (email) setTargetEmail(email);
    }
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

    if (val && index < 5) {
      const nextInput = document.getElementById(`rec-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`rec-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMsg('Please input the complete 6-digit code.');
      return;
    }

    // Fail simulation if code is 000000
    if (code === '000000') {
      router.push('/account/recovery-email-failed');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      router.push('/account/recovery-email-verified');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col justify-between items-center">
      <Header showBack backHref="/account/add-recovery-email" title="Account Security" subtitle="Step 2 of 2" />

      <main className="w-full max-w-md my-8 px-4">
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <StepIndicator steps={['Add Email', 'Verify OTP', 'Completed']} currentStep={1} />

          <div className="flex flex-col gap-1.5 text-center">
            <div className="size-12 rounded-2xl bg-[#eff6ff] text-[#006dff] flex items-center justify-center mx-auto mb-1">
              <KeyRound size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1e293b] tracking-tight">Enter 6-Digit PIN</h1>
            <p className="text-xs text-[#64748b]">
              Enter the security code delivered to <strong className="text-[#1e293b]">{targetEmail}</strong>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-2xl text-xs text-[#991b1b] text-center font-medium flex items-center justify-center gap-1.5">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div className="flex justify-center items-center gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`rec-otp-${idx}`}
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
              {isVerifying ? <span>Verifying OTP...</span> : <><span>Confirm & Link Email</span><ArrowRight size={16} /></>}
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
                <RefreshCw size={12} /> Resend PIN
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
