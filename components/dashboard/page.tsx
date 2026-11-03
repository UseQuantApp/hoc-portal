"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { getCurrentAcademicSession } from "@/lib/academic";
import Navbar from "@/components/dashboard/Navbar";
import PointsProgressCard from "@/components/dashboard/PointsProgressCardNew";
import RecentUploadsCard from "@/components/dashboard/RecentUploadsCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import RecentWinsCard, { type PointsTransaction } from "@/components/dashboard/RecentWinsCard";
import type { Leader } from "@/components/dashboard/LeaderboardCard";
import { dedupeDocuments } from "@/lib/documents";
import { useProfile } from "@/context/ProfileContext";

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
  // NEW: pulls the logged-in user's real photo so their own leaderboard row can show it
  const { photoUrl } = useProfile();
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
        setLeaders((leaderboard.entries ?? []).map((entry: { rank: number; fullName: string; points: number; materialsUploaded: number }) => {
          const isYou = leaderboard.me?.rank === entry.rank;
          return {
            name: entry.fullName,
            tier: `#${entry.rank}`,
            materials: entry.materialsUploaded,
            points: entry.points.toLocaleString(),
            medal: entry.rank <= 3 ? `/images/medal-${entry.rank === 1 ? "gold" : entry.rank === 2 ? "silver" : "bronze"}.svg` : null,
            rank: entry.rank,
            // CHANGED: your own row uses your real photo from context; everyone
            // else falls back to InitialsAvatar since LeaderboardEntry has no photo field
            avatar: isYou ? photoUrl : null,
            isYou,
          };
        }));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    }
    loadDashboardData();
  }, [photoUrl]);

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-8 px-4 md:px-16 py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-10">
        <PointsProgressCard
          totalUploaded={totalUploaded}
          pointsEarned={points.points}
          fullName={fullName}
          badges={badges}
        />
        <RecentUploadsCard />
        <div className="flex flex-col lg:flex-row gap-6">
          <LeaderboardCard leaders={leaders} me={leaderboardMe} />
          <RecentWinsCard transactions={history} />
        </div>
      </div>
    </main>
  );
}