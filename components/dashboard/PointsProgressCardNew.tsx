import Image from "next/image";
import { Lock, AlertTriangle, ArrowRight } from "lucide-react";

type Week = { label: string; points: number; active: boolean };

type PointsProgressCardProps = {
  totalUploaded?: number;
  pointsEarned?: number;
  pointsAway?: number;
  ringValue?: string;
  weeks?: Week[];
};

const defaultWeeks: Week[] = [
  { label: "T1", points: 0, active: true },
  { label: "T2", points: 5500, active: false },
  { label: "T3", points: 8500, active: false },
  { label: "T4", points: 12500, active: false },
  { label: "T5", points: 12500, active: false },
  { label: "T6", points: 12500, active: false },
  { label: "T7", points: 12500, active: false },
];

export default function PointsProgressCard({
  totalUploaded = 0,
  pointsEarned = 0,
  pointsAway = 2500,
  ringValue = "0",
  weeks = defaultWeeks,
}: PointsProgressCardProps) {
  const isEmpty = pointsEarned === 0;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-6 lg:mb-8">
        <div className="flex flex-col gap-1.5 lg:gap-3">
          <p className="text-base lg:text-[28px] text-[#212121]">
            Welcome <span className="font-bold">Akorede!</span> 👋
          </p>
          <p className="text-sm lg:text-lg text-black">
            {isEmpty
              ? "You haven't uploaded anything yet — start sharing and earning today."
              : "Here's what moved while you were away."}
          </p>
        </div>
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 lg:gap-2.5">
          <p className="text-sm lg:text-lg text-black">Total Uploaded Materials</p>
          <div className="flex items-center gap-1.5 lg:gap-2.5">
            <Image src="/images/points-icon.png" alt="" width={16} height={16} className="lg:w-[23px] lg:h-[23px]" />
            <p className="text-lg lg:text-[28px] font-bold text-[#212121]">{totalUploaded}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#f6f6f6] rounded-xl flex items-center gap-4 lg:gap-8 p-3 lg:p-4 h-auto lg:h-[180px] overflow-x-auto">
        <div className="bg-[#eff7ff] border-2 border-[#e6f1ff] rounded-xl flex flex-col gap-2 lg:gap-3 items-center justify-center px-4 lg:px-6 py-2 lg:py-3 h-[110px] lg:h-[153px] w-[150px] lg:w-[220px] shrink-0">
          <p className="text-xs lg:text-base text-black">Points earned</p>
          <div className="flex items-center gap-1">
            <Image src="/images/points-icon-large.png" alt="" width={13} height={13} className="lg:w-[19px] lg:h-[19px]" />
            <p className="text-base lg:text-2xl font-bold text-[#0225b6]">{pointsEarned.toLocaleString()} Points</p>
          </div>
          <button
            className={`bg-[#006dff] text-white text-xs lg:text-base flex items-center gap-1.5 lg:gap-2.5 px-4 lg:px-7 py-1.5 lg:py-2.5 rounded-lg ${
              isEmpty ? "opacity-50" : ""
            }`}
          >
            Redeem
            <ArrowRight size={14} className="lg:hidden" />
            <ArrowRight size={20} className="hidden lg:block" />
          </button>
        </div>

        <div className="relative shrink-0 size-[110px] lg:size-[170px]">
          <Image src="/images/progress-ring.svg" alt="" fill className="object-contain" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <p className="text-xs lg:text-[16px] font-bold text-[#212121]">{ringValue}</p>
            <p className="text-[8px] lg:text-[10px] text-black">Points</p>
            <div className="flex items-center gap-1">
              <AlertTriangle size={9} className="text-[#ffcc14] lg:hidden" />
              <AlertTriangle size={11} className="text-[#ffcc14] hidden lg:block" />
              <p className="text-[8px] lg:text-[10px] font-bold text-[#ffcc14]">{pointsAway.toLocaleString()} points Away</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-l border-[#e5e5e5] pl-4 lg:pl-8 gap-3 lg:gap-0 lg:flex-1">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 lg:gap-2 shrink-0 px-1 lg:px-2">
              <div
                className={`relative size-[26px] lg:size-[34px] rounded-md flex flex-col items-center justify-center border-2 border-white ${
                  week.active ? "bg-[#008551]" : "bg-[#cbcbcb]"
                }`}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white" className="lg:w-[14px] lg:h-[14px]">
                  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 21 12 17.27 5.8 21 7 14.14l-5-4.87 7.1-1.01L12 2z" />
                </svg>
                <span className="absolute bottom-1 lg:bottom-1.5 text-white text-[5px] lg:text-[6px] font-bold">{week.label}</span>
              </div>
              <p className={`text-xs lg:text-base font-bold ${week.active ? "text-[#212121]" : "text-[#9f9f9f]"}`}>
                {week.points.toLocaleString()}
              </p>
              <div className="flex items-center gap-0.5">
                <Lock size={7} className="text-[#9f9f9f]" />
                <p className="text-[8px] lg:text-[10px] text-[#9f9f9f]">Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}