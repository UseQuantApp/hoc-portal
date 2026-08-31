'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderUploads } from '@/lib/dashboard-data';
import { ArrowRight, Search, FileText } from 'lucide-react';

interface RecentUploadsProps {
  showViewAll?: boolean;
}

export default function RecentUploadsCard({ showViewAll = true }: RecentUploadsProps) {
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');
  const [searchQuery, setSearchQuery] = useState('');

  const uploads = placeholderUploads.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const getFileIconSrc = (type: string) => {
    if (type === 'pdf') return '/images/file-icon-pdf.png';
    if (type === 'pptx') return '/images/file-icon-pptx.png';
    return '/images/file-icon-word.png';
  };

  return (
    <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 shadow-xs flex flex-col gap-5">
      {/* Header & Separate Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-[#212121]">Recent Course Documents</h3>
          <p className="text-xs text-[#21212180]">Past questions, lecture notes, and lab manuals</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#21212180]" size={14} />
            <input
              type="text"
              placeholder="Search course or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fbfbfb] border border-[#f4f4f4] focus:border-[#006dff] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#212121] placeholder:text-[#21212180] outline-none transition-colors"
            />
          </div>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-[#fbfbfb] border border-[#f4f4f4] rounded-xl px-3 py-2 text-xs font-bold text-[#212121] outline-none cursor-pointer hover:bg-white transition-colors"
          >
            <option>All Levels</option>
            <option>100 Level</option>
            <option>200 Level</option>
            <option>300 Level</option>
            <option>400 Level</option>
          </select>

          {/* Semester Filter */}
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="bg-[#fbfbfb] border border-[#f4f4f4] rounded-xl px-3 py-2 text-xs font-bold text-[#212121] outline-none cursor-pointer hover:bg-white transition-colors"
          >
            <option>All Semesters</option>
            <option>First Semester</option>
            <option>Second Semester</option>
          </select>

          {showViewAll && (
            <Link
              href="/uploads"
              className="bg-[#eff7ff] text-[#006dff] hover:bg-[#dbeafe] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#f2f4f7] rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#fbfbfb] border-b border-[#f2f4f7] font-bold text-[#21212180] uppercase tracking-wider">
              <th className="py-3 px-4">Document Title</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f7]">
            {uploads.map((doc) => {
              const iconSrc = getFileIconSrc(doc.type);

              return (
                <tr key={doc.id} className="hover:bg-[#fbfbfb] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative size-7 shrink-0 flex items-center justify-center">
                        <Image
                          src={iconSrc}
                          alt={doc.type}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                      <span className="font-bold text-[#212121]">{doc.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#006dff]">{doc.course}</td>
                  <td className="py-3 px-4 text-[#21212180]">{doc.size}</td>
                  <td className="py-3 px-4 text-[#21212180]">{doc.date}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        doc.status === 'Approved'
                          ? 'bg-[#e6f9f0] text-[#00b368]'
                          : doc.status === 'In Review'
                          ? 'bg-[#fff6f0] text-[#f60]'
                          : 'bg-[#fee2e2] text-[#ef4444]'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#212121]">{doc.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
