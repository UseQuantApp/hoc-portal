import Navbar from "@/components/dashboard/Navbar";
import FullUploadsTable from "@/components/dashboard/FullUploadsTable";
import { Plus } from "lucide-react";
import { fullUploadsData } from "@/lib/dashboard-data";

export default function UploadsPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] dark:bg-[#0f1115] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex items-center gap-4">
        <div className="bg-white dark:bg-[#1a1d24] flex-1 rounded-xl p-3 lg:p-4 flex items-center gap-2.5">
          <input
            placeholder="Search materials, courses..."
            className="w-full text-sm lg:text-lg text-[#212121] dark:text-white placeholder:text-[#21212180] dark:placeholder:text-[#ffffff60] outline-none bg-transparent"
          />
        </div>
        <button className="hidden lg:block bg-white dark:bg-[#1a1d24] dark:text-white rounded-xl px-5 py-4 text-[#212121] text-xl shrink-0">All levels</button>
        <button className="hidden lg:block bg-white dark:bg-[#1a1d24] dark:text-white rounded-xl px-5 py-4 text-[#212121] text-xl shrink-0">All Semester</button>
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <p className="font-bold text-[#212121] dark:text-white text-[28px]">Total Uploads</p>
            <p className="text-[22px] text-[#212121] dark:text-[#c5c8cf]">{fullUploadsData.length * 3} Documents</p>
          </div>
          <button className="bg-[#121720] flex items-center gap-2 p-3.5 rounded-lg text-white text-base">
            <Plus size={18} /> Upload New Document
          </button>
        </div>

        <FullUploadsTable uploads={fullUploadsData} />
      </div>
    </main>
  );
}