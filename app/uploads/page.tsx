"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/Navbar";
import FullUploadsTable from "@/components/dashboard/FullUploadsTable";
import Link from "next/link";
import { Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";

type DocumentFile = {
  _id: string;
  course: string;
  title: string;
  fileUrl: string;
  fileType: string;
  sizeBytes: number;
  tags: string[];
  downloadCount: number;
  uploadedByType: string;
  uploadedBy: string;
  createdAt?: string;
};

type Upload = {
  id: string;
  title: string;
  size: string;
  type: string;
  course: string;
  date: string;
  status: string;
  points: string;
};

export default function UploadsPage() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchUploads() {
      try {
        setIsLoading(true);
        setError("");
        const [firstRes, secondRes] = await Promise.all([
  apiFetch("/documents/mine?session=2024/2025&semester=first"),
  apiFetch("/documents/mine?session=2024/2025&semester=second"),
]);
const data = { data: [...(firstRes.data || []), ...(secondRes.data || [])] };
        
        // Transform API response to component format
        const transformedUploads = (data.data || []).map((doc: DocumentFile) => ({
          id: doc._id,
          title: doc.title,
          size: `${(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB`,
          type: doc.fileType.toLowerCase().replace(".", "") || "pdf",
          course: doc.course,
          date: doc.createdAt ? new Date(doc.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          status: "—",
          points: "—",
        }));
        
        setUploads(transformedUploads);
      } catch (err) {
        console.error("Failed to fetch uploads:", err);
        setError(err instanceof Error ? err.message : "Failed to load uploads. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUploads();
  }, []);

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-6 lg:gap-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
          <p className="text-xl lg:text-[28px] font-bold text-[#212121]">My Uploads</p>
          <Link
            href="/upload"
            className="bg-[#121720] text-white text-xs lg:text-base flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3.5 rounded-lg w-fit"
          >
            <Plus size={14} /> Upload New Document
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white border border-[#f2f4f7] rounded-2xl py-20 flex items-center justify-center">
            <p className="text-[#9f9f9f]">Loading your uploads...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-[#f2f4f7] rounded-2xl py-20 flex items-center justify-center">
            <p className="text-[#ff3b3b]">{error}</p>
          </div>
        ) : uploads.length === 0 ? (
          <div className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden overflow-x-auto">
            <div className="flex flex-col items-center justify-center gap-4 lg:gap-6 py-12 lg:py-20 px-4">
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
          </div>
        ) : (
          <FullUploadsTable uploads={uploads} />
        )}
      </div>
    </main>
  );
}