"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

const columns = ["Document Title", "Courses", "Date"];

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
};

type Upload = {
  id: string;
  title: string;
  size: string;
  type: string;
  course: string;
  date: string;
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

        const [firstRes, secondRes] = await Promise.all([
          apiFetch("/documents/mine?session=2024/2025&semester=first"),
          apiFetch("/documents/mine?session=2024/2025&semester=second"),
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
              date: new Date().toISOString().split("T")[0],
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
          <button className="bg-[#121720] text-white text-xs lg:text-base flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3.5 rounded-lg">
            <Plus size={14} /> Upload New Document
          </button>
          <Link href="/uploads" className="bg-[#fcfdfd] border border-[#e5e5e5] text-[#212121] text-xs lg:text-base flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3.5 rounded-lg">
            View all <ArrowRight size={14} />
          </Link>
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
            {uploads.map((upload, index) => (
              <div key={`${upload.id}-${index}`} className="flex flex-col lg:flex-row lg:items-center border-b border-[#f2f4f7] last:border-b-0">
                <div className="flex-1 flex items-center gap-3 lg:gap-4 px-4 lg:px-8 pt-4 lg:py-8">
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
                <p className="flex-1 text-sm lg:text-base text-[#101828] px-4 lg:px-6 pb-2 lg:pb-0">{upload.course}</p>
                <div className="flex-1 flex items-center gap-1.5 px-4 lg:px-6 pb-4 lg:pb-0 text-sm text-[#4a5565]">
                  <Calendar size={14} /> {upload.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}