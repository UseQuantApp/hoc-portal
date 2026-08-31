'use client';

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { BookOpen, Search, Download, FileText, CheckCircle, Clock } from 'lucide-react';

const registeredCourses = [
  {
    code: 'MEE 305',
    title: 'Applied Thermodynamics I',
    units: 3,
    lecturer: 'Prof. O. A. Adebayo',
    materialsCount: 14,
    status: 'In Progress',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    code: 'ECE 301',
    title: 'Electric Circuit Theory',
    units: 3,
    lecturer: 'Dr. K. E. Okon',
    materialsCount: 9,
    status: 'In Progress',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    code: 'MEE 401',
    title: 'Fluid Mechanics & Turbomachinery',
    units: 4,
    lecturer: 'Dr. M. S. Lawal',
    materialsCount: 21,
    status: 'In Progress',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    code: 'CSC 302',
    title: 'Operating Systems & Architecture',
    units: 3,
    lecturer: 'Engr. Mrs. F. Bello',
    materialsCount: 18,
    status: 'In Progress',
    color: 'from-amber-500 to-orange-600',
  },
  {
    code: 'MAT 201',
    title: 'Advanced Mathematical Methods',
    units: 3,
    lecturer: 'Dr. T. O. Sanusi',
    materialsCount: 12,
    status: 'In Progress',
    color: 'from-rose-500 to-red-600',
  },
];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All Levels');

  const filtered = registeredCourses.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.lecturer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col items-center">
      <div className="w-full max-w-[1240px] px-4 sm:px-6 py-4 flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="Enrolled Courses" />

        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2f4f7] pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e293b] tracking-tight">
                Course Curriculum & Notes
              </h1>
              <p className="text-xs text-[#64748b]">
                Access department syllabus, lecture slides, and past papers organized by course
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
                <input
                  type="text"
                  placeholder="Filter courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 sm:w-64 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                />
              </div>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs font-bold text-[#1e293b] outline-none cursor-pointer"
              >
                <option>All Levels</option>
                <option>100 Level</option>
                <option>200 Level</option>
                <option>300 Level</option>
                <option>400 Level</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => (
              <div
                key={course.code}
                className="bg-white border border-[#f2f4f7] hover:border-[#bfdbfe] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black bg-[#eff6ff] text-[#006dff] px-2.5 py-1 rounded-lg">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-semibold text-[#64748b]">
                      {course.units} Credit Units
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#1e293b] line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-[#64748b]">Instructor: {course.lecturer}</p>
                </div>

                <div className="pt-3 border-t border-[#f2f4f7] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748b] flex items-center gap-1.5">
                    <FileText size={14} className="text-[#006dff]" />
                    <span>{course.materialsCount} Documents</span>
                  </span>

                  <button
                    onClick={() => alert(`Opening document drawer for ${course.code}`)}
                    className="text-xs font-bold text-[#006dff] hover:underline cursor-pointer"
                  >
                    View Materials →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
