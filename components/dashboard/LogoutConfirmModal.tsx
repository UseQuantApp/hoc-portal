"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";

type LogoutConfirmModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
};

export default function LogoutConfirmModal({ onCancel, onConfirm, isLoggingOut = false }: LogoutConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white px-4" role="dialog" aria-modal="true">
      <div className="flex flex-col items-center text-center max-w-[360px] w-full gap-6">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7">
            <Image src="/images/logo-icon.png" alt="Quant logo" fill className="object-contain" />
          </div>
          <span className="text-2xl font-medium text-[#212121]">Quant</span>
        </div>

        <div className="flex items-center justify-center size-20 rounded-full bg-[#fdeceb]">
          <LogOut size={32} className="text-[#e0483e]" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold text-xl text-[#212121]">Log out of Quant?</p>
          <p className="text-sm text-[#9f9f9f]">
            You&apos;ll need to sign back in to access your dashboard and upload materials.
          </p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoggingOut}
            className="flex-1 bg-white border border-[#e5e5e5] text-[#212121] text-sm font-bold py-3 rounded-xl disabled:opacity-50"
          >
            Stay Logged In
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="flex-1 bg-[#f60] text-white text-sm font-bold py-3 rounded-xl disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}