"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/Navbar";
import { CheckCircle2, Circle, Calendar, BookOpen } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Assignment = {
  _id: string;
  title: string;
  course: string;
  courseCode: string;
  dueDate: string;
  description?: string;
  completed: boolean;
};

const session = "2024/2025";
const semester = "first";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isToggling, setIsToggling] = useState<string>("");

  useEffect(() => {
    async function fetchAssignments() {
      try {
        setIsLoading(true);
        setError("");
        const data = await apiFetch(
          `/assignments/mine?session=${session}&semester=${semester}&status=all`
        );
        setAssignments(data.data || []);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load assignments."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  const toggleCompletion = async (id: string, currentStatus: boolean) => {
    try {
      setIsToggling(id);
      await apiFetch(`/assignments/${id}/status`, {
        method: "POST",
        body: JSON.stringify({ completed: !currentStatus }),
      });

      // Update local state
      setAssignments(
        assignments.map(a =>
          a._id === id ? { ...a, completed: !currentStatus } : a
        )
      );
    } catch (err) {
      console.error("Failed to toggle assignment status:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update assignment status."
      );
    } finally {
      setIsToggling("");
    }
  };

  const filteredAssignments = assignments.filter(a => {
    if (filterStatus === "completed") return a.completed;
    if (filterStatus === "pending") return !a.completed;
    return true;
  });

  const completedCount = assignments.filter(a => a.completed).length;
  const pendingCount = assignments.filter(a => !a.completed).length;

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !assignments.find(a => a._id === assignments.find(x => x.dueDate === dueDate)?._id)?.completed;
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-6 lg:gap-8">
        <p className="text-xl lg:text-[28px] font-bold text-[#212121]">
          Assignments
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#f2f4f7] rounded-2xl p-6">
            <p className="text-sm text-[#9f9f9f]">Total Assignments</p>
            <p className="text-3xl font-bold text-[#212121] mt-2">
              {assignments.length}
            </p>
          </div>
          <div className="bg-white border border-[#f2f4f7] rounded-2xl p-6">
            <p className="text-sm text-[#9f9f9f]">Completed</p>
            <p className="text-3xl font-bold text-[#016630] mt-2">
              {completedCount}
            </p>
          </div>
          <div className="bg-white border border-[#f2f4f7] rounded-2xl p-6">
            <p className="text-sm text-[#9f9f9f]">Pending</p>
            <p className="text-3xl font-bold text-[#894b00] mt-2">
              {pendingCount}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-[#e5e5e5]">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              filterStatus === "all"
                ? "border-[#006dff] text-[#006dff]"
                : "border-transparent text-[#9f9f9f]"
            }`}
          >
            All ({assignments.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              filterStatus === "pending"
                ? "border-[#006dff] text-[#006dff]"
                : "border-transparent text-[#9f9f9f]"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              filterStatus === "completed"
                ? "border-[#006dff] text-[#006dff]"
                : "border-transparent text-[#9f9f9f]"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {error && (
          <div className="bg-[#ffe2e2] border border-[#ff3b3b] rounded-lg px-4 py-3 text-[#9f0712]">
            {error}
          </div>
        )}

        {/* Assignments List */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#f2f4f7] py-20 flex items-center justify-center">
            <p className="text-[#9f9f9f]">Loading assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#f2f4f7] py-20 flex flex-col items-center gap-4">
            <p className="text-lg text-[#212121]">No assignments</p>
            <p className="text-sm text-[#9f9f9f]">
              {filterStatus === "completed"
                ? "You haven't completed any assignments yet."
                : filterStatus === "pending"
                ? "All assignments are completed!"
                : "No assignments assigned yet."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredAssignments.map(assignment => {
              const dueDate = new Date(assignment.dueDate);
              const isOverdueItem = dueDate < new Date() && !assignment.completed;
              const daysUntilDue = Math.ceil(
                (dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={assignment._id}
                  className={`bg-white border rounded-2xl p-6 transition-all hover:shadow-lg ${
                    assignment.completed
                      ? "border-[#f2f4f7] opacity-75"
                      : isOverdueItem
                      ? "border-[#ff3b3b]"
                      : "border-[#f2f4f7]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleCompletion(assignment._id, assignment.completed)}
                      disabled={isToggling === assignment._id}
                      className="mt-1 flex-shrink-0 transition-colors hover:opacity-80 disabled:opacity-50"
                    >
                      {assignment.completed ? (
                        <CheckCircle2
                          size={24}
                          className="text-[#016630]"
                        />
                      ) : (
                        <Circle
                          size={24}
                          className={isOverdueItem ? "text-[#ff3b3b]" : "text-[#d1d5db]"}
                        />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p
                            className={`font-bold text-lg ${
                              assignment.completed
                                ? "text-[#9f9f9f] line-through"
                                : "text-[#212121]"
                            }`}
                          >
                            {assignment.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <BookOpen size={14} className="text-[#006dff]" />
                            <p className="text-sm text-[#9f9f9f]">
                              {assignment.courseCode} - {assignment.course}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {assignment.completed ? (
                            <span className="bg-[#dcfce7] text-[#016630] text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                              ✓ Completed
                            </span>
                          ) : isOverdueItem ? (
                            <span className="bg-[#ffe2e2] text-[#9f0712] text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                              ⚠️ Overdue
                            </span>
                          ) : daysUntilDue <= 3 ? (
                            <span className="bg-[#fef9c2] text-[#894b00] text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                              📌 Due Soon
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {assignment.description && (
                        <p className="text-sm text-[#9f9f9f] mb-3">
                          {assignment.description}
                        </p>
                      )}

                      {/* Due Date */}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-[#9f9f9f]" />
                        <span className={isOverdueItem ? "text-[#ff3b3b] font-medium" : "text-[#9f9f9f]"}>
                          Due: {dueDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          {daysUntilDue > 0 && ` (${daysUntilDue} days)`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Session Info */}
        <div className="bg-blue-50 border border-[#d1e9ff] rounded-2xl px-6 py-4">
          <p className="text-sm text-[#006dff]">
            Showing assignments for <strong>{session}</strong> -{" "}
            <strong>
              {semester === "first" ? "1st Semester" : "2nd Semester"}
            </strong>
          </p>
        </div>
      </div>
    </main>
  );
}
