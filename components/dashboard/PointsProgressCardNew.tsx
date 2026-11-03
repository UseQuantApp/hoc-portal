import Image from "next/image";
import { Lock, AlertTriangle, ArrowRight, Award } from "lucide-react";

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


type PointsProgressCardProps = {
  totalUploaded?: number;
  pointsEarned?: number;
  badges?: Badge[]; // CHANGED: was weeks?: Week[]
  fullName?: string;
};

export default function PointsProgressCard({
  totalUploaded = 0,
  pointsEarned = 0,
  badges = [], // CHANGED: was weeks = defaultWeeks
  fullName = "",
}: PointsProgressCardProps) {
  const isEmpty = pointsEarned === 0;
  const firstName = fullName ? fullName.split(" ")[0] : "";

  // Match the Figma track: badges in ascending points order, labelled T1, T2, ... by position.
  // Earned state still comes from the API, so an earned badge can sit after a locked one.
  const sortedBadges = [...badges].sort((a, b) => a.points - b.points);

  // The first locked badge in that order is "up next" and gets the ring.
  const currentIndex = sortedBadges.findIndex((b) => !b.earned);
  const earnedCount = badges.filter((b) => b.earned).length;
  const badgeProgress = badges.length ? Math.round((earnedCount / badges.length) * 100) : 0;

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

      <div className="bg-white border border-[#f6f6f6] rounded-xl flex items-center gap-4 lg:gap-8 p-3 lg:p-4 h-auto lg:min-h-[180px] overflow-x-auto overflow-y-hidden">
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

        <div className="flex items-center justify-between gap-3 lg:gap-6 flex-1 min-w-0">
          {sortedBadges.length === 0 ? (
            <p className="text-xs lg:text-sm text-[#9f9f9f] px-2">Loading badges...</p>
          ) : (
            sortedBadges.map((badge, i) => {
              const achieved = badge.earned;
              const isCurrent = i === currentIndex;
              const tier = badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1);
              const tooltip = `T${i + 1} · ${badge.name} (${tier})${badge.description ? ` — ${badge.description}` : ""}`;

              const badgeIcon = (
                <div
                  className={`size-[30px] lg:size-[38px] rounded-md flex flex-col items-center justify-center gap-px border-2 border-white shadow-sm ${
                    achieved ? "bg-[#008551]" : "bg-[#cbcbcb]"
                  }`}
                >
                  <Award className="size-[12px] lg:size-[16px] text-white" strokeWidth={2.25} />
                  <span className="text-white text-[7px] lg:text-[8px] font-bold leading-none">T{i + 1}</span>
                </div>
              );

              if (isCurrent) {
                return (
                  <div key={badge.id} title={tooltip} className="shrink-0 flex flex-col items-center gap-1">
                    <div className="relative size-[90px] lg:size-[130px] flex flex-col items-center justify-center">
                      {/* ring fill = share of all badges earned so far */}
                      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#edeef2" strokeWidth="6" />
                        <circle
                          cx="50" cy="50" r="44" fill="none" stroke="#008551" strokeWidth="6" strokeLinecap="round"
                          pathLength={100} strokeDasharray={`${badgeProgress} 100`}
                        />
                      </svg>
                      <div className="absolute top-3 lg:top-5">{badgeIcon}</div>
                      <p className="text-xs lg:text-base font-bold text-[#212121] mt-8 lg:mt-11">
                        {badge.points.toLocaleString()}
                      </p>
                      <p className="text-[8px] lg:text-[10px] text-black">Points</p>
                    </div>
                    <div className="flex items-center gap-1 max-w-[110px] lg:max-w-[140px]">
                      <AlertTriangle size={9} className="text-[#ffcc14] shrink-0" />
                      <p className="text-[8px] lg:text-[10px] font-bold text-[#ffcc14] truncate">
                        Next: {badge.name}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={badge.id} title={tooltip} className="flex flex-col items-center gap-1.5 lg:gap-2 shrink-0">
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
        
      </div>
    </div>
  );
}
