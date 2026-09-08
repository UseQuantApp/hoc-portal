import Image from "next/image";

type Win = { id: string; text: string; time: string; icon: 1 | 2 };

export type PointsTransaction = {
  id?: string | number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
};

function formatRelativeTime(createdAt: string) {
  const elapsedSeconds = (new Date(createdAt).getTime() - Date.now()) / 1000;
  const units = [
    { limit: 60, value: 1, unit: "second" as const },
    { limit: 3600, value: 60, unit: "minute" as const },
    { limit: 86400, value: 3600, unit: "hour" as const },
    { limit: 604800, value: 86400, unit: "day" as const },
    { limit: 2592000, value: 604800, unit: "week" as const },
    { limit: 31536000, value: 2592000, unit: "month" as const },
    { limit: Infinity, value: 31536000, unit: "year" as const },
  ];
  const unit = units.find(({ limit }) => Math.abs(elapsedSeconds) < limit) ?? units[units.length - 1];

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round(elapsedSeconds / unit.value),
    unit.unit,
  );
}

export default function RecentWinsCard({ transactions = [] }: { transactions?: PointsTransaction[] }) {
  const wins: Win[] = transactions.map((transaction, index) => ({
    id: String(transaction.id ?? `${transaction.createdAt}-${index}`),
    text: transaction.description,
    time: formatRelativeTime(transaction.createdAt),
    icon: transaction.type === "reward_redeemed" ? 2 : 1,
  }));
  const isEmpty = wins.length === 0;

  return (
    <div className="border border-[#ececec] bg-[#fbfbfb] rounded-2xl flex flex-col gap-6 lg:gap-10 p-3 lg:p-4 w-full lg:w-[580px]">
      <p className="text-lg lg:text-[28px] font-bold text-[#212121] text-center">Recent Wins</p>

      {isEmpty ? (
        <div className="relative bg-white border border-[#f2f4f7] rounded-xl overflow-hidden">
          <div className="opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-start px-4 lg:px-5 pt-3 lg:pt-4 pb-3 lg:pb-[17px] border-b border-[#f2f4f7]">
                <div className="bg-[#f0f0f0] rounded-full size-8 lg:size-10 shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="bg-[#f0f0f0] h-2 lg:h-2.5 rounded-full w-full" />
                  <div className="bg-[#f0f0f0] h-2 lg:h-2.5 rounded-full w-3/5" />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 lg:gap-3 px-6">
            <div className="bg-[#f4f9ff] rounded-full size-11 lg:size-14 flex items-center justify-center">
              <Image src="/images/points-icon.png" alt="" width={18} height={18} className="lg:w-[24px] lg:h-[24px]" />
            </div>
            <p className="font-bold text-lg lg:text-2xl text-[#212121]">No wins yet</p>
            <p className="text-sm lg:text-base text-[#9f9f9f] text-center max-w-[280px] lg:max-w-[330px]">
              Your points and milestones will appear here as you contribute.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 lg:gap-4">
          {wins.map((win) => (
            <div key={win.id} className="bg-white border border-[#ececec] rounded-3xl flex items-center gap-3 p-3 lg:p-4">
              <div className="relative size-11 lg:size-[58px] shrink-0">
                <Image src="/images/win-badge-bg.svg" alt="" fill />
                <Image
                  src={win.icon === 1 ? "/images/win-icon-1.png" : "/images/win-icon-2.png"}
                  alt=""
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <p className="text-sm lg:text-lg text-[#212121]">{win.text}</p>
                <p className="text-xs lg:text-base text-[#6d6d6d]">{win.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}