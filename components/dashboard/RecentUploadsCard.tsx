import Image from "next/image";
import { Plus, ArrowRight, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
const columns = ["Document Title", "Courses", "Date", "Status", "Points"];

type Upload = {
  id: number;
  title: string;
  size: string;
  type: string;
  course: string;
  date: string;
  status: "In Review" | "Approved" | "Rejected";
  points: string;
};

const statusStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "In Review": { bg: "bg-[#fef9c2]", text: "text-[#894b00]", icon: <Clock size={12} /> },
  Approved: { bg: "bg-[#dcfce7]", text: "text-[#016630]", icon: <CheckCircle2 size={12} /> },
  Rejected: { bg: "bg-[#ffe2e2]", text: "text-[#9f0712]", icon: <XCircle size={12} /> },
};

export default function RecentUploadsCard({ uploads = [] }: { uploads?: Upload[] }) {
  const isEmpty = uploads.length === 0;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0 mb-6 lg:mb-8">
        <p className="text-xl lg:text-[28px] font-bold text-[#212121]">Recent Uploads</p>
        <div className="flex items-center gap-2 lg:gap-4">
          <button className="bg-[#121720] text-white text-xs lg:text-base flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3.5 rounded-lg">
            <Plus size={14} /> Upload New Document
          </button>
          <button className="bg-[#fcfdfd] border border-[#e5e5e5] text-[#212121] text-xs lg:text-base flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3.5 rounded-lg">
            View all <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden overflow-x-auto">
        <div className="flex items-center bg-[#fcfdfd] border-b border-[#f2f4f7] min-w-[500px] lg:min-w-0">
          {columns.map((col) => (
            <p
              key={col}
              className="flex-1 font-bold text-sm lg:text-lg text-[#212121] tracking-tight px-3 lg:px-6 py-3 lg:py-6 first:pl-4 lg:first:pl-8 whitespace-nowrap"
            >
              {col}
            </p>
          ))}
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-4 lg:gap-6 py-12 lg:py-20 px-4">
            <div className="bg-[#eff6ff] rounded-full size-[80px] lg:size-[120px] flex items-center justify-center">
              <Image src="/images/document-add-icon.svg" alt="" width={60} height={60} className="lg:w-[92px] lg:h-[92px]" />
            </div>
            <div className="flex flex-col items-center gap-2 max-w-[300px] lg:max-w-[400px] text-center">
              <p className="text-lg lg:text-[22px] text-[#212121]">No uploads yet</p>
              <p className="text-sm lg:text-base text-[#9f9f9f]">
                Share your first lecture material and start earning Quant Points. Every upload helps your classmates and rewards you.
              </p>
            </div>
            <Link href="/upload" className="bg-[#121720] text-white text-sm lg:text-base flex items-center gap-2 px-3.5 py-3 lg:py-4 rounded-lg w-full max-w-[304px] justify-center">
              <Plus size={16} /> Upload New Document
            </Link>
          </div>
        ) : (
          <div className="min-w-[700px] lg:min-w-0">
            {uploads.map((upload) => {
              const style = statusStyles[upload.status];
              return (
                <div key={upload.id} className="flex items-center border-b border-[#f2f4f7] last:border-b-0">
                  <div className="flex-1 flex items-center gap-3 lg:gap-4 px-4 lg:px-8 py-4 lg:py-8">
                    <Image
                      src={upload.type === "doc" ? "/images/file-icon-word.png" : "/images/file-icon-pdf.png"}
                      alt=""
                      width={28}
                      height={28}
                    />
                    <div>
                      <p className="text-sm lg:text-base text-[#212121]">{upload.title}</p>
                      <p className="text-xs text-[#909dad]">{upload.size}</p>
                    </div>
                  </div>
                  <p className="flex-1 text-sm lg:text-base text-[#101828] px-3 lg:px-6">{upload.course}</p>
                  <div className="flex-1 flex items-center gap-1.5 px-3 lg:px-6 text-sm text-[#4a5565]">
                    <Calendar size={14} /> {upload.date}
                  </div>
                  <div className="flex-1 px-3 lg:px-6">
                    <div className={`${style.bg} ${style.text} flex items-center gap-1 px-2.5 py-1 rounded-full w-fit text-xs`}>
                      {style.icon} {upload.status}
                    </div>
                  </div>
                  <p className="flex-1 text-sm lg:text-base text-[#101828] px-3 lg:px-6">{upload.points}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}