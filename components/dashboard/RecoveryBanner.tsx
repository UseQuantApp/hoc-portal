"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import Link from "next/link";

type RecoveryBannerProps = {
  status?: "no-email" | "unverified";
};

export default function RecoveryBanner({ status = "no-email" }: RecoveryBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const message =
    status === "no-email"
      ? "Add recovery email to secure your account"
      : "Verify recovery email to secure your account";

  const buttonLabel = status === "no-email" ? "Add email" : "Verify Email";

  return (
    <div className="relative bg-white flex items-center gap-4 p-4 pl-6 rounded-lg overflow-hidden w-full">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-[#f60]" />
      <div className="bg-[#ffebeb] rounded-full size-9 flex items-center justify-center shrink-0">
        <AlertCircle className="text-[#ff4343]" size={20} />
      </div>
      <p className="text-lg text-[#212121] flex-1">{message}</p>
      <Link
        href="/account/add-recovery-email"
       className="bg-[#006dff] text-white text-sm px-4 py-2.5 rounded-md whitespace-nowrap"
       >
       {buttonLabel}
      </Link>
      <button onClick={() => setVisible(false)} className="text-[#ff4343]">
        <X size={20} />
      </button>
    </div>
  );
}