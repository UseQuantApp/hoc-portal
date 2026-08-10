import Image from "next/image";
import { Calendar, Clock, CheckCircle2, XCircle, ExternalLink, Pencil } from "lucide-react";

const columns = ["Document Title", "Courses", "Date", "Status", "Points"];

const fileIcons: Record<string, string> = {
  doc: "/images/file-icon-word.png",
  pdf: "/images/file-icon-pdf.png",
  pptx: "/images/file-icon-pptx.png",
};

const statusStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "In Review": { bg: "bg-[#fef9c2] dark:bg-[#3a3410]", text: "text-[#894b00] dark:text-[#f5c518]", icon: <Clock size={12} /> },
  Approved: { bg: "bg-[#dcfce7] dark:bg-[#0f3320]", text: "text-[#016630] dark:text-[#4ade80]", icon: <CheckCircle2 size={12} /> },
  Rejected: { bg: "bg-[#ffe2e2] dark:bg-[#3a1414]", text: "text-[#9f0712] dark:text-[#f87171]", icon: <XCircle size={12} /> },
};

type Upload = {
  id: number;
  title: string;
  size: string;
  type: "doc" | "pdf" | "pptx";
  course: string;
  date: string;
  status: "In Review" | "Approved" | "Rejected";
  points: string;
};

export default function FullUploadsTable({ uploads }: { uploads: Upload[] }) {
  return (
    <div className="bg-white dark:bg-[#1a1d24] border border-[#f2f4f7] dark:border-[#2a2e37] rounded-2xl overflow-hidden overflow-x-auto">
      <div className="flex items-center bg-[#fcfdfd] dark:bg-[#15171d] border-b border-[#f2f4f7] dark:border-[#2a2e37] min-w-[750px]">
        {columns.map((col) => (
          <p
            key={col}
            className="flex-1 font-bold text-lg text-[#212121] dark:text-white tracking-tight px-6 py-6 first:pl-8 whitespace-nowrap"
          >
            {col}
          </p>
        ))}
        <p className="w-[140px] shrink-0" />
      </div>

      <div className="min-w-[750px]">
        {uploads.map((upload) => {
          const style = statusStyles[upload.status];
          return (
            <div key={upload.id} className="flex items-center border-b border-[#f2f4f7] dark:border-[#2a2e37] last:border-b-0">
              <div className="flex-1 flex items-center gap-4 px-8 py-8">
                <Image src={fileIcons[upload.type]} alt="" width={28} height={28} />
                <div>
                  <p className="text-base text-[#212121] dark:text-white">{upload.title}</p>
                  <p className="text-xs text-[#909dad]">{upload.size}</p>
                </div>
              </div>
              <p className="flex-1 text-base text-[#101828] dark:text-[#d5d8dd] px-6">{upload.course}</p>
              <div className="flex-1 flex items-center gap-1.5 px-6 text-sm text-[#4a5565] dark:text-[#d5d8dd]">
                <Calendar size={14} /> {upload.date}
              </div>
              <div className="flex-1 px-6">
                <div className={`${style.bg} ${style.text} flex items-center gap-1 px-2.5 py-1 rounded-full w-fit text-xs`}>
                  {style.icon} {upload.status}
                </div>
              </div>
              <p className="flex-1 text-base text-[#101828] dark:text-[#d5d8dd] px-6">{upload.points}</p>
              <div className="w-[140px] shrink-0 flex items-center justify-center gap-6">
                <button className="text-[#212121] dark:text-[#c5c8cf] hover:text-[#006dff]">
                  <ExternalLink size={20} />
                </button>
                <button className="text-[#006dff]">
                  <Pencil size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}