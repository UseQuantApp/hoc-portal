"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/dashboard/Navbar";
import PointsProgressCard from "@/components/dashboard/PointsProgressCardNew";
import RecentUploadsCard from "@/components/dashboard/RecentUploadsCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import RecentWinsCard, { type PointsTransaction } from "@/components/dashboard/RecentWinsCard";
import type { Leader } from "@/components/dashboard/LeaderboardCard";

type PointsSummary = { points: number; tokens: number; lifetimePointsEarned: number; uploadStreakDays: number };
export default function DashboardPage() {
  const [fullName, setFullName] = useState("");
  const [points, setPoints] = useState<PointsSummary>({ points: 0, tokens: 0, lifetimePointsEarned: 0, uploadStreakDays: 0 });
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leaderboardMe, setLeaderboardMe] = useState<{ rank: number; points: number } | null>(null);

  useEffect(() => {
  async function loadUser() {
    try {
      const res = await apiFetch("/students/me");
      console.log("Dashboard fetched user:", res.data);
      setFullName(res.data.fullName || "");
    } catch (err) {
      console.error("Failed to load user for dashboard:", err);
    }
  }
  loadUser();
}, []);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [pointsResponse, historyResponse, leaderboardResponse] = await Promise.all([
          apiFetch("/points/mine"),
          apiFetch("/points/mine/history"),
          apiFetch("/leaderboard?limit=20"),
        ]);
        const summary = pointsResponse.data ?? pointsResponse;
        setPoints(summary);
        setHistory(historyResponse.data ?? historyResponse);
        const leaderboard = leaderboardResponse.data ?? leaderboardResponse;
        setLeaderboardMe(leaderboard.me);
        setLeaders((leaderboard.entries ?? []).map((entry: { rank: number; fullName: string; points: number; materialsUploaded: number }) => ({
          name: entry.fullName,
          tier: `#${entry.rank}`,
          materials: entry.materialsUploaded,
          points: entry.points.toLocaleString(),
          medal: entry.rank <= 3 ? `/images/medal-${entry.rank === 1 ? "gold" : entry.rank === 2 ? "silver" : "bronze"}.svg` : null,
          rank: entry.rank,
          avatar: "/images/avatar-user.png",
          isYou: leaderboard.me?.rank === entry.rank,
        })));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-8 px-4 md:px-16 py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex items-center gap-4">
        <div className="bg-white flex-1 rounded-xl p-3 lg:p-4 flex items-center gap-2.5">
          <input
            placeholder="Search materials, courses..."
            className="w-full text-sm lg:text-lg text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
          />
        </div>
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-10">
        <PointsProgressCard pointsEarned={points.points} ringValue={points.lifetimePointsEarned.toLocaleString()} tokens={points.tokens} uploadStreakDays={points.uploadStreakDays} fullName={fullName} />
        <section className="bg-white border border-[#f2f4f7] rounded-2xl p-5">
          <p className="font-bold text-lg text-[#212121]">Points History</p>
          <div className="mt-3 divide-y divide-[#f2f4f7]">
            {history.length === 0 ? <p className="py-3 text-sm text-[#9f9f9f]">No points transactions yet.</p> : history.slice(0, 7).map((item, index) => (
              <div key={`${item.createdAt}-${index}`} className="flex items-center justify-between gap-4 py-3">
                <div><p className="text-sm text-[#212121]">{item.description}</p><p className="text-xs text-[#9f9f9f]">{new Date(item.createdAt).toLocaleDateString()}</p></div>
                <p className={`text-sm font-bold ${item.amount < 0 ? "text-[#ff3b3b]" : "text-[#00b368]"}`}>
                  {item.amount > 0 ? "+" : ""}{item.amount} pts
                </p>
              </div>
            ))}
          </div>
          {history.length > 7 && (
            <Link href="/account?tab=activity" className="mt-3 block text-center text-sm font-medium text-[#006dff] hover:underline">
              View all
            </Link>
          )}
        </section>
        <RecentUploadsCard />
        <div className="flex flex-col lg:flex-row gap-6">
          <LeaderboardCard leaders={leaders} me={leaderboardMe} />
          <RecentWinsCard transactions={history} />
        </div>
      </div>
    </main>
  );
}