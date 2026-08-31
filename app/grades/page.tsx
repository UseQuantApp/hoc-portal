"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/Navbar";
import { TrendingUp, Award } from "lucide-react";
import { apiFetch } from "@/lib/api";

type GradeRecord = {
  _id: string;
  course: string;
  courseCode: string;
  grade: string;
  gradePoints: number;
  creditUnits: number;
  semester: string;
};

type CGPAData = {
  cgpa: number;
  totalCreditUnits: number;
  semesterBreakdown: {
    semester: string;
    gpa: number;
    creditUnits: number;
  }[];
};

const session = "2024/2025";
const semester = "first";

const gradeColorMap: Record<string, string> = {
  A: "bg-[#dcfce7] text-[#016630]",
  B: "bg-[#d1e9ff] text-[#0056cc]",
  C: "bg-[#fef9c2] text-[#894b00]",
  D: "bg-[#ffe2e2] text-[#9f0712]",
  F: "bg-[#f3f4f6] text-[#374151]",
};

export default function GradesPage() {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [cgpaData, setCGPAData] = useState<CGPAData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchGrades() {
      try {
        setIsLoading(true);
        setError("");

        // Fetch grades
        const gradesData = await apiFetch(
          `/grades/mine?session=${session}&semester=${semester}`
        );
        setGrades(gradesData.data || []);

        // Fetch CGPA
        const cgpaResponse = await apiFetch("/grades/mine/cgpa");
        setCGPAData(cgpaResponse.data);
      } catch (err) {
        console.error("Failed to fetch grades:", err);
        setError(err instanceof Error ? err.message : "Failed to load grades.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchGrades();
  }, []);

  const semesterGPA =
    cgpaData?.semesterBreakdown.find(s => s.semester === semester)?.gpa || 0;

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-6 lg:gap-8">
        <p className="text-xl lg:text-[28px] font-bold text-[#212121]">
          Grades & Academic Performance
        </p>

        {/* CGPA Summary */}
        {cgpaData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#006dff] to-[#0056cc] text-white rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} />
                <p className="text-sm font-semibold opacity-90">Cumulative GPA</p>
              </div>
              <p className="text-4xl font-bold">{cgpaData.cgpa.toFixed(2)}</p>
              <p className="text-sm opacity-75 mt-2">
                Out of 4.0 scale
              </p>
            </div>

            <div className="bg-white border border-[#f2f4f7] rounded-2xl p-8">
              <p className="text-sm text-[#9f9f9f]">Current Semester GPA</p>
              <p className="text-3xl font-bold text-[#212121] mt-2">
                {semesterGPA.toFixed(2)}
              </p>
              <p className="text-xs text-[#9f9f9f] mt-2">
                {semester === "first" ? "1st Semester" : "2nd Semester"} {session}
              </p>
            </div>

            <div className="bg-white border border-[#f2f4f7] rounded-2xl p-8">
              <p className="text-sm text-[#9f9f9f]">Total Credit Units</p>
              <p className="text-3xl font-bold text-[#212121] mt-2">
                {cgpaData.totalCreditUnits}
              </p>
              <p className="text-xs text-[#9f9f9f] mt-2">Completed</p>
            </div>
          </div>
        )}

        {/* Semester Breakdown */}
        {cgpaData && cgpaData.semesterBreakdown.length > 0 && (
          <div className="bg-white border border-[#f2f4f7] rounded-2xl p-6 lg:p-8">
            <h3 className="font-bold text-lg text-[#212121] mb-6 flex items-center gap-2">
              <Award size={20} /> Semester Breakdown
            </h3>
            <div className="space-y-4">
              {cgpaData.semesterBreakdown.map(sem => (
                <div
                  key={sem.semester}
                  className="flex items-center justify-between p-4 bg-[#fcfdfd] rounded-xl border border-[#f2f4f7]"
                >
                  <div>
                    <p className="font-semibold text-[#212121]">
                      {sem.semester}
                    </p>
                    <p className="text-sm text-[#9f9f9f]">
                      {sem.creditUnits} credit units
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#006dff]">
                      {sem.gpa.toFixed(2)}
                    </p>
                    <p className="text-xs text-[#9f9f9f]">GPA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses & Grades */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#f2f4f7] py-20 flex items-center justify-center">
            <p className="text-[#9f9f9f]">Loading grades...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-[#f2f4f7] py-20 flex items-center justify-center">
            <p className="text-[#ff3b3b]">{error}</p>
          </div>
        ) : grades.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#f2f4f7] py-20 flex flex-col items-center gap-4">
            <p className="text-lg text-[#212121]">No grades yet</p>
            <p className="text-sm text-[#9f9f9f]">
              Your grades will appear here once they are released.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-[#fcfdfd] border-b border-[#f2f4f7]">
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">
                      Course Code
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#212121]">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#212121]">
                      Grade
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#212121]">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, idx) => (
                    <tr
                      key={grade._id}
                      className={`border-b border-[#f2f4f7] last:border-b-0 ${
                        idx % 2 === 0 ? "bg-white" : "bg-[#fcfdfd]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#212121]">
                          {grade.course}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#9f9f9f]">
                          {grade.courseCode}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm text-[#212121]">
                          {grade.creditUnits}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                            gradeColorMap[grade.grade] ||
                            gradeColorMap.F
                          }`}
                        >
                          {grade.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm font-semibold text-[#212121]">
                          {grade.gradePoints.toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Row */}
            <div className="bg-[#fcfdfd] border-t border-[#f2f4f7] px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#212121]">Total</p>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-[#9f9f9f]">Credit Units</p>
                    <p className="font-bold text-[#212121]">
                      {grades.reduce((sum, g) => sum + g.creditUnits, 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#9f9f9f]">Total Points</p>
                    <p className="font-bold text-[#212121]">
                      {grades
                        .reduce((sum, g) => sum + g.gradePoints, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session Info */}
        <div className="bg-blue-50 border border-[#d1e9ff] rounded-2xl px-6 py-4">
          <p className="text-sm text-[#006dff]">
            Showing grades for <strong>{session}</strong> -{" "}
            <strong>
              {semester === "first" ? "1st Semester" : "2nd Semester"}
            </strong>
          </p>
        </div>
      </div>
    </main>
  );
}
