"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";

const RESEND_COOLDOWN = 54; // seconds — backend should confirm/enforce the real value

export default function VerifyOtpPage() {
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

    // TODO: call resend OTP API here, e.g.:
    // await fetch("/api/auth/resend-otp", { method: "POST", body: JSON.stringify({ phone: "+2347012345678" }) });

    setSecondsLeft(RESEND_COOLDOWN); // restart the cooldown once resend is triggered
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start px-6 py-8 lg:p-8">
        {/* Left: Illustration panel — desktop only */}
        <div className="hidden lg:block w-full lg:w-1/2 relative bg-[#ddefff] rounded-3xl overflow-hidden aspect-[644/953] max-w-[644px]">
          <p className="absolute top-[7.6%] left-1/2 -translate-x-1/2 w-[75%] text-center text-2xl md:text-[28px] leading-tight text-[#212121]">
            Academic Assistant<br />On <span className="font-bold">WhatsApp</span>
          </p>

          <div className="absolute top-[22.2%] left-[34.5%] flex items-center gap-2.5">
            <div className="relative w-4 h-4">
              <Image src="/images/mini-logo-icon.png" alt="" fill className="object-contain" />
            </div>
            <div className="relative w-px h-5">
              <Image src="/images/divider-line.svg" alt="" fill />
            </div>
            <span className="text-lg text-[#212121]">getquant.app</span>
          </div>

          <div className="absolute left-[-34.3%] top-[49.2%] right-[52%] bottom-[-5.8%]">
            <Image src="/images/cube-shadow.svg" alt="" fill className="object-contain" />
          </div>
          <div className="absolute left-[29.8%] top-[63%] right-[-21.6%] bottom-[-22.3%]">
            <Image src="/images/cube-piece-1.svg" alt="" fill className="object-contain" />
          </div>
          <div className="absolute left-[8%] top-[41.5%] right-[8%] bottom-[2.9%]">
            <Image src="/images/cube-piece-2.svg" alt="" fill className="object-contain" />
          </div>
        </div>

        {/* Right: OTP form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-8 lg:gap-10 max-w-[492px] mx-auto">
          <StepIndicator step={2} className="hidden lg:flex" />

          <div className="flex flex-col items-center gap-6 lg:gap-8 w-full text-center">
            <div className="flex flex-col items-center gap-2 lg:gap-4">
              <h1 className="text-xl lg:text-[28px] font-bold text-[#212121]">
                Enter verification Code (OTP)
              </h1>
              <p className="text-base lg:text-xl text-[#212121]">
                We sent a 6-digit code to <span className="font-bold">+234 701 234 5678</span>
              </p>
            </div>

            <div className="flex gap-2 lg:gap-3.5">
              {["2", "", "", "", "", ""].map((val, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  defaultValue={val}
                  className="size-12 lg:size-16 text-center text-xl lg:text-2xl rounded-lg border border-[#e0e0e0] focus:border-[#006dff] focus:outline-none text-black"
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-3 lg:gap-3.5 w-full">
              <button className="w-full bg-[#006dff] text-white text-base lg:text-lg py-3 rounded-xl hover:bg-[#005ce0] transition-colors">
                Verify &amp; Continue
              </button>

              <p className="text-sm lg:text-lg">
                <span className="text-black/50">Didn&apos;t receive it? </span>
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="font-bold text-[#006dff] hover:underline"
                  >
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
        </div>
      </div>
    </main>
  );
}