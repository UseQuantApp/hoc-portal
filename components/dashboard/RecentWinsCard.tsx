'use client';

import React from 'react';
import { placeholderWins } from '@/lib/dashboard-data';
import { Award, Clock } from 'lucide-react';

interface WinItem {
  id: number;
  text: string;
  time: string;
  icon?: number;
}

interface RecentWinsProps {
  wins?: WinItem[];
}

export default function RecentWinsCard({ wins = placeholderWins }: RecentWinsProps) {
  const displayWins = wins.length > 0 ? wins : placeholderWins;

  return (
    <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className="size-9 rounded-xl bg-[#fff6f0] text-[#f60] flex items-center justify-center">
          <Award size={18} />
        </div>
        <div>
          <h3 className="font-bold text-base text-[#212121]">Recent Scholar Wins</h3>
          <p className="text-xs text-[#21212180]">Live upload & milestone activity</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {displayWins.slice(0, 4).map((win) => (
          <div
            key={win.id}
            className="p-3 bg-[#fbfbfb] hover:bg-[#f4f4f4] rounded-xl border border-[#f2f4f7] flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="size-2 rounded-full bg-[#f60] shrink-0" />
              <p className="text-xs font-semibold text-[#212121] truncate">{win.text}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#21212180] shrink-0">
              <Clock size={11} />
              <span>{win.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
