"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import FullLeaderboard from "@/components/dashboard/FullLeaderboard";

export type Leader = {
  name: string;
  tier: string;
  materials: number;
  points: string;
  medal: string | null;
  rank?: number;
  avatar: string;
  isYou: boolean;
};

export default function LeaderboardCard({ leaders = [], me }: { leaders?: Leader[]; me?: { rank: number; points: number } | null }) {
  const [showModal, setShowModal] = useState(false);
  const hasYouRanked = leaders.some((l) => l.isYou);
  const displayLeaders = me && !hasYouRanked
    ? [...leaders, { name: "You", tier: `#${me.rank}`, materials: 0, points: me.points.toLocaleString(), medal: null, rank: me.rank, avatar: "/images/avatar-user.png", isYou: true }]
    : leaders;

  return (
    <div className="flex flex-col gap-4 lg:gap-8 flex-1">
      <div className="flex items-center justify-between">
        <p className="text-lg lg:text-[28px] font-bold text-[#212121]">Top Contributors Leaderboard</p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#fcfdfd] border border-[#e5e5e5] text-[#212121] text-xs lg:text-base flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3.5 rounded-lg shrink-0"
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="border border-[#ececec] bg-[#fbfbfb] rounded-2xl flex flex-col gap-2 lg:gap-4 p-2 lg:p-4">
        {displayLeaders.map((leader) => (
          <div
            key={leader.name}
            className={`rounded-3xl flex items-center justify-between px-3 lg:px-4 py-2 lg:py-2.5 gap-2 ${
              leader.isYou ? "bg-[#edf5ff] border border-[#b2d3ff]" : "bg-white"
            }`}
          >
<div className="flex items-center gap-2 lg:gap-6 min-w-0">
  {/* rank/medal — desktop only, sits on the left */}
  {leader.medal ? (
    <Image src={leader.medal} alt="" width={20} height={20} className="hidden lg:block lg:w-[34px] lg:h-[34px] shrink-0" />
  ) : leader.rank ? (
    <p className="hidden lg:block font-bold text-2xl text-[#f60] shrink-0 w-10">#{leader.rank}</p>
  ) : (
    <span className="hidden lg:block w-[34px] text-center text-[#9f9f9f] shrink-0">–</span>
  )}
  <div className="flex items-center gap-2 lg:gap-4 min-w-0">
    <div className="relative size-[44px] lg:size-[86px] rounded-full overflow-hidden bg-[#d9d9d9] shrink-0">
      <Image src={leader.avatar} alt={leader.name} fill className="object-cover" />
    </div>
    <div className="flex flex-col gap-1 lg:gap-2 min-w-0">
      <p
       className={`font-bold text-sm lg:text-xl tracking-tight truncate ${
     leader.isYou ? "text-[#006dff]" : "text-[#212121]"
      }`}
      >
        {leader.name}
      </p>
      <div className="flex items-center gap-2 lg:gap-4">
        <p className="text-xs lg:text-lg text-[#6d6d6d]">{leader.tier}</p>
        <div className="flex items-center gap-1">
          <Image src="/images/points-icon.png" alt="" width={13} height={13} className="opacity-70 lg:hidden" />
          <p className="text-xs lg:hidden text-[#6d6d6d]">{leader.materials} materials</p>
          <div className="hidden lg:flex items-center gap-1">
            <Image src="/images/points-icon.png" alt="" width={17} height={17} className="opacity-70" />
            <p className="text-lg text-[#6d6d6d]">{leader.materials} materials</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* mobile: medal/rank stacked above points, on the right */}
<div className="flex flex-col items-end gap-1 shrink-0">
  {leader.medal ? (
    <Image src={leader.medal} alt="" width={17} height={17} className="lg:hidden" />
  ) : leader.rank ? (
    <p className="lg:hidden font-bold text-xs text-[#f60]">#{leader.rank}</p>
  ) : null}
  <p
   className={`font-bold text-sm lg:text-xl tracking-tight truncate ${
  leader.isYou ? "text-[#006dff]" : "text-[#212121]"
    }`}
  >
    {leader.points} pts
       </p>
        </div>
          </div>
        ))}

        {!hasYouRanked && (
          <div className="bg-[#fff8f4] border-t-2 border-dashed border-[#ffd0aa] flex items-center gap-2 lg:gap-4 px-3 lg:px-6 py-3 lg:py-4">
            <span className="w-5 lg:w-8 text-center text-[#9f9f9f] text-xs lg:text-sm shrink-0">–</span>
            <div className="flex-1 flex flex-col gap-1.5 lg:gap-3.5 min-w-0">
              <p className="font-bold text-sm lg:text-xl text-[#212121]">Akorede (you)</p>
              <p className="text-xs lg:text-sm text-[#9f9f9f] truncate">Upload your first material to claim your spot</p>
            </div>
            <p className="text-xs lg:text-sm text-[#9f9f9f] shrink-0">No rank yet</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[700px] max-h-[85vh] overflow-y-auto p-4 lg:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <p className="text-lg lg:text-2xl font-bold text-[#212121]">Top Contributors Leaderboard</p>
              <button onClick={() => setShowModal(false)} className="text-[#9f9f9f]">
                <X size={24} />
              </button>
            </div>
            <FullLeaderboard leaders={displayLeaders} />
          </div>
        </div>
      )}
    </div>
  );
}