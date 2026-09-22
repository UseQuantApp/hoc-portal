import Image from "next/image";
import { Lock, AlertTriangle, ArrowRight } from "lucide-react";

// NEW: matches the Badge schema from GET /badges/mine — replaces the old local Week type
type Badge = {
  id: string;
  key: string;
  name: string;
  description: string;
  category: string;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "obsidian";
  points: number;
  earned: boolean;
  earnedAt: string | null;
};

// NEW: matches the pointsData prop shape sent from app/dashboard/page.tsx
type PointsSummary = { points: number; tokens: number; lifetimePointsEarned: number; uploadStreakDays: number };

type PointsProgressCardProps = {
  totalUploaded?: number;
  pointsEarned?: number;
  badges?: Badge[]; // CHANGED: was weeks?: Week[]
  pointsData?: PointsSummary; // NEW
  fullName?: string;
  tokens?: number;
  uploadStreakDays?: number;
};

export default function PointsProgressCard({
  totalUploaded = 0,
  pointsEarned = 0,
  badges = [], // CHANGED: was weeks = defaultWeeks
  pointsData = { points: 0, tokens: 0, lifetimePointsEarned: 0, uploadStreakDays: 0 }, // NEW
  fullName = "",
  tokens = 0,
  uploadStreakDays = 0,
}: PointsProgressCardProps) {
  const isEmpty = pointsEarned === 0;
  const firstName = fullName ? fullName.split(" ")[0] : "";

  // NEW: sort ascending by points threshold so the row still renders in progression order,
  // since the API doesn't guarantee /badges/mine comes back pre-sorted.
  const sortedBadges = [...badges].sort((a, b) => a.points - b.points);

  // NEW: the first badge the student hasn't earned yet is "current" and gets the ring.
  // Everything earned is achieved (green); everything else stays locked (grey).
  const currentIndex = sortedBadges.findIndex((b) => !b.earned);

  return (
    <div className="w-full font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-6 lg:mb-8">
        <div className="flex flex-col gap-1.5 lg:gap-3">
          <p className="text-base lg:text-[28px] text-[#212121]">
            Welcome <span className="font-bold">{firstName ? `${firstName}!` : "..."}</span> 👋
          </p>
          <p className="text-sm lg:text-lg text-black">
            {isEmpty
              ? "You haven't uploaded anything yet — start sharing and earning today."
              : "Here's what moved while you were away."}
          </p>
        </div>
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 lg:gap-2.5">
          <p className="text-sm lg:text-lg text-black">Total Uploaded Materials</p>
          <div className="flex items-center gap-1.5 lg:gap-2.5">
            <Image src="/images/points-icon.png" alt="" width={16} height={16} className="lg:w-[23px] lg:h-[23px]" />
            <p className="text-lg lg:text-[28px] font-bold text-[#212121]">{totalUploaded}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#f6f6f6] rounded-xl flex items-center gap-4 lg:gap-8 p-3 lg:p-4 h-auto lg:h-[180px] overflow-x-auto">
        <div className="bg-[#eff7ff] border-2 border-[#e6f1ff] rounded-xl flex flex-col gap-2 lg:gap-3 items-center justify-center px-4 lg:px-6 py-2 lg:py-3 h-[110px] lg:h-[153px] w-[150px] lg:w-[220px] shrink-0">
          <p className="text-xs lg:text-base text-black">Points earned</p>
          <div className="flex items-center gap-1">
            <Image src="/images/points-icon-large.png" alt="" width={13} height={13} className="lg:w-[19px] lg:h-[19px]" />
            <p className="text-base lg:text-2xl font-bold text-[#0225b6]">{pointsEarned.toLocaleString()} Points</p>
          </div>
          <button
            className={`bg-[#006dff] text-white text-xs lg:text-base flex items-center gap-1.5 lg:gap-2.5 px-4 lg:px-7 py-1.5 lg:py-2.5 rounded-lg ${
              isEmpty ? "opacity-50" : ""
            }`}
          >
            Redeem
            <ArrowRight size={14} className="lg:hidden" />
            <ArrowRight size={20} className="hidden lg:block" />
          </button>
        </div>

        <Stat label="Tokens" value={tokens.toLocaleString()} />
        <Stat label="Upload streak" value={`${uploadStreakDays} days`} />

        {/* TEMPORARY: hiding the whole badge row per request — uncomment to bring it back
        <div className="flex items-center justify-between gap-3 lg:gap-6 border-l border-[#e5e5e5] pl-4 lg:pl-8 flex-1 min-w-0">
          {sortedBadges.length === 0 ? (
            <p className="text-xs lg:text-sm text-[#9f9f9f] px-2">Loading badges...</p>
          ) : (
            sortedBadges.map((badge, i) => {
              const achieved = badge.earned;
              const isCurrent = i === currentIndex;
              const pointsAway = badge.points - pointsData.points;
              const badgeLabel = badge.tier.charAt(0).toUpperCase();

              const badgeIcon = (
                <div
                  className={`relative size-[26px] lg:size-[34px] rounded-md flex flex-col items-center justify-center border-2 border-white ${
                    achieved || isCurrent ? "bg-[#008551]" : "bg-[#cbcbcb]"
                  }`}
                >
                  <Image src="/images/badge-metal.svg" alt="" width={11} height={11} className="lg:w-[14px] lg:h-[14px]" />
                  <span className="absolute bottom-1 lg:bottom-1.5 text-white text-[5px] lg:text-[6px] font-bold">
                    {badgeLabel}
                  </span>
                </div>
              );

              if (isCurrent) {
                return (
                  <div key={badge.id} className="relative shrink-0 size-[90px] lg:size-[130px] flex flex-col items-center justify-center">
                    <Image src="/images/progress-ring.svg" alt="" fill className="object-contain" />
                    <div className="absolute top-3 lg:top-5">{badgeIcon}</div>
                    <p className="text-xs lg:text-base font-bold text-[#212121] mt-8 lg:mt-11">
                      {badge.points.toLocaleString()}
                    </p>
                    <p className="text-[8px] lg:text-[10px] text-black">Points</p>
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={9} className="text-[#ffcc14]" />
                      <p className="text-[8px] lg:text-[10px] font-bold text-[#ffcc14]">
                        {pointsAway.toLocaleString()} points Away
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={badge.id} className="flex flex-col items-center gap-1.5 lg:gap-2 shrink-0">
                  {badgeIcon}
                  <p className={`text-xs lg:text-base font-bold ${achieved ? "text-[#212121]" : "text-[#9f9f9f]"}`}>
                    {badge.points.toLocaleString()}
                  </p>
                  {achieved ? (
                    <p className="text-[8px] lg:text-[10px] text-[#9f9f9f]">Points</p>
                  ) : (
                    <div className="flex items-center gap-0.5">
                      <Lock size={7} className="text-[#9f9f9f]" />
                      <p className="text-[8px] lg:text-[10px] text-[#9f9f9f]">Points</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        */}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 lg:gap-2 shrink-0 px-1 lg:px-2">
      <p className="text-xs lg:text-base font-bold text-[#212121]">{value}</p>
      <p className="text-[8px] lg:text-[10px] text-[#9f9f9f]">{label}</p>
    </div>
  );
}