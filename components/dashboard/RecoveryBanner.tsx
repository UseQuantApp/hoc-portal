'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface RecoveryBannerProps {
  onDismiss?: () => void;
}

export default function RecoveryBanner({ onDismiss }: RecoveryBannerProps) {
  return (
    <div className="w-full bg-gradient-to-r from-[#fff7ed] to-[#ffedd5] border border-[#fed7aa] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-[#ea580c] text-white flex items-center justify-center shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-xs sm:text-sm text-[#9a3412]">
            Secure your academic uploads & scholar points
          </p>
          <p className="text-[11px] text-[#c2410c]">
            Link a verified recovery email address to avoid losing your account and unlocked badges.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/account/add-recovery-email"
          className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs"
        >
          <span>Add Email</span>
          <ArrowRight size={14} />
        </Link>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs text-[#9a3412] hover:text-[#7c2d12] px-2 py-1 font-medium cursor-pointer"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
