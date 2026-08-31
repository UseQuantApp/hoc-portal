'use client';

import React from 'react';
import Navbar from './Navbar';
import PointsProgressCardNew from './PointsProgressCardNew';
import LeaderboardCard from './LeaderboardCard';
import RecentWinsCard from './RecentWinsCard';
import RecentUploadsCard from './RecentUploadsCard';

export default function DashboardComponent() {
  return (
    <div className="w-full max-w-[1240px] px-4 sm:px-6 py-4 flex flex-col gap-6">
      <Navbar />

      {/* Points & Progress (Horizontal on Desktop) */}
      <PointsProgressCardNew />

      {/* Main Grid: Recent Uploads (2 Cols) + Leaderboard & Wins (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentUploadsCard />
        </div>
        <div className="flex flex-col gap-6">
          <LeaderboardCard />
          <RecentWinsCard />
        </div>
      </div>
    </div>
  );
}
