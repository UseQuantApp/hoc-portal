import type { Leader } from "@/components/dashboard/LeaderboardCard";

export type LeaderboardEntry = { rank: number; fullName: string; points: number; materialsUploaded: number };
export type LeaderboardMe = { rank: number; points: number } | null | undefined;

// GET /leaderboard only identifies you through `me.rank`, and tied students (e.g. several
// on 0 pts) can make that rank point at someone else's row — which put one student's photo
// on another's entry. Match on your name instead; fall back to rank only when points agree.
export function isOwnEntry(entry: LeaderboardEntry, me: LeaderboardMe, myName: string) {
  if (myName.trim()) return entry.fullName.trim().toLowerCase() === myName.trim().toLowerCase();
  return !!me && me.rank === entry.rank && me.points === entry.points;
}

// Entries carry no photo field, so only your own row can show a real photo.
export function toLeaders(entries: LeaderboardEntry[], me: LeaderboardMe, myName: string, myPhotoUrl: string | null): Leader[] {
  return [...entries]
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => {
      const isYou = isOwnEntry(entry, me, myName);
      return {
        name: entry.fullName,
        tier: `#${entry.rank}`,
        materials: entry.materialsUploaded,
        points: entry.points.toLocaleString(),
        medal: entry.rank <= 3 ? `/images/medal-${entry.rank === 1 ? "gold" : entry.rank === 2 ? "silver" : "bronze"}.svg` : null,
        rank: entry.rank,
        avatar: isYou ? myPhotoUrl : null,
        isYou,
      };
    });
}
