"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Eye, EyeOff } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (password.length < 6) {
      setSubmitError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setSubmitError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code, newPassword: password }),
      });
      setSuccessMessage("Your password has been reset successfully.");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row gap-10 lg:gap-16 items-center px-6 py-8 lg:p-8">
        {/* Left: New password form */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8 max-w-[393px] mx-auto lg:mx-0">
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <h1 className="text-xl lg:text-[28px] font-bold text-[#212121]">Set new password</h1>
            <p className="text-sm lg:text-base text-[#212121]">
              Enter your new password below
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-sm lg:text-base font-bold text-[#212121]">
                  Email Address
                </label>
                <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="code" className="text-sm lg:text-base font-bold text-[#212121]">
                  6-digit Code
                </label>
                <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    required
                    className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="new-password" className="text-sm lg:text-base font-bold text-[#212121]">
                  New Password
                </label>
                <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4 flex items-center gap-2.5">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    placeholder="••••••••••"
                    className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-[#9f9f9f] shrink-0">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="confirm-password" className="text-sm lg:text-base font-bold text-[#212121]">
                  Confirm New Password
                </label>
                <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4 flex items-center gap-2.5">
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    placeholder="••••••••••"
                    className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-[#9f9f9f] shrink-0">
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {submitError && (
              <p className="text-sm font-bold text-[#ff3b3b] text-center">{submitError}</p>
            )}
            {successMessage && (
              <p className="text-sm text-[#00a86b] text-center">{successMessage}</p>
            )}

            {successMessage ? (
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full bg-[#f60] text-white text-base lg:text-lg font-bold py-3 rounded-xl hover:bg-[#e55600] transition-colors text-center"
              >
                Continue to Login
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#f60] disabled:opacity-50 text-white text-base lg:text-lg font-bold py-3 rounded-xl hover:bg-[#e55600] transition-colors text-center"
              >
                {isSubmitting ? "Saving..." : "Save Password"}
              </button>
            )}
          </form>
        </div>

        {/* Right: Blue promo panel */}
        <div className="hidden lg:block w-full lg:w-1/2 relative bg-[#006dff] rounded-3xl overflow-hidden aspect-[644/953] max-w-[644px]">
          <p className="absolute top-8 left-1/2 -translate-x-1/2 w-[80%] text-center text-white text-2xl md:text-[32px] leading-tight">
            Your department&apos;s <span className="font-bold">entire library</span>
          </p>

          <div className="absolute left-[5%] top-[20%] w-[90%] aspect-square opacity-90">
            <Image src="/images/blob-bg.svg" alt="" fill className="object-contain" />
          </div>

          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[380px] rotate-[-7deg]">
            <Image
              src="/images/phone-mockup.png"
              alt="WhatsApp chat on phone showing Quant assistant"
              width={454}
              height={646}
              className="w-full h-auto"
            />
          </div>

          <div className="absolute right-[8%] top-[45%] w-[28%] max-w-[168px] rotate-[10deg]">
            <div className="relative aspect-square">
              <Image src="/images/badge-ellipse.svg" alt="" fill className="object-contain" />
              <Image src="/images/star-badge.svg" alt="" fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white text-xs leading-tight px-4">
                Your Academic Success Begins <span className="font-bold">Here!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}