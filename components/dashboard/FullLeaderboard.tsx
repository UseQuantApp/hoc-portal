'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderLeaderboard } from '@/lib/dashboard-data';
import { ArrowLeft } from 'lucide-react';

export default function FullLeaderboard() {
  const [department, setDepartment] = useState('All Departments');
  const [level, setLevel] = useState('All Levels');

  return (
    <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 shadow-xs flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2f4f7] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="size-9 rounded-xl bg-[#fbfbfb] border border-[#f2f4f7] hover:bg-[#f4f4f4] flex items-center justify-center text-[#212121] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="font-bold text-xl text-[#212121]">Campus Leaderboard Hall of Fame</h2>
            <p className="text-xs text-[#21212180]">Recognizing outstanding peer study note contributors</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-[#fbfbfb] border border-[#f4f4f4] rounded-xl px-3 py-2 text-xs font-bold text-[#212121] outline-none cursor-pointer"
          >
            <option>All Departments</option>
            <option>Mechanical Engineering</option>
            <option>Electrical Engineering</option>
            <option>Computer Science</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="bg-[#fbfbfb] border border-[#f4f4f4] rounded-xl px-3 py-2 text-xs font-bold text-[#212121] outline-none cursor-pointer"
          >
            <option>All Levels</option>
            <option>100 Level</option>
            <option>200 Level</option>
            <option>300 Level</option>
            <option>400 Level</option>
            <option>500 Level</option>
          </select>
        </div>
      </div>

      <div className="border border-[#f2f4f7] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#fbfbfb] border-b border-[#f2f4f7] font-bold text-[#21212180] uppercase tracking-wider">
              <th className="py-3.5 px-4 w-14 text-center">Rank</th>
              <th className="py-3.5 px-4">Scholar Name</th>
              <th className="py-3.5 px-4">Department & Level</th>
              <th className="py-3.5 px-4 text-center">Materials</th>
              <th className="py-3.5 px-4 text-right">Points Earned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f7]">
            {placeholderLeaderboard.map((entry, idx) => {
              const rank = entry.rank || idx + 1;
              const medalSrc =
                rank === 1
                  ? '/images/medal-gold.svg'
                  : rank === 2
                  ? '/images/medal-silver.svg'
                  : rank === 3
                  ? '/images/medal-bronze.svg'
                  : null;

              return (
                <tr
                  key={idx}
                  className={`hover:bg-[#fbfbfb] transition-colors ${
                    entry.isYou ? 'bg-[#eff7ff]/70 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    {medalSrc ? (
                      <div className="relative size-6 mx-auto">
                        <Image
                          src={medalSrc}
                          alt={`Rank ${rank}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-[#21212180]">#{rank}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="relative size-7 rounded-full overflow-hidden bg-[#e5e5e5] shrink-0 border border-[#f2f4f7]">
                        <Image
                          src={entry.avatar || '/images/avatar-user.png'}
                          alt={entry.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-[#212121]">{entry.name}</span>
                      {entry.isYou && (
                        <span className="bg-[#006dff] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                          YOU
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#21212180]">Mechanical Engineering · 400L</td>
                  <td className="py-3 px-4 text-center font-bold text-[#212121]">{entry.materials}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#006dff]">{entry.points} pts</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
