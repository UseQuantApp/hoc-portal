"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import FullLeaderboard from "@/components/dashboard/FullLeaderboard";
import type { Leader } from "@/components/dashboard/LeaderboardCard";
import { apiFetch } from "@/lib/api";

type LeaderboardEntry = {
  rank: number;
  fullName: string;
  points: number;
  materialsUploaded: number;
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await apiFetch("/leaderboard?limit=20");
        const leaderboard = response.data ?? response;
        const mappedLeaders = (leaderboard.entries ?? []).map((entry: LeaderboardEntry) => ({
          name: entry.fullName,
          tier: `#${entry.rank}`,
          materials: entry.materialsUploaded,
          points: entry.points.toLocaleString(),
          medal: entry.rank <= 3 ? `/images/medal-${entry.rank === 1 ? "gold" : entry.rank === 2 ? "silver" : "bronze"}.svg` : null,
          rank: entry.rank,
          avatar: "/images/avatar-user.png",
          isYou: leaderboard.me?.rank === entry.rank,
        } satisfies Leader));

        if (leaderboard.me && !mappedLeaders.some((leader: Leader) => leader.isYou)) {
          mappedLeaders.push({
            name: "You",
            tier: `#${leaderboard.me.rank}`,
            materials: 0,
            points: Number(leaderboard.me.points ?? 0).toLocaleString(),
            medal: null,
            rank: leaderboard.me.rank,
            avatar: "/images/avatar-user.png",
            isYou: true,
          });
        }

        setLeaders(mappedLeaders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard.");
      } finally {
        setIsLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>
      <div className="w-full max-w-[1312px] flex flex-col gap-6">
        <h1 className="text-xl lg:text-[28px] font-bold text-[#212121]">Top Contributors Leaderboard</h1>
        {isLoading ? (
          <div className="bg-white border border-[#f2f4f7] rounded-2xl py-20 text-center text-[#9f9f9f]">Loading leaderboard...</div>
        ) : error ? (
          <div className="bg-white border border-[#f2f4f7] rounded-2xl py-20 text-center text-[#ff3b3b]">{error}</div>
        ) : leaders.length === 0 ? (
          <div className="bg-white border border-[#f2f4f7] rounded-2xl py-20 text-center text-[#9f9f9f]">No leaderboard data yet.</div>
        ) : (
          <FullLeaderboard leaders={leaders} />
        )}
      </div>
    </main>
  );
}