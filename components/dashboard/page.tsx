"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getCurrentAcademicSession } from "@/lib/academic";
import Navbar from "@/components/dashboard/Navbar";
import PointsProgressCard from "@/components/dashboard/PointsProgressCardNew";
import RecentUploadsCard from "@/components/dashboard/RecentUploadsCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import RecentWinsCard, { type PointsTransaction } from "@/components/dashboard/RecentWinsCard";
import type { Leader } from "@/components/dashboard/LeaderboardCard";
import { dedupeDocuments } from "@/lib/documents";

type PointsSummary = { points: number; tokens: number; lifetimePointsEarned: number; uploadStreakDays: number };

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

export default function DashboardPage() {
  const [fullName, setFullName] = useState("");
  const [points, setPoints] = useState<PointsSummary>({ points: 0, tokens: 0, lifetimePointsEarned: 0, uploadStreakDays: 0 });
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leaderboardMe, setLeaderboardMe] = useState<{ rank: number; points: number } | null>(null);
  const [totalUploaded, setTotalUploaded] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);

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
        const session = getCurrentAcademicSession();
        const [pointsResponse, historyResponse, leaderboardResponse, firstDocsResponse, secondDocsResponse, badgesResponse] = await Promise.all([
          apiFetch("/points/mine"),
          apiFetch("/points/mine/history"),
          apiFetch("/leaderboard?limit=20"),
          apiFetch(`/documents/mine?session=${session}&semester=first`),
          apiFetch(`/documents/mine?session=${session}&semester=second`),
          apiFetch("/badges/mine"),
        ]);
        const summary = pointsResponse.data ?? pointsResponse;
        setPoints(summary);
        setHistory(historyResponse.data ?? historyResponse);

        const allDocs = dedupeDocuments([...(firstDocsResponse.data || []), ...(secondDocsResponse.data || [])]);
        setTotalUploaded(allDocs.length);

        setBadges(badgesResponse.data ?? badgesResponse);

        const leaderboard = leaderboardResponse.data ?? leaderboardResponse;
        setLeaderboardMe(leaderboard.me);
        setLeaders((leaderboard.entries ?? []).map((entry: { rank: number; fullName: string; points: number; materialsUploaded: number }) => ({
          name: entry.fullName,
          tier: `#${entry.rank}`,
          materials: entry.materialsUploaded,
          points: entry.points.toLocaleString(),
          medal: entry.rank <= 3 ? `/images/medal-${entry.rank === 1 ? "gold" : entry.rank === 2 ? "silver" : "bronze"}.svg` : null,
          rank: entry.rank,
          // CHANGED: no photo field exists on LeaderboardEntry yet — null lets
          // LeaderboardCard fall back to each person's InitialsAvatar instead
          // of the old default silhouette image.
          avatar: null,
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

      <div className="w-full max-w-[1312px] flex flex-col gap-10">
        <PointsProgressCard
          totalUploaded={totalUploaded}
          pointsEarned={points.points}
          tokens={points.tokens}
          uploadStreakDays={points.uploadStreakDays}
          fullName={fullName}
          pointsData={points}
          badges={badges}
        />
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