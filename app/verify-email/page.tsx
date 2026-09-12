"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Mail } from "lucide-react";

export default function VerifyEmailIntroPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    startTransition(() => setEmail(sessionStorage.getItem("quant_signup_email") || ""));
  }, []);

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center gap-6 px-6 py-10 lg:py-16">
        <div className="bg-[#eff7ff] rounded-full size-16 flex items-center justify-center">
          <Mail className="text-[#006dff]" size={28} />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-lg lg:text-xl font-bold text-[#212121]">Verify your email</h1>
          <p className="text-sm lg:text-base text-[#212121]">
            Verify your email to complete your Quant account setup and access your dashboard. We&apos;ll send a verification code to{" "}
            <span className="font-bold text-[#006dff]">{email || "your email"}</span>
          </p>
        </div>

        <Link
          href="/verify-otp"
          className="w-full bg-[#f60] text-white text-base lg:text-lg font-bold py-3 rounded-xl hover:bg-[#e55600] transition-colors text-center block"
        >
          Send verification code
        </Link>
      </div>
    </main>
  );
}