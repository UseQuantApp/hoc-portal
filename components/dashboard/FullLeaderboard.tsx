"use client";

import Image from "next/image";

type Leader = {
  rank: number | "medal-1" | "medal-2" | "medal-3";
  name: string;
  tier: string;
  materials: number;
  points: string;
  avatar: string;
  isYou?: boolean;
};

const leaders: Leader[] = [
  { rank: "medal-1", name: "Olasunkanmi Abdul Molik", tier: "T 32", materials: 200, points: "13,000", avatar: "/images/leaderboard-avatar-1.png" },
  { rank: "medal-2", name: "Marcus Johnson", tier: "T 32", materials: 200, points: "12,500", avatar: "/images/leaderboard-avatar-2.png" },
  { rank: "medal-3", name: "Priya Patel", tier: "T 32", materials: 200, points: "11,000", avatar: "/images/leaderboard-avatar-3.png" },
  { rank: 4, name: "Jordan Lee", tier: "T 32", materials: 200, points: "10,000", avatar: "/images/leaderboard-avatar-4.png" },
  { rank: 12, name: "Akorede Habeebullah (you)", tier: "T 32", materials: 200, points: "12,000", avatar: "/images/avatar-you.png", isYou: true },
];

const medalIcon: Record<string, string> = {
  "medal-1": "/images/medal-gold.svg",
  "medal-2": "/images/medal-silver.svg",
  "medal-3": "/images/medal-bronze.svg",
};

export default function FullLeaderboard() {
  return (
    <div className="border border-[#ececec] bg-[#fbfbfb] rounded-2xl flex flex-col gap-2 lg:gap-4 p-2 lg:p-4">
      {leaders.map((leader) => (
        <div
          key={leader.name}
          className={`rounded-3xl flex items-center justify-between px-3 lg:px-4 py-2 lg:py-2.5 gap-2 ${
            leader.isYou ? "bg-[#edf5ff] border border-[#b2d3ff]" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-2 lg:gap-6 min-w-0">
            {typeof leader.rank === "string" ? (
              <Image src={medalIcon[leader.rank]} alt="" width={20} height={20} className="lg:w-[34px] lg:h-[34px] shrink-0" />
            ) : (
              <p className="font-bold text-lg lg:text-2xl text-[#f60] shrink-0 w-6 lg:w-10">#{leader.rank}</p>
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
                  <div className="hidden lg:flex items-center gap-1">
                    <Image src="/images/points-icon.png" alt="" width={17} height={17} className="opacity-70" />
                    <p className="text-lg text-[#6d6d6d]">{leader.materials} materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p
            className={`font-bold text-sm lg:text-xl shrink-0 ${
              leader.isYou ? "text-[#006dff]" : "text-[#212121]"
            }`}
          >
            {leader.points} pts
          </p>
        </div>
      ))}
    </div>
  );
}