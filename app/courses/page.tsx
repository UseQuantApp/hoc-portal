"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/Navbar";
import { Plus, Search, Loader } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Course = {
  _id: string;
  code: string;
  title: string;
  department: string;
  level: string;
  creditUnits: number;
};

type EnrolledCourse = Course & {
  enrolledAt: string;
};

const session = "2024/2025";
const semester = "first";

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<"enrolled" | "browse">("enrolled");
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [browseCourses, setBrowseCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isEnrolling, setIsEnrolling] = useState<string>("");
  const [enrollSuccess, setEnrollSuccess] = useState<string>("");

  // Fetch enrolled courses
  useEffect(() => {
    async function fetchEnrolled() {
      try {
        const data = await apiFetch(`/courses/mine?session=${session}&semester=${semester}`);
        setEnrolledCourses(data.data || []);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
        setError(err instanceof Error ? err.message : "Failed to load enrolled courses.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEnrolled();
  }, []);

  // Fetch browse/available courses
  async function fetchBrowseCourses() {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (departmentFilter) queryParams.append("department", departmentFilter);
      if (levelFilter) queryParams.append("level", levelFilter);
      
      const url = `/courses?${queryParams.toString()}`;
      const data = await apiFetch(url);
      setBrowseCourses(data.data || []);
    } catch (err) {
      console.error("Failed to fetch browse courses:", err);
      setError(err instanceof Error ? err.message : "Failed to load courses.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "browse") {
      fetchBrowseCourses();
    }
  }, [activeTab, searchQuery, departmentFilter, levelFilter]);

  const handleEnroll = async (courseIds: string[]) => {
    try {
      setIsEnrolling(courseIds.join(","));
      setEnrollSuccess("");
      
      const data = await apiFetch("/courses/enroll", {
        method: "POST",
        body: JSON.stringify({
          courseIds,
          session,
          semester,
        }),
      });

      setEnrollSuccess("Enrolled successfully!");
      // Refresh enrolled courses
      const enrolledData = await apiFetch(`/courses/mine?session=${session}&semester=${semester}`);
      setEnrolledCourses(enrolledData.data || []);
      
      // Refresh browse courses
      await fetchBrowseCourses();
      
      setTimeout(() => setEnrollSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to enroll:", err);
      setError(err instanceof Error ? err.message : "Failed to enroll in course.");
    } finally {
      setIsEnrolling("");
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-6 lg:gap-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
          <p className="text-xl lg:text-[28px] font-bold text-[#212121]">Courses</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e5e5e5]">
          <button
            onClick={() => setActiveTab("enrolled")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "enrolled"
                ? "border-[#006dff] text-[#006dff]"
                : "border-transparent text-[#9f9f9f]"
            }`}
          >
            Enrolled Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "browse"
                ? "border-[#006dff] text-[#006dff]"
                : "border-transparent text-[#9f9f9f]"
            }`}
          >
            Browse Courses
          </button>
        </div>

        {error && (
          <div className="bg-[#ffe2e2] border border-[#ff3b3b] rounded-lg px-4 py-3 text-[#9f0712]">
            {error}
          </div>
        )}

        {enrollSuccess && (
          <div className="bg-[#dcfce7] border border-[#016630] rounded-lg px-4 py-3 text-[#016630]">
            {enrollSuccess}
          </div>
        )}

        {/* Enrolled Courses Tab */}
        {activeTab === "enrolled" && (
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="bg-white rounded-2xl py-20 flex items-center justify-center">
                <p className="text-[#9f9f9f]">Loading...</p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#f2f4f7] py-12 flex flex-col items-center gap-4">
                <p className="text-[#212121] font-medium">No courses enrolled yet</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="bg-[#006dff] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={16} /> Browse Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white border border-[#f2f4f7] rounded-2xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <p className="text-sm text-[#006dff] font-semibold">{course.code}</p>
                    <p className="text-lg font-bold text-[#212121] mt-2">{course.title}</p>
                    <div className="mt-4 space-y-2 text-sm text-[#9f9f9f]">
                      <p>Department: {course.department}</p>
                      <p>Level: {course.level}</p>
                      <p>Credits: {course.creditUnits}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Browse Courses Tab */}
        {activeTab === "browse" && (
          <div className="flex flex-col gap-6">
            {/* Filters */}
            <div className="bg-white border border-[#f2f4f7] rounded-2xl p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center bg-[#f6f6f6] border border-[#f4f4f4] rounded-xl px-4 py-3">
                  <Search size={18} className="text-[#9f9f9f] mr-2" />
                  <input
                    placeholder="Search course title or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-[#212121] placeholder:text-[#9f9f9f]"
                  />
                </div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="bg-[#f6f6f6] border border-[#f4f4f4] rounded-xl px-4 py-3 text-sm text-[#212121] outline-none"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Science">Science</option>
                  <option value="Medicine">Medicine</option>
                </select>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="bg-[#f6f6f6] border border-[#f4f4f4] rounded-xl px-4 py-3 text-sm text-[#212121] outline-none"
                >
                  <option value="">All Levels</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
              </div>
            </div>

            {/* Browse Results */}
            {isLoading ? (
              <div className="bg-white rounded-2xl py-20 flex items-center justify-center">
                <Loader className="animate-spin text-[#006dff]" />
              </div>
            ) : browseCourses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#f2f4f7] py-12 flex flex-col items-center gap-4">
                <p className="text-[#212121]">No courses found matching your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {browseCourses.map((course) => {
                  const isAlreadyEnrolled = enrolledCourses.some(e => e._id === course._id);
                  return (
                    <div
                      key={course._id}
                      className="bg-white border border-[#f2f4f7] rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <p className="text-sm text-[#006dff] font-semibold">{course.code}</p>
                      <p className="text-lg font-bold text-[#212121] mt-2">{course.title}</p>
                      <div className="mt-4 space-y-2 text-sm text-[#9f9f9f]">
                        <p>Department: {course.department}</p>
                        <p>Level: {course.level}</p>
                        <p>Credits: {course.creditUnits}</p>
                      </div>
                      <button
                        onClick={() => handleEnroll([course._id])}
                        disabled={isAlreadyEnrolled || isEnrolling === course._id}
                        className={`w-full mt-6 py-2 rounded-lg font-medium transition-colors ${
                          isAlreadyEnrolled
                            ? "bg-[#e5e5e5] text-[#9f9f9f] cursor-not-allowed"
                            : "bg-[#006dff] text-white hover:bg-[#0056cc]"
                        }`}
                      >
                        {isEnrolling === course._id ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader size={14} className="animate-spin" /> Enrolling...
                          </span>
                        ) : isAlreadyEnrolled ? (
                          "Already Enrolled"
                        ) : (
                          "Enroll"
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
