'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderProgress } from '@/lib/dashboard-data';
import { Upload, Flame, Coins, Award } from 'lucide-react';

interface PointsProgressProps {
  pointsEarned?: number;
  points?: number;
  totalUploaded?: number;
  pointsAway?: number;
  ringValue?: string;
  tokens?: number;
  uploadStreakDays?: number;
  fullName?: string;
  weeks?: Array<{ label: string; points: number; active: boolean }>;
}

export default function PointsProgressCardNew({
  pointsEarned,
  points,
  totalUploaded = placeholderProgress.totalUploaded,
  pointsAway = placeholderProgress.pointsAway,
  ringValue,
  tokens = 0,
  uploadStreakDays = 0,
  fullName,
  weeks = placeholderProgress.weeks,
}: PointsProgressProps) {
  const currentPoints = pointsEarned ?? points ?? placeholderProgress.pointsEarned;
  const currentRingValue = ringValue ?? (currentPoints > 0 ? (currentPoints + 1000).toLocaleString() : placeholderProgress.ringValue);

  return (
    <div className="w-full bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 shadow-xs flex flex-col gap-6">
      {/* Top Bar: Title & Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 bg-[#eff7ff] text-[#006dff] text-xs font-bold px-3 py-1 rounded-full self-start">
            <Award size={14} />
            <span>Scholar Tier Milestone & Rewards</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#212121] tracking-tight">
            Academic Points & Progress
          </h2>
        </div>

        <Link
          href="/upload"
          className="inline-flex items-center justify-center gap-2 bg-[#f60] hover:bg-[#e55600] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload size={16} />
          <span>Upload Material (+50 pts)</span>
        </Link>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Col 1: Points & Token Stats */}
        <div className="flex flex-col gap-3.5 p-5 bg-[#fbfbfb] rounded-2xl border border-[#f2f4f7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#21212180] uppercase tracking-wider">
              Quant Points Balance
            </span>
            <div className="relative size-5">
              <Image
                src="/images/points-icon.png"
                alt="Points"
                fill
                className="object-contain"
                onError={(e) => {
                  // graceful fallback if not present
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-[#006dff]">
              {currentPoints.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-[#21212180]">pts</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f2f4f7]">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#21212180] flex items-center gap-1">
                <Coins size={12} className="text-[#f60]" />
                Tokens
              </span>
              <span className="text-sm font-bold text-[#212121]">
                {tokens.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-[#21212180] flex items-center gap-1">
                <Flame size={12} className="text-[#f60]" />
                Streak
              </span>
              <span className="text-sm font-bold text-[#212121]">
                {uploadStreakDays} {uploadStreakDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>
        </div>

        {/* Col 2: Progress Ring Gauge */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative size-32 sm:size-36 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#f4f4f4"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#006dff"
                strokeWidth="8"
                strokeDasharray="314.16"
                strokeDashoffset="78.54"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold text-[#21212180]">Target</span>
              <span className="text-xl sm:text-2xl font-bold text-[#212121]">{currentRingValue}</span>
              <span className="text-[10px] font-bold text-[#00b368]">Active Tier</span>
            </div>
          </div>
        </div>

        {/* Col 3: Weekly Tier Ladder */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[#21212180] uppercase tracking-wider">
            Tier Milestone Roadmap
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-1">
            {weeks.map((w, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                  w.active
                    ? 'bg-[#eff7ff] border-[#006dff]/30 text-[#006dff] font-bold shadow-2xs'
                    : 'bg-[#fbfbfb] border-[#f2f4f7] text-[#21212180]'
                }`}
              >
                <span className="text-xs">{w.label}</span>
                <span className="text-[9px] mt-0.5 opacity-90">{(w.points / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#21212180] mt-1 leading-relaxed">
            Maintain consistent uploads to unlock departmental scholarship rewards and badges.
          </p>
        </div>
      </div>
    </div>
  );
}
