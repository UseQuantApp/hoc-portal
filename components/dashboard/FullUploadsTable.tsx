import Image from "next/image";
import { Calendar, Clock, CheckCircle2, XCircle, ExternalLink, Pencil } from "lucide-react";

const columns = ["Document Title", "Courses", "Date", "Status", "Points"];

const fileIcons: Record<string, string> = {
  doc: "/images/file-icon-word.png",
  pdf: "/images/file-icon-pdf.png",
  pptx: "/images/file-icon-pptx.png",
};

const statusStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pending: { bg: "bg-[#fef9c2]", text: "text-[#894b00]", icon: <Clock size={12} /> },
  approved: { bg: "bg-[#dcfce7]", text: "text-[#016630]", icon: <CheckCircle2 size={12} /> },
  rejected: { bg: "bg-[#ffe2e2]", text: "text-[#9f0712]", icon: <XCircle size={12} /> },
  "—": { bg: "bg-[#f3f4f6]", text: "text-[#6b7280]", icon: null },
};

type Upload = {
  id: string;
  title: string;
  fileUrl: string;
  size: string;
  type: string;
  course: string;
  date: string;
  status: string;
  pointsAwarded: number | null;
};

export default function FullUploadsTable({ uploads }: { uploads: Upload[] }) {
  return (
    <div className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden">
      <div className="lg:hidden divide-y divide-[#f2f4f7]">
        {uploads.map((upload) => {
          const statusKey = String(upload.status ?? "pending").toLowerCase();
          const style = statusStyles[statusKey] || statusStyles["—"];
          const pointsText = upload.pointsAwarded == null ? "—" : `${upload.pointsAwarded} pts`;

          return (
            <div key={upload.id} className="p-4">
              <div className="flex items-start gap-3">
                <Image src={fileIcons[upload.type]} alt="" width={28} height={28} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#212121]">{upload.title}</p>
                  <p className="mt-1 text-xs text-[#909dad]">{upload.course} · {upload.size}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#4a5565]">
                    <span>{upload.date}</span>
                    <span className={`${style.bg} ${style.text} flex items-center gap-1 rounded-full px-2 py-1`}>
                      {style.icon} {statusKey === "pending" ? "Pending" : statusKey === "approved" ? "Approved" : statusKey === "rejected" ? "Rejected" : upload.status}
                    </span>
                    <span>{pointsText}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3">
                  <button type="button" aria-label={`Open ${upload.title}`} className="text-[#212121]" onClick={() => window.open(upload.fileUrl, "_blank", "noopener,noreferrer")}>
                    <ExternalLink size={18} />
                  </button>
                  <button type="button" aria-label={`Edit ${upload.title}`} className="text-[#006dff]"><Pencil size={18} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block overflow-x-auto">
      <div className="flex items-center bg-[#fcfdfd] border-b border-[#f2f4f7] min-w-[750px]">
        {columns.map((col) => (
          <p
            key={col}
            className="flex-1 font-bold text-lg text-[#212121] tracking-tight px-6 py-6 first:pl-8 whitespace-nowrap"
          >
            {col}
          </p>
        ))}
        <p className="w-[140px] shrink-0" />
      </div>

      <div className="min-w-[750px]">
        {uploads.map((upload) => {
          const statusKey = String(upload.status ?? "pending").toLowerCase();
          const style = statusStyles[statusKey] || statusStyles["—"];
          const pointsText = upload.pointsAwarded == null ? "—" : `${upload.pointsAwarded} pts`;

          return (
            <div key={upload.id} className="flex items-center border-b border-[#f2f4f7] last:border-b-0">
              <div className="flex-1 flex items-center gap-4 px-8 py-8">
                <Image src={fileIcons[upload.type]} alt="" width={28} height={28} />
                <div>
                  <p className="text-base text-[#212121]">{upload.title}</p>
                  <p className="text-xs text-[#909dad]">{upload.size}</p>
                </div>
              </div>
              <p className="flex-1 text-base text-[#101828] px-6">{upload.course}</p>
              <div className="flex-1 flex items-center gap-1.5 px-6 text-sm text-[#4a5565]">
                <Calendar size={14} /> {upload.date}
              </div>
              <div className="flex-1 px-6">
                <div className={`${style?.bg || "bg-[#f3f4f6]"} ${style?.text || "text-[#6b7280]"} flex items-center gap-1 px-2.5 py-1 rounded-full w-fit text-xs`}>
                  {style?.icon} {statusKey === "pending" ? "Pending" : statusKey === "approved" ? "Approved" : statusKey === "rejected" ? "Rejected" : upload.status}
                </div>
              </div>
              <p className="flex-1 text-base text-[#101828] px-6">{pointsText}</p>
              <div className="w-[140px] shrink-0 flex items-center justify-center gap-6">
                <button
                  type="button"
                  aria-label={`Open ${upload.title}`}
                  className="text-[#212121] hover:text-[#006dff]"
                  onClick={() => window.open(upload.fileUrl, "_blank", "noopener,noreferrer")}
                >
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
    </div>
  );
}