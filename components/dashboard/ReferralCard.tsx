"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { apiFetch } from "@/lib/api";

type ReferralSummary = {
  code: string;
  pointsPerReferral: number;
};

export default function ReferralCard() {
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  useEffect(() => {
    async function loadReferrals() {
      try {
        const response = await apiFetch("/students/me/referrals");
        setSummary(response.data ?? response);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Unable to load your referral code.");
      } finally {
        setIsLoading(false);
      }
    }
    loadReferrals();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (!summary?.code) return;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(summary.code);
      setCopied(true);
    } catch {
      setCopyError("Couldn't copy automatically. Select the code and copy it manually.");
    }
  };

  return (
    <div className="border border-[#ececec] bg-[#fbfbfb] rounded-2xl flex flex-col gap-6 lg:gap-8 p-3 lg:p-4 w-full">
      <div className="flex flex-col gap-1">
        <p className="text-lg lg:text-[28px] font-bold text-[#212121]">Refer &amp; Earn</p>
        <p className="text-sm lg:text-base text-[#6d6d6d]">
          {summary
            ? `Earn ${summary.pointsPerReferral} points for every student who signs up with your code and verifies their email.`
            : "Share your code with other students and earn points when they join."}
        </p>
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="bg-[#f0f0f0] h-16 rounded-xl w-full lg:w-[380px]" />
        </div>
      ) : loadError ? (
        <p className="text-sm font-bold text-[#ff3b3b] text-center py-6">{loadError}</p>
      ) : (
        <>
          <div className="bg-white border border-[#ececec] rounded-xl flex items-center justify-between gap-3 p-3 lg:p-4 w-full lg:w-[380px]">
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-xs lg:text-sm text-[#6d6d6d]">Your referral code</p>
              <p className="text-xl lg:text-2xl font-bold text-[#212121] tracking-widest break-all select-all">
                {summary?.code || "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!summary?.code}
              className="flex items-center gap-2 bg-[#f60] disabled:opacity-50 text-white text-sm lg:text-base font-bold px-4 py-2.5 rounded-xl hover:bg-[#e55600] transition-colors shrink-0"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {copyError && <p className="text-sm font-bold text-[#ff3b3b]">{copyError}</p>}
        </>
      )}
    </div>
  );
}
