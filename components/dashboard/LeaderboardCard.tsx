'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderLeaderboard } from '@/lib/dashboard-data';
import { Trophy, ArrowRight } from 'lucide-react';

export interface Leader {
  name: string;
  tier: string;
  materials: number;
  points: string;
  medal?: string | null;
  rank?: number;
  avatar?: string;
  isYou?: boolean;
}

interface LeaderboardCardProps {
  leaders?: Leader[];
  me?: { rank: number; points: number } | null;
  showFullLink?: boolean;
}

export default function LeaderboardCard({
  leaders = placeholderLeaderboard,
  me,
  showFullLink = true,
}: LeaderboardCardProps) {
  const displayLeaders = leaders.length > 0 ? leaders : placeholderLeaderboard;

  return (
    <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-[#eff7ff] text-[#006dff] flex items-center justify-center">
            <Trophy size={18} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#212121]">Campus Leaderboard</h3>
            <p className="text-xs text-[#21212180]">Top academic contributors</p>
          </div>
        </div>

        {showFullLink && (
          <Link
            href="/dashboard?view=leaderboard"
            className="text-xs font-bold text-[#006dff] hover:underline flex items-center gap-1"
          >
            <span>Full Board</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      <div className="divide-y divide-[#f2f4f7] flex flex-col">
        {displayLeaders.slice(0, 5).map((entry, index) => {
          const rank = entry.rank || index + 1;
          const medalSrc =
            rank === 1
              ? '/images/medal-gold.svg'
              : rank === 2
              ? '/images/medal-silver.svg'
              : rank === 3
              ? '/images/medal-bronze.svg'
              : null;

          return (
            <div
              key={index}
              className={`py-3 flex items-center justify-between gap-3 ${
                entry.isYou ? 'bg-[#eff7ff]/60 -mx-3 px-3 rounded-xl' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Rank / Medal */}
                <div className="size-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs">
                  {medalSrc ? (
                    <div className="relative size-6 shrink-0">
                      <Image
                        src={medalSrc}
                        alt={`Rank ${rank}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-[#21212180] font-bold">#{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="relative size-8 rounded-full overflow-hidden bg-[#e5e5e5] shrink-0 border border-[#f2f4f7]">
                  <Image
                    src={entry.avatar || '/images/avatar-user.png'}
                    alt={entry.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className={`text-xs font-bold truncate ${
                        entry.isYou ? 'text-[#006dff]' : 'text-[#212121]'
                      }`}
                    >
                      {entry.name}
                    </span>
                    {entry.isYou && (
                      <span className="bg-[#006dff] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#21212180]">
                    {entry.tier} · {entry.materials} materials
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-xs text-[#006dff]">
                  {entry.points}
                </span>
                <span className="text-[10px] text-[#21212180] block">pts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
