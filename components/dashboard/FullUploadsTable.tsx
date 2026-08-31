'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fullUploadsData } from '@/lib/dashboard-data';
import { ArrowLeft, Search, Upload, Download } from 'lucide-react';

export default function FullUploadsTable() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All Levels');
  const [semester, setSemester] = useState('All Semesters');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = fullUploadsData.filter((doc) => {
    const matchSearch =
      !search ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.course.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Statuses' || doc.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getFileIconSrc = (type: string) => {
    if (type === 'pdf') return '/images/file-icon-pdf.png';
    if (type === 'pptx') return '/images/file-icon-pptx.png';
    return '/images/file-icon-word.png';
  };

  return (
    <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 shadow-xs flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2f4f7] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="size-9 rounded-xl bg-[#fbfbfb] border border-[#f2f4f7] hover:bg-[#f4f4f4] flex items-center justify-center text-[#212121] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="font-bold text-xl text-[#212121]">All Departmental Documents</h2>
            <p className="text-xs text-[#21212180]">Complete archive of verified study materials</p>
          </div>
        </div>

        <Link
          href="/upload"
          className="inline-flex items-center gap-2 bg-[#f60] hover:bg-[#e55600] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload size={15} />
          <span>Upload Material</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fbfbfb] p-3 rounded-2xl border border-[#f2f4f7]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#21212180]" size={14} />
          <input
            type="text"
            placeholder="Search by title, course code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#f4f4f4] focus:border-[#006dff] rounded-xl pl-9 pr-3 py-2 text-xs text-[#212121] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="bg-white border border-[#f4f4f4] rounded-xl px-3 py-2 text-xs font-bold text-[#212121] outline-none cursor-pointer"
          >
            <option>All Levels</option>
            <option>100 Level</option>
            <option>200 Level</option>
            <option>300 Level</option>
            <option>400 Level</option>
          </select>

          {/* Semester Filter */}
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="bg-white border border-[#f4f4f4] rounded-xl px-3 py-2 text-xs font-bold text-[#212121] outline-none cursor-pointer"
          >
            <option>All Semesters</option>
            <option>First Semester</option>
            <option>Second Semester</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#f4f4f4] rounded-xl px-3 py-2 text-xs font-bold text-[#212121] outline-none cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Approved</option>
            <option>In Review</option>
            <option>Rejected</option>
          </select>
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
              <th className="py-3 px-4">Date Uploaded</th>
              <th className="py-3 px-4 text-center">Review Status</th>
              <th className="py-3 px-4 text-right">Points</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f7]">
            {filtered.map((doc) => {
              const iconSrc = getFileIconSrc(doc.type);

              return (
                <tr key={doc.id} className="hover:bg-[#fbfbfb] transition-colors">
                  <td className="py-3.5 px-4">
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
                  <td className="py-3.5 px-4 font-bold text-[#006dff]">{doc.course}</td>
                  <td className="py-3.5 px-4 text-[#21212180]">{doc.size}</td>
                  <td className="py-3.5 px-4 text-[#21212180]">{doc.date}</td>
                  <td className="py-3.5 px-4 text-center">
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
                  <td className="py-3.5 px-4 text-right font-bold text-[#212121]">{doc.points}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => alert(`Downloading ${doc.title}...`)}
                      className="size-8 rounded-lg bg-[#fbfbfb] hover:bg-[#f4f4f4] border border-[#f2f4f7] inline-flex items-center justify-center text-[#212121] cursor-pointer transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
