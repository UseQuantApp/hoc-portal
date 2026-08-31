'use client';

import React from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { GraduationCap, Award, TrendingUp, Sparkles, BookOpen } from 'lucide-react';

const semesterResults = [
  { code: 'MEE 305', title: 'Applied Thermodynamics I', units: 3, grade: 'A', score: 78, gp: 5.0 },
  { code: 'ECE 301', title: 'Electric Circuit Theory', units: 3, grade: 'A', score: 82, gp: 5.0 },
  { code: 'MEE 401', title: 'Fluid Mechanics', units: 4, grade: 'B', score: 66, gp: 4.0 },
  { code: 'CSC 302', title: 'Operating Systems', units: 3, grade: 'A', score: 74, gp: 5.0 },
  { code: 'MAT 201', title: 'Engineering Math', units: 3, grade: 'B', score: 68, gp: 4.0 },
  { code: 'GET 301', title: 'Engineer in Society', units: 2, grade: 'A', score: 85, gp: 5.0 },
];

export default function GradesPage() {
  const totalUnits = semesterResults.reduce((acc, r) => acc + r.units, 0);
  const totalWeightedPoints = semesterResults.reduce((acc, r) => acc + r.units * r.gp, 0);
  const gpa = (totalWeightedPoints / totalUnits).toFixed(2);

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col items-center">
      <div className="w-full max-w-[1240px] px-4 sm:px-6 py-4 flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="Grades & Performance" />

        {/* CGPA Banner */}
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#00b368] text-xs font-bold px-3 py-1 rounded-full self-center md:self-start">
              <Award size={14} />
              <span>First Class Standing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] tracking-tight">
              Academic Standing & CGPA Calculator
            </h1>
            <p className="text-xs text-[#64748b]">
              Mechanical Engineering · 400 Level · Lagos State University
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl">
            <div className="text-center px-4 border-r border-[#e2e8f0]">
              <span className="text-[10px] font-bold text-[#64748b] uppercase">Current GPA</span>
              <span className="text-3xl font-black text-[#006dff] block">{gpa}</span>
            </div>
            <div className="text-center px-4">
              <span className="text-[10px] font-bold text-[#64748b] uppercase">Cumulative CGPA</span>
              <span className="text-3xl font-black text-[#00b368] block">4.68</span>
            </div>
          </div>
        </div>

        {/* Semester Transcript */}
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-[#1e293b]">300 Level — Second Semester Results</h2>
              <p className="text-xs text-[#64748b]">Total Units Registered: {totalUnits}</p>
            </div>
          </div>

          <div className="border border-[#f2f4f7] rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#f2f4f7] font-bold text-[#64748b] uppercase">
                  <th className="py-3 px-4">Course Code</th>
                  <th className="py-3 px-4">Course Description</th>
                  <th className="py-3 px-4 text-center">Credit Units</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-right">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f7]">
                {semesterResults.map((row) => (
                  <tr key={row.code} className="hover:bg-[#f8fafc]">
                    <td className="py-3.5 px-4 font-bold text-[#006dff]">{row.code}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#1e293b]">{row.title}</td>
                    <td className="py-3.5 px-4 text-center text-[#64748b]">{row.units}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#1e293b]">{row.score}%</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="size-7 rounded-lg bg-[#eff6ff] text-[#006dff] font-black inline-flex items-center justify-center">
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#1e293b]">
                      {(row.units * row.gp).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
