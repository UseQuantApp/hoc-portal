"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";

const RESEND_COOLDOWN = 54;

export default function VerifyRecoveryEmailPage() {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const canResend = secondsLeft === 0;
  const formattedTime = `00:${secondsLeft.toString().padStart(2, "0")}`;

  const handleResend = async () => {
    if (!canResend) return;
    // TODO: call resend recovery-email OTP API here
    setSecondsLeft(RESEND_COOLDOWN);
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center gap-8 px-6 py-10 lg:py-16">
        <div className="bg-[#f4f4f4] rounded-full size-16 flex items-center justify-center">
          <Image src="/images/lock-icon.svg" alt="" width={24} height={24} />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-lg lg:text-xl font-bold text-[#212121]">Verify recovery Email</h1>
          <p className="text-sm lg:text-base text-[#212121]">
            We sent a 6-digit code to <span className="font-bold">ex********e@gmail.com</span>
          </p>
        </div>

        <div className="flex gap-2 lg:gap-2.5">
          {["2", "", "", "", "", ""].map((val, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              defaultValue={val}
              className="size-12 text-center text-xl rounded-md border border-[#e0e0e0] focus:border-[#006dff] focus:outline-none text-black"
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <button className="w-full bg-[#006dff] text-white text-base py-3 rounded-xl hover:bg-[#005ce0] transition-colors">
            Verify &amp; Continue
          </button>

          <p className="text-sm">
            <span className="text-black/50">Didn&apos;t receive it? </span>
            {canResend ? (
              <button onClick={handleResend} className="font-bold text-[#006dff] hover:underline">
                Resend
              </button>
            ) : (
              <>
                <span className="font-bold text-[#006dff]/50">Resend</span>
                <span> in </span>
                <span className="font-bold">{formattedTime}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}