import Navbar from "@/components/dashboard/Navbar";
import RecoveryBanner from "@/components/dashboard/RecoveryBanner";
import PointsProgressCard from "@/components/dashboard/PointsProgressCardNew";
import RecentUploadsCard from "@/components/dashboard/RecentUploadsCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import RecentWinsCard from "@/components/dashboard/RecentWinsCard";
import {
  placeholderUploads,
  placeholderWins,
  placeholderProgress,
  placeholderLeaderboard,
} from "@/lib/dashboard-data";

export default function DashboardPage() {
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
        <button className="hidden lg:block bg-white rounded-xl px-5 py-4 text-[#212121] text-xl shrink-0">All levels</button>
        <button className="hidden lg:block bg-white rounded-xl px-5 py-4 text-[#212121] text-xl shrink-0">All Semester</button>
      </div>

      <div className="w-full max-w-[1312px]">
        <RecoveryBanner />
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-10">
        <PointsProgressCard {...placeholderProgress} />
        <RecentUploadsCard uploads={placeholderUploads} />
        <div className="flex flex-col lg:flex-row gap-6">
          <LeaderboardCard leaders={placeholderLeaderboard} />
          <RecentWinsCard wins={placeholderWins} />
        </div>
      </div>
    </main>
  );
}