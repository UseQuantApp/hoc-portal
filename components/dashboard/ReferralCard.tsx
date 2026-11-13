"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Users } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Referral = {
  fullName: string;
  university: string;
  department: string;
  completed: boolean;
  joinedAt: string;
};

type ReferralSummary = {
  code: string;
  pointsPerReferral: number;
  pointsEarned: number;
  referrals: Referral[];
};

function formatJoinedDate(joinedAt: string) {
  const date = new Date(joinedAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

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

  const referrals = summary?.referrals ?? [];

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
        <div className="flex flex-col gap-3 animate-pulse">
          <div className="bg-[#f0f0f0] h-16 rounded-xl w-full" />
          <div className="bg-[#f0f0f0] h-16 rounded-xl w-full" />
        </div>
      ) : loadError ? (
        <p className="text-sm font-bold text-[#ff3b3b] text-center py-6">{loadError}</p>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="bg-white border border-[#ececec] rounded-xl flex items-center justify-between gap-3 p-3 lg:p-4 lg:w-[380px] shrink-0">
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

            <div className="bg-white border border-[#ececec] rounded-xl flex flex-col justify-center gap-1 p-3 lg:p-4 flex-1">
              <p className="text-xl lg:text-2xl font-bold text-[#212121]">{summary?.pointsEarned ?? 0}</p>
              <p className="text-xs lg:text-sm text-[#6d6d6d]">Points earned</p>
            </div>
          </div>

          {copyError && <p className="text-sm font-bold text-[#ff3b3b]">{copyError}</p>}

          {referrals.length === 0 ? (
            <div className="bg-white border border-[#f2f4f7] rounded-xl flex flex-col items-center gap-2 lg:gap-3 px-6 py-8">
              <div className="bg-[#f4f9ff] rounded-full size-11 lg:size-14 flex items-center justify-center text-[#006dff]">
                <Users size={22} />
              </div>
              <p className="font-bold text-lg lg:text-2xl text-[#212121]">No referrals yet</p>
              <p className="text-sm lg:text-base text-[#9f9f9f] text-center max-w-[330px]">
                Students who sign up with your code will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {referrals.map((referral, index) => (
                <div
                  key={`${referral.fullName}-${referral.joinedAt}-${index}`}
                  className="bg-white border border-[#ececec] rounded-xl flex items-center justify-between gap-3 p-3 lg:p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm lg:text-lg text-[#212121] truncate">{referral.fullName}</p>
                    <p className="text-xs lg:text-sm text-[#6d6d6d] truncate">
                      {[referral.department, referral.university, formatJoinedDate(referral.joinedAt)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span
                    className={`text-xs lg:text-sm font-bold px-3 py-1 rounded-full shrink-0 ${
                      referral.completed ? "bg-[#e6f7f0] text-[#00a86b]" : "bg-[#fff3e8] text-[#f60]"
                    }`}
                  >
                    {referral.completed ? "Verified" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
