'use client';

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { ClipboardList, Calendar, CheckCircle2, Clock, AlertCircle, Upload } from 'lucide-react';

const assignmentList = [
  {
    id: 1,
    course: 'MEE 305',
    title: 'Rankine Cycle Steam Turbine Efficiency Computation',
    deadline: 'Tomorrow, 11:59 PM',
    status: 'Pending',
    score: null,
    urgent: true,
  },
  {
    id: 2,
    course: 'ECE 301',
    title: 'Thevenin and Norton Equivalent Circuit Derivation (Lab 3)',
    deadline: 'Oct 24, 2025',
    status: 'Submitted',
    score: '18 / 20 pts',
    urgent: false,
  },
  {
    id: 3,
    course: 'MEE 401',
    title: 'Navier-Stokes Boundary Layer Simulation Report',
    deadline: 'Oct 29, 2025',
    status: 'Pending',
    score: null,
    urgent: false,
  },
  {
    id: 4,
    course: 'CSC 302',
    title: 'Deadlock Detection Algorithm Implementation (C++)',
    deadline: 'Nov 02, 2025',
    status: 'Graded',
    score: '20 / 20 pts',
    urgent: false,
  },
];

export default function AssignmentsPage() {
  const [filter, setFilter] = useState('All');

  const filtered = assignmentList.filter((a) => {
    if (filter === 'Pending') return a.status === 'Pending';
    if (filter === 'Submitted') return a.status === 'Submitted' || a.status === 'Graded';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col items-center">
      <div className="w-full max-w-[1240px] px-4 sm:px-6 py-4 flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="Assignment Tracker" />

        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2f4f7] pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e293b] tracking-tight">
                Academic Tasks & Continuous Assessments
              </h1>
              <p className="text-xs text-[#64748b]">
                Never miss a submission deadline for tests, lab sheets, and class assignments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['All', 'Pending', 'Submitted'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filter === tab
                      ? 'bg-[#006dff] text-white shadow-2xs'
                      : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-[#f2f4f7] bg-[#f8fafc]/50 hover:bg-[#f8fafc] transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#006dff] bg-[#eff6ff] px-2.5 py-0.5 rounded-md">
                      {item.course}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'Graded' || item.status === 'Submitted'
                          ? 'bg-[#ecfdf5] text-[#00b368]'
                          : item.urgent
                          ? 'bg-[#fef2f2] text-[#ef4444]'
                          : 'bg-[#fff7ed] text-[#ea580c]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#1e293b]">{item.title}</h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0] text-xs">
                  <span className="text-[#64748b] flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Due: {item.deadline}</span>
                  </span>

                  {item.status === 'Pending' ? (
                    <button
                      onClick={() => alert(`Submitting solution for ${item.title}`)}
                      className="bg-[#f60] hover:bg-[#e55600] text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Upload size={13} />
                      <span>Submit</span>
                    </button>
                  ) : (
                    <span className="font-bold text-[#00b368]">{item.score || 'Awaiting Grade'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
