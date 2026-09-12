"use client";

import { startTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import { apiFetch } from "@/lib/api";

const RESEND_COOLDOWN = 54;

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [tooManyAttempts, setTooManyAttempts] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("quant_signup_email");
    if (storedEmail) startTransition(() => setEmail(storedEmail));
  }, []);

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
    // TODO: backend — no dedicated resend-email-otp endpoint exists yet; confirm with backend dev
    setSecondsLeft(RESEND_COOLDOWN);
    setOtpError(false);
    setTooManyAttempts(false);
    setAttemptCount(0);
  };

  const handleVerify = async () => {
    const code = otpDigits.join("");
    if (code.length !== 6 || !email) return;

    setIsVerifying(true);
    try {
      await apiFetch("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      router.push("/email-verified");
    } catch {
      const nextCount = attemptCount + 1;
      setAttemptCount(nextCount);
      if (nextCount >= 3) {
        setTooManyAttempts(true);
      } else {
        setOtpError(true);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row gap-10 lg:gap-16 items-center px-6 py-8 lg:p-8">
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
                Check your email
              </h1>
              <p className="text-base lg:text-xl text-[#212121]">
                We&apos;ve sent a 6-digit verification code to{" "}
                <span className="font-bold text-[#006dff]">{email || "your email"}</span>. Enter the code below to verify your email.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex gap-1.5 sm:gap-2 lg:gap-3.5">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={tooManyAttempts}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      const next = [...otpDigits];
                      next[i] = val;
                      setOtpDigits(next);
                      if (val && i < 5) {
                        document.getElementById(`otp-${i + 1}`)?.focus();
                      }
                    }}
                    id={`otp-${i}`}
                    className={`size-10 sm:size-12 lg:size-14 text-center text-xl lg:text-2xl rounded-lg border focus:outline-none text-black disabled:opacity-50 disabled:bg-[#f6f6f6] ${
                      otpError ? "border-[#e3e3e3]" : "border-[#e0e0e0] focus:border-[#006dff]"
                    }`}
                  />
                ))}
              </div>

              {otpError && !tooManyAttempts && (
                <p className="text-xs font-bold text-[#ff3b3b] text-center">
                  The code you entered is incorrect. Please check your email and try again.
                </p>
              )}
              {tooManyAttempts && (
                <p className="text-xs font-bold text-[#ff3b3b] text-center max-w-[360px]">
                  Too many incorrect attempts. Please wait a moment before trying again, or request a new code.
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-3 lg:gap-3.5 w-full">
              <button
                onClick={handleVerify}
                disabled={tooManyAttempts || isVerifying}
                className="w-full bg-[#f60] disabled:opacity-50 text-white text-base lg:text-lg font-bold py-3 rounded-xl hover:bg-[#e55600] transition-colors"
              >
                {isVerifying ? "verifying..." : "Verify email"}
              </button>

              <p className="text-sm lg:text-lg">
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
        </div>
      </div>
    </main>
  );
}