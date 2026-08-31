'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Navbar from '@/components/dashboard/Navbar';
import PointsProgressCardNew from '@/components/dashboard/PointsProgressCardNew';
import RecentUploadsCard from '@/components/dashboard/RecentUploadsCard';
import LeaderboardCard, { type Leader } from '@/components/dashboard/LeaderboardCard';
import RecentWinsCard from '@/components/dashboard/RecentWinsCard';
import FullLeaderboard from '@/components/dashboard/FullLeaderboard';
import FullUploadsTable from '@/components/dashboard/FullUploadsTable';
import { placeholderWins } from '@/lib/dashboard-data';
import { Search, Sparkles, ChevronDown, Check } from 'lucide-react';

type PointsSummary = {
  points: number;
  tokens: number;
  lifetimePointsEarned: number;
  uploadStreakDays: number;
};

type PointsTransaction = {
  type: string;
  amount: number;
  description: string;
  createdAt: string;
};

function DashboardMainContent() {
  const searchParams = useSearchParams();
  const view = searchParams?.get('view');

  const [fullName, setFullName] = useState<string>('');
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  const [selectedLevel, setSelectedLevel] = useState<string>('All Levels');
  const [selectedSemester, setSelectedSemester] = useState<string>('All Semesters');
  const [isLevelOpen, setIsLevelOpen] = useState<boolean>(false);
  const [isSemesterOpen, setIsSemesterOpen] = useState<boolean>(false);

  const levelRef = React.useRef<HTMLDivElement>(null);
  const semesterRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (levelRef.current && !levelRef.current.contains(event.target as Node)) {
        setIsLevelOpen(false);
      }
      if (semesterRef.current && !semesterRef.current.contains(event.target as Node)) {
        setIsSemesterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [points, setPoints] = useState<PointsSummary>({
    points: 0,
    tokens: 0,
    lifetimePointsEarned: 0,
    uploadStreakDays: 0,
  });

  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leaderboardMe, setLeaderboardMe] = useState<{ rank: number; points: number } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await apiFetch('/students/me');
        if (res?.data?.fullName) {
          setFullName(res.data.fullName);
        }
      } catch (err) {
        console.error('Failed to load user for dashboard:', err);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [pointsResponse, historyResponse, leaderboardResponse] = await Promise.all([
          apiFetch('/points/mine').catch(() => null),
          apiFetch('/points/mine/history').catch(() => null),
          apiFetch('/leaderboard?limit=20').catch(() => null),
        ]);

        if (pointsResponse) {
          const summary = pointsResponse.data ?? pointsResponse;
          setPoints({
            points: summary.points ?? 0,
            tokens: summary.tokens ?? 0,
            lifetimePointsEarned: summary.lifetimePointsEarned ?? 0,
            uploadStreakDays: summary.uploadStreakDays ?? 0,
          });
        }

        if (historyResponse) {
          const hist = historyResponse.data ?? historyResponse;
          if (Array.isArray(hist)) {
            setHistory(hist);
          }
        }

        if (leaderboardResponse) {
          const leaderboard = leaderboardResponse.data ?? leaderboardResponse;
          setLeaderboardMe(leaderboard.me ?? null);

          if (Array.isArray(leaderboard.entries)) {
            setLeaders(
              leaderboard.entries.map(
                (entry: {
                  rank: number;
                  fullName: string;
                  points: number;
                  materialsUploaded: number;
                }) => ({
                  name: entry.fullName,
                  tier: `#${entry.rank}`,
                  materials: entry.materialsUploaded ?? 0,
                  points: entry.points ? entry.points.toLocaleString() : '0',
                  medal:
                    entry.rank <= 3
                      ? `/images/medal-${
                          entry.rank === 1
                            ? 'gold'
                            : entry.rank === 2
                            ? 'silver'
                            : 'bronze'
                        }.svg`
                      : null,
                  rank: entry.rank,
                  avatar: '/images/avatar-user.png',
                  isYou: leaderboard.me?.rank === entry.rank,
                })
              )
            );
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }

    loadDashboardData();
  }, []);

  if (view === 'leaderboard') {
    return (
      <div className="w-full max-w-[1312px] flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="Campus Leaderboard" />
        <FullLeaderboard />
      </div>
    );
  }

  if (view === 'uploads') {
    return (
      <div className="w-full max-w-[1312px] flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="All Uploads" />
        <FullUploadsTable />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1312px] flex flex-col gap-8">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Welcome Section */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#212121] tracking-tight">
            {isLoadingUser ? (
              <span className="inline-flex items-center gap-2">
                <span>Welcome back,</span>
                <span className="inline-block w-40 h-8 bg-[#f4f4f4] rounded-lg animate-pulse" />
                <span>👋</span>
              </span>
            ) : (
              `Welcome back, ${fullName || 'Scholar'} 👋`
            )}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[#21212180]">
          Here&apos;s what&apos;s happening with your Campus Scholar account.
        </p>
      </div>

      {/* 3. Search and Filter Section */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="bg-white border border-[#f2f4f7] flex-1 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-xs">
          <Search size={18} className="text-[#21212180] shrink-0" />
          <input
            placeholder="Search materials, courses..."
            className="w-full text-sm sm:text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Level Dropdown */}
          <div className="relative" ref={levelRef}>
            <button
              type="button"
              onClick={() => {
                setIsLevelOpen((prev) => !prev);
                setIsSemesterOpen(false);
              }}
              className={`bg-white border rounded-2xl px-4 sm:px-5 py-3.5 text-[#212121] text-xs sm:text-sm font-bold shadow-xs hover:bg-[#fbfbfb] transition-colors flex items-center gap-2 cursor-pointer ${
                isLevelOpen ? 'border-[#006dff] ring-2 ring-[#006dff]/10' : 'border-[#f2f4f7]'
              }`}
            >
              <span>{selectedLevel}</span>
              <ChevronDown
                size={16}
                className={`text-[#21212180] transition-transform duration-200 ${isLevelOpen ? 'rotate-180 text-[#006dff]' : ''}`}
              />
            </button>

            {isLevelOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#f2f4f7] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {['All Levels', '100 Level', '200 Level', '300 Level', '400 Level'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setIsLevelOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-[#f8fafc] transition-colors cursor-pointer ${
                      selectedLevel === lvl ? 'text-[#006dff] font-bold bg-[#eff7ff]' : 'text-[#212121]'
                    }`}
                  >
                    <span>{lvl}</span>
                    {selectedLevel === lvl && <Check size={14} className="text-[#006dff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Semester Dropdown */}
          <div className="relative" ref={semesterRef}>
            <button
              type="button"
              onClick={() => {
                setIsSemesterOpen((prev) => !prev);
                setIsLevelOpen(false);
              }}
              className={`bg-white border rounded-2xl px-4 sm:px-5 py-3.5 text-[#212121] text-xs sm:text-sm font-bold shadow-xs hover:bg-[#fbfbfb] transition-colors flex items-center gap-2 cursor-pointer ${
                isSemesterOpen ? 'border-[#006dff] ring-2 ring-[#006dff]/10' : 'border-[#f2f4f7]'
              }`}
            >
              <span>{selectedSemester}</span>
              <ChevronDown
                size={16}
                className={`text-[#21212180] transition-transform duration-200 ${isSemesterOpen ? 'rotate-180 text-[#006dff]' : ''}`}
              />
            </button>

            {isSemesterOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#f2f4f7] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {['All Semesters', '1st Semester', '2nd Semester'].map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => {
                      setSelectedSemester(sem);
                      setIsSemesterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-[#f8fafc] transition-colors cursor-pointer ${
                      selectedSemester === sem ? 'text-[#006dff] font-bold bg-[#eff7ff]' : 'text-[#212121]'
                    }`}
                  >
                    <span>{sem}</span>
                    {selectedSemester === sem && <Check size={14} className="text-[#006dff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Points & Rewards Summary Card */}
      <PointsProgressCardNew
        pointsEarned={points.points}
        ringValue={points.lifetimePointsEarned > 0 ? points.lifetimePointsEarned.toLocaleString() : undefined}
        tokens={points.tokens}
        uploadStreakDays={points.uploadStreakDays}
        fullName={fullName}
      />

      {/* 5. Points History */}
      <section className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-[#212121]">
              Points History
            </h2>
            <p className="text-xs text-[#21212180]">
              Recent reward activity and bonus distributions
            </p>
          </div>
          <span className="text-xs font-bold text-[#006dff] bg-[#eff7ff] px-3 py-1 rounded-full">
            {history.length} {history.length === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>

        <div className="divide-y divide-[#f2f4f7]">
          {history.length === 0 ? (
            <div className="py-6 text-center text-sm text-[#21212180]">
              No points transactions recorded yet. Upload notes to start earning!
            </div>
          ) : (
            history.slice(0, 8).map((item, index) => (
              <div
                key={`${item.createdAt}-${index}`}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold text-[#212121]">
                    {item.description}
                  </p>
                  <p className="text-xs text-[#21212180]">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <p className={`text-sm font-bold ${item.amount >= 0 ? 'text-[#00b368]' : 'text-[#ef4444]'}`}>
                  {item.amount > 0 ? '+' : ''}
                  {item.amount} pts
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. Recent Uploads */}
      <RecentUploadsCard />

      {/* 7. Leaderboard & Recent Wins Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeaderboardCard
          leaders={leaders}
          me={leaderboardMe}
        />

        <RecentWinsCard
          wins={placeholderWins}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white text-[#212121] flex flex-col items-center px-4 md:px-12 lg:px-16 py-6 lg:py-8">
      <Suspense
        fallback={
          <div className="w-full max-w-[1312px] p-8 text-center text-sm text-[#21212180]">
            Loading Scholar Portal...
          </div>
        }
      >
        <DashboardMainContent />
      </Suspense>
    </main>
  );
}
