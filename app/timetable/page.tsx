'use client';

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { Calendar, Clock, MapPin, Sparkles, BookOpen } from 'lucide-react';

const schedule = {
  Monday: [
    { time: '08:00 AM - 10:00 AM', course: 'MEE 305', title: 'Thermodynamics', venue: 'LT 1', lecturer: 'Prof. Adebayo' },
    { time: '11:00 AM - 01:00 PM', course: 'ECE 301', title: 'Circuit Theory', venue: 'Faculty Lab 2', lecturer: 'Dr. Okon' },
  ],
  Tuesday: [
    { time: '10:00 AM - 12:00 PM', course: 'MAT 201', title: 'Engineering Mathematics', venue: 'LT 4', lecturer: 'Dr. Sanusi' },
    { time: '02:00 PM - 04:00 PM', course: 'MEE 401', title: 'Fluid Dynamics', venue: 'Mech Workshop', lecturer: 'Dr. Lawal' },
  ],
  Wednesday: [
    { time: '09:00 AM - 11:00 AM', course: 'CSC 302', title: 'Operating Systems', venue: 'Comp Lab 1', lecturer: 'Engr. Bello' },
  ],
  Thursday: [
    { time: '08:00 AM - 10:00 AM', course: 'MEE 305', title: 'Thermodynamics Tutorial', venue: 'Classroom 3B', lecturer: 'Prof. Adebayo' },
    { time: '01:00 PM - 03:00 PM', course: 'GET 301', title: 'Engineer in Society', venue: 'Auditorium', lecturer: 'Guest Lecturer' },
  ],
  Friday: [
    { time: '10:00 AM - 12:00 PM', course: 'ECE 301', title: 'Circuit Practical Test', venue: 'Electronics Lab', lecturer: 'Dr. Okon' },
  ],
};

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState<keyof typeof schedule>('Monday');

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col items-center">
      <div className="w-full max-w-[1240px] px-4 sm:px-6 py-4 flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="Lecture & Lab Timetable" />

        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2f4f7] pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e293b] tracking-tight">
                Academic Lecture & Exam Schedule
              </h1>
              <p className="text-xs text-[#64748b]">
                First Semester 2024/2025 · Mechanical Engineering (400 Level)
              </p>
            </div>

            {/* Day Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#f8fafc] p-1.5 rounded-2xl border border-[#e2e8f0]">
              {(Object.keys(schedule) as Array<keyof typeof schedule>).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDay === day
                      ? 'bg-[#006dff] text-white shadow-2xs'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Classes for selected day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedule[selectedDay].map((cls, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-[#f2f4f7] bg-[#f8fafc]/60 hover:bg-[#f8fafc] transition-all flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#006dff] bg-[#eff6ff] px-2.5 py-0.5 rounded-md">
                    {cls.course}
                  </span>
                  <span className="text-xs font-semibold text-[#64748b] flex items-center gap-1">
                    <Clock size={13} />
                    <span>{cls.time}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#1e293b]">{cls.title}</h3>
                  <p className="text-xs text-[#64748b]">Lecturer: {cls.lecturer}</p>
                </div>

                <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#475569]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <MapPin size={14} className="text-[#ea580c]" />
                    <span>Venue: {cls.venue}</span>
                  </span>

                  <button
                    onClick={() => alert(`Set reminder for ${cls.course} at ${cls.time}`)}
                    className="text-[#006dff] font-bold hover:underline cursor-pointer"
                  >
                    Set Reminder
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
