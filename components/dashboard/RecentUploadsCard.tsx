"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getCurrentAcademicSession } from "@/lib/academic";
import { statusStyles } from "@/components/dashboard/FullUploadsTable";

const columns = ["Document Title", "Courses", "Date", "Status", "Points"];

const statusLabels: Record<string, string> = { pending: "In Review", approved: "Approved", rejected: "Rejected" };

function pointsLabel(status: string, pointsAwarded: number | null) {
  if (status === "pending") return "0 pts (In review)";
  return `${pointsAwarded ?? 0} pts`;
}

// NEW: proper icon lookup instead of a binary doc/pdf check — handles docx/pptx too
const fileIcons: Record<string, string> = {
  doc: "/images/file-icon-word.png",
  docx: "/images/file-icon-word.png",
  pdf: "/images/file-icon-pdf.png",
  pptx: "/images/file-icon-pptx.png",
};

type CourseValue =
  | string
  | {
      _id?: string;
      code?: string;
      title?: string;
      department?: string;
      level?: string;
      [key: string]: unknown;
    }
  | null
  | undefined;

type DocumentFile = {
  _id: string;
  course: CourseValue;
  title: string;
  fileUrl: string;
  fileType: string;
  sizeBytes: number;
  tags: string[];
  downloadCount: number;
  uploadedByType: string;
  uploadedBy: string;
  createdAt?: string; // NEW
  status?: string;
  pointsAwarded?: number | null;
};

type Upload = {
  id: string;
  title: string;
  size: string;
  type: string;
  course: string;
  date: string;
  status: string;
  pointsAwarded: number | null;
};

export default function RecentUploadsCard() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchRecentUploads() {
      try {
        setIsLoading(true);
        setError("");

        const session = getCurrentAcademicSession();
        const [firstRes, secondRes] = await Promise.all([
          apiFetch(`/documents/mine?session=${session}&semester=first`),
          apiFetch(`/documents/mine?session=${session}&semester=second`),
        ]);
        const combinedDocuments = [...(firstRes.data || []), ...(secondRes.data || [])];
        const seenIds = new Set<string>();
        const uniqueDocuments = combinedDocuments.filter((doc: DocumentFile) => {
          const docId = doc._id || `${doc.title}-${doc.course}-${doc.fileUrl}`;
          if (seenIds.has(docId)) {
            return false;
          }
          seenIds.add(docId);
          return true;
        });

        // Transform API response and limit to 5
        const transformed = uniqueDocuments
          .slice(0, 5)
          .map((doc: DocumentFile, index: number) => {
            const courseName =
              typeof doc.course === "string"
                ? doc.course
                : doc.course && typeof doc.course === "object"
                  ? (doc.course.code || doc.course.title || "Unknown course")
                  : "Unknown course";

            return {
              id: doc._id || `${doc.title}-${courseName}-${doc.fileUrl}-${index}`,
              title: doc.title,
              size: `${(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB`,
              type: doc.fileType.toLowerCase().replace(".", "") || "pdf",
              course: courseName,
              // CHANGED: uses the document's real upload date instead of always showing today
              date: doc.createdAt ? new Date(doc.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
              status: typeof doc.status === "string" ? doc.status.toLowerCase() : "pending",
              pointsAwarded: doc.pointsAwarded == null ? null : Number(doc.pointsAwarded),
            };
          });

        setUploads(transformed);
      } catch (err) {
        console.error("Failed to fetch recent uploads:", err);
        setError(err instanceof Error ? err.message : "Failed to load uploads.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentUploads();
  }, []);

  const isEmpty = uploads.length === 0 && !isLoading;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0 mb-6 lg:mb-8">
        <p className="text-xl lg:text-[28px] font-bold text-[#212121]">Recent Uploads</p>
        <div className="flex items-center gap-2 lg:gap-4">
          <Link href="/upload" className="bg-[#121720] text-white text-xs lg:text-base flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3.5 rounded-lg">
            <Plus size={14} /> Upload New Document
          </Link>
          <Link href="/uploads" className="bg-[#fcfdfd] border border-[#e5e5e5] text-[#212121] text-xs lg:text-base flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3.5 rounded-lg">
            View all <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden overflow-x-auto">
        <div className="hidden lg:flex items-center bg-[#fcfdfd] border-b border-[#f2f4f7]">
          {columns.map((col) => (
            <p
              key={col}
              className="flex-1 font-bold text-sm lg:text-lg text-[#212121] tracking-tight px-3 lg:px-6 py-3 lg:py-6 first:pl-4 lg:first:pl-8 whitespace-nowrap"
            >
              {col}
            </p>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 lg:py-20">
            <p className="text-[#9f9f9f]">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 lg:py-20">
            <p className="text-[#ff3b3b] text-sm lg:text-base">{error}</p>
          </div>
        ) : isEmpty ? (
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
          <div className="lg:min-w-0">
            {uploads.map((upload, index) => {
              const style = statusStyles[upload.status] || statusStyles["—"];
              const statusPill = (
                <span className={`${style.bg} ${style.text} inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs`}>
                  {style.icon} {statusLabels[upload.status] ?? upload.status}
                </span>
              );
              // CHANGED: uses the icon map so docx/pptx get their correct icons instead of falling through to PDF
              const fileIcon = <Image src={fileIcons[upload.type] || fileIcons.pdf} alt="" width={28} height={28} className="shrink-0 self-start size-7 object-contain" />;

              return (
                <div key={`${upload.id}-${index}`} className="border-b border-[#f2f4f7] last:border-b-0">
                  {/* mobile: compact card, matching the /uploads page */}
                  <div className="lg:hidden flex gap-3 px-4 py-4">
                    {fileIcon}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#212121] truncate">{upload.title}</p>
                      <p className="text-xs text-[#909dad]">{upload.course} · {upload.size}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#4a5565]">
                        <span>{upload.date}</span>
                        {statusPill}
                        <span className="text-[#101828]">{pointsLabel(upload.status, upload.pointsAwarded)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center">
                    <div className="flex-1 flex items-center gap-4 px-8 py-8">
                      {fileIcon}
                      <div>
                        <p className="text-base text-[#212121]">{upload.title}</p>
                        <p className="text-xs text-[#909dad]">{upload.size}</p>
                      </div>
                    </div>
                    <p className="flex-1 text-base text-[#101828] px-6">{upload.course}</p>
                    <div className="flex-1 flex items-center gap-1.5 px-6 text-sm text-[#4a5565]">
                      <Calendar size={14} /> {upload.date}
                    </div>
                    <div className="flex-1 px-6">{statusPill}</div>
                    <p className="flex-1 text-base text-[#101828] px-6">{pointsLabel(upload.status, upload.pointsAwarded)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}