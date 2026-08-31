"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/Navbar";
import { apiFetch } from "@/lib/api";

type TimetableSlot = {
  _id: string;
  courseCode: string;
  courseTitle: string;
  day: string;
  startTime: string;
  endTime: string;
  venue: string;
  lecturer: string;
};

const session = "2024/2025";
const semester = "first";

const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchTimetable() {
      try {
        setIsLoading(true);
        setError("");
        const data = await apiFetch(`/timetable/mine?session=${session}&semester=${semester}`);
        setTimetable(data.data || []);
      } catch (err) {
        console.error("Failed to fetch timetable:", err);
        setError(err instanceof Error ? err.message : "Failed to load timetable.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTimetable();
  }, []);

  // Group timetable by day
  const groupedByDay = daysOrder.reduce((acc, day) => {
    acc[day] = timetable.filter(slot => slot.day === day).sort((a, b) => {
      const timeA = a.startTime.split(":").map(Number);
      const timeB = b.startTime.split(":").map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
    return acc;
  }, {} as Record<string, TimetableSlot[]>);

  const daysWithClasses = daysOrder.filter(day => groupedByDay[day].length > 0);

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-6 lg:gap-8">
        <p className="text-xl lg:text-[28px] font-bold text-[#212121]">Weekly Timetable</p>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#f2f4f7] py-20 flex items-center justify-center">
            <p className="text-[#9f9f9f]">Loading timetable...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-[#f2f4f7] py-20 flex items-center justify-center">
            <p className="text-[#ff3b3b]">{error}</p>
          </div>
        ) : daysWithClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#f2f4f7] py-20 flex flex-col items-center gap-4">
            <p className="text-lg text-[#212121]">No classes scheduled</p>
            <p className="text-sm text-[#9f9f9f]">Your timetable is empty for this session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {daysWithClasses.map(day => (
              <div key={day} className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden">
                <div className="bg-[#fcfdfd] border-b border-[#f2f4f7] px-6 py-4">
                  <p className="font-bold text-lg text-[#212121]">{day}</p>
                </div>
                <div className="divide-y divide-[#f2f4f7]">
                  {groupedByDay[day].map(slot => (
                    <div key={slot._id} className="px-6 py-4 hover:bg-[#fcfdfd] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-[#212121]">{slot.courseCode}</p>
                          <p className="text-sm text-[#9f9f9f]">{slot.courseTitle}</p>
                        </div>
                        <span className="bg-[#eff6ff] text-[#006dff] text-xs font-semibold px-3 py-1 rounded-full">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-[#9f9f9f]">📍 Venue:</span>
                          <span className="text-[#212121]">{slot.venue}</span>
                        </div>
                        {slot.lecturer && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#9f9f9f]">👨‍🏫 Lecturer:</span>
                            <span className="text-[#212121]">{slot.lecturer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Session Info */}
        <div className="bg-blue-50 border border-[#d1e9ff] rounded-2xl px-6 py-4">
          <p className="text-sm text-[#006dff]">
            Showing timetable for <strong>{session}</strong> - <strong>{semester === "first" ? "1st Semester" : "2nd Semester"}</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
