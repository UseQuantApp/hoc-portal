"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/Navbar";
import { Bell, BookOpen, FlaskConical, GraduationCap, MessageSquare, Plus, Users, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

const tabs = ["Lecturer Alerts", "Announcement", "Timetable"];

const weeklySchedule = [
  { id: 1, day: "Mon", code: "MEE 401", course: "Thermodynamics I", time: "8:00 – 10:00 AM", venue: "LT2" },
  { id: 2, day: "Mon", code: "GEG 301", course: "Engineering Maths", time: "11:00 AM – 1:00 PM", venue: "LT4" },
  { id: 3, day: "Tue", code: "MEE 501", course: "Advanced Mechanics", time: "9:00 – 11:00 AM", venue: "LT1" },
];

const announcementTemplates = [
  { label: "General Update", icon: "📢" },
  { label: "Material Available", icon: "📚" },
  { label: "Exam Reminder", icon: "⚠️" },
  { label: "Meeting Notice", icon: "🔔" },
  { label: "Custom message", icon: "✏️" },
];

const adHocTemplates = [
  { label: "Tutorial", icon: BookOpen, message: "A tutorial session for your course has been scheduled. Venue and time details are below. Attendance is strongly encouraged." },
  { label: "Study Group", icon: Users, message: "A study group session for the upcoming exam is holding today. Come with your materials and questions." },
  { label: "Extra Class", icon: GraduationCap, message: "An extra class has been scheduled to cover outstanding topics. Please make time to attend." },
  { label: "Lab Session", icon: FlaskConical, message: "Lab session for your course is holding as scheduled. Bring your lab manual and safety wear." },
  { label: "Custom message", icon: MessageSquare, message: "" },
];

export default function HocHubPage() {
  const [activeTab, setActiveTab] = useState("Lecturer Alerts");
  const [classOptions, setClassOptions] = useState<Array<{ _id: string; code: string; title: string; day: string; time: string }>>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [isAdHocModalOpen, setIsAdHocModalOpen] = useState(false);
  const [adHocSubject, setAdHocSubject] = useState("");
  const [adHocMessage, setAdHocMessage] = useState("");
  const [adHocPushAlert, setAdHocPushAlert] = useState(true);
  const [lectureHistory, setLectureHistory] = useState<Array<{ id: string; title?: string; message: string; createdAt: string }>>([]);
  const [announcementHistory, setAnnouncementHistory] = useState<Array<{ id: string; title?: string; message: string; createdAt: string }>>([]);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadClassOptions() {
      try {
        const semesterNames = ["first", "second"];
        const responses = await Promise.all(
          semesterNames.map((semester) => apiFetch(`/courses/mine?session=2024/2025&semester=${semester}`))
        );

        const allCourses = responses.flatMap((response) => response.data ?? response ?? []);
        const uniqueCourses = new Map<string, { _id: string; code: string; title: string; day: string; time: string }>();

        allCourses.forEach((course: Record<string, unknown>) => {
          const courseId = String(course._id ?? "");
          if (!courseId) return;

          const code = String(course.code ?? course.courseCode ?? "Course");
          const title = String(course.title ?? course.name ?? "Untitled course");

          if (!uniqueCourses.has(courseId)) {
            uniqueCourses.set(courseId, {
              _id: courseId,
              code,
              title,
              day: "Scheduled",
              time: "Live class",
            });
          }
        });

        setClassOptions(Array.from(uniqueCourses.values()));
      } catch (err) {
        console.error("Failed to load real class options:", err);
        setClassOptions([]);
      }
    }

    loadClassOptions();
  }, []);

  const selected = classOptions.find((c) => c._id === selectedClass);

  useEffect(() => {
    Promise.all([apiFetch("/announcements/mine?type=lecture_alert"), apiFetch("/announcements/mine?type=announcement")])
      .then(([lectureResponse, announcementResponse]) => {
        setLectureHistory(lectureResponse.data ?? lectureResponse);
        setAnnouncementHistory(announcementResponse.data ?? announcementResponse);
      })
      .catch((err) => setSubmitError(err instanceof Error ? err.message : "Failed to load announcement history."));
  }, []);

  const submitAnnouncement = async (body: Record<string, unknown>) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await apiFetch("/announcements", { method: "POST", body: JSON.stringify(body) });
      setAlertMessage("");
      setAnnouncementTitle("");
      setAnnouncementMessage("");
      const response = await apiFetch(`/announcements/mine?type=${body.type}`);
      if (body.type === "lecture_alert") setLectureHistory(response.data ?? response);
      else setAnnouncementHistory(response.data ?? response);
      return true;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to send announcement.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex items-center gap-4">
        <div className="bg-white flex-1 rounded-xl p-3 lg:p-4 flex items-center gap-2.5">
          <input
            placeholder="Search materials, courses..."
            className="w-full text-sm lg:text-lg text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
          />
        </div>
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <p className="text-2xl font-bold text-[#212121]">HOC Communication Hub</p>
          <p className="text-sm text-[#9f9f9f]">
            Scoped to 500L · Mechanical Engineering · LASU — 47 students
          </p>
        </div>

        <div className="flex items-center gap-2 w-fit bg-white rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm lg:text-base transition-colors ${
                activeTab === tab ? "bg-[#006dff] text-white" : "text-[#212121] hover:bg-[#f6f6f6]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Lecturer Alerts" && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-bold text-lg text-[#212121]">Select a class to alert</p>
                <button
                  type="button"
                  onClick={() => setIsAdHocModalOpen(true)}
                  className="bg-[#121720] text-white text-sm flex items-center gap-2 px-3 py-2 rounded-lg shrink-0"
                >
                  <Plus size={16} /> Ad-hoc Alert
                </button>
              </div>

              <div className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden">
                {classOptions.length === 0 ? (
                  <div className="px-5 py-8 text-sm text-[#9f9f9f]">No classes available yet. Add or enroll in a course first.</div>
                ) : (
                  classOptions.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => setSelectedClass(c._id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 border-b border-[#f2f4f7] last:border-b-0 text-left hover:bg-[#f9fafb] transition-colors ${
                        selectedClass === c._id ? "bg-[#eff7ff]" : ""
                      }`}
                    >
                      <span className="text-xs font-bold text-[#9f9f9f] w-8 shrink-0">{c.day}</span>
                      <div>
                        <p className="text-sm lg:text-base text-[#212121]">
                          <span className="font-bold">{c.code}</span> {c.title}
                        </p>
                        <p className="text-xs text-[#9f9f9f]">{c.time}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="w-full lg:w-[380px] shrink-0">
              {!selected ? (
                <div className="bg-white border border-[#f2f4f7] rounded-2xl flex flex-col items-center justify-center gap-4 p-8 h-full min-h-[300px]">
                  <div className="bg-[#fff6f0] rounded-full size-14 flex items-center justify-center">
                    <Bell className="text-[#f60]" size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-base text-[#212121]">No class selected</p>
                    <p className="text-sm text-[#9f9f9f]">
                      Pick any course to the left around the start of your schedule alerts for later.
                    </p>
                  </div>
                  <button
                    disabled
                    className="bg-[#121720] disabled:opacity-40 text-white text-sm flex items-center gap-2 px-4 py-3 rounded-lg"
                  >
                    <Plus size={16} /> Add new Alert
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-[#f2f4f7] rounded-2xl flex flex-col gap-4 p-6">
                  <div>
                    <p className="font-bold text-base text-[#212121]">{selected.code} — {selected.title}</p>
                    <p className="text-sm text-[#9f9f9f]">{selected.day} · {selected.time}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-[#212121]">Suggested templates</p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setAlertMessage(`${selected.code} has been cancelled today.`)}
                        className="text-left text-sm bg-[#f6f6f6] rounded-lg px-3 py-2 hover:bg-[#efefef]"
                      >
                        &quot;{selected.code} has been cancelled today.&quot;
                      </button>
                      <button
                        onClick={() => setAlertMessage(`${selected.code} venue has been changed.`)}
                        className="text-left text-sm bg-[#f6f6f6] rounded-lg px-3 py-2 hover:bg-[#efefef]"
                      >
                        &quot;{selected.code} venue has been changed.&quot;
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-[#212121]">Custom message</p>
                    <textarea
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      placeholder="Write a custom alert..."
                      className="w-full bg-[#f6f6f6] border border-[#f4f4f4] rounded-lg p-3 text-sm text-[#212121] outline-none min-h-[80px] resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-[#212121]">
                    <input type="checkbox" className="accent-[#006dff]" defaultChecked />
                    Push Alert to enrolled students
                  </label>

                  <button
                    disabled={!alertMessage || isSubmitting || !selected?._id}
                    onClick={() => submitAnnouncement({ type: "lecture_alert", courseId: selected?._id, title: `${selected.code} Alert`, message: alertMessage })}
                    className="w-full bg-[#f60] disabled:opacity-40 text-white text-sm font-bold py-3 rounded-xl"
                  >
                    Send Alert
                  </button>
                  {/* TODO: backend — POST alert (class, message, pushAlert flag); log HOC user ID + timestamp server-side */}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Lecturer Alerts" && lectureHistory.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="font-bold text-lg text-[#212121]">Broadcast History ({lectureHistory.length})</p>
            <div className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden">
              {lectureHistory.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm lg:text-base text-[#212121] font-bold">{item.title || "Lecture alert"}</p>
                    <p className="text-xs text-[#9f9f9f]">{item.message} · {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Announcement" && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <p className="text-xs font-bold text-[#9f9f9f] tracking-wide uppercase">Broadcast History</p>
              <div className="flex flex-col gap-4">
                {announcementHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 flex flex-col gap-2 border border-[#f2f4f7]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-base text-[#212121]">{item.title || "Announcement"}</p>
                      </div>
                      <p className="text-xs text-[#9f9f9f] shrink-0">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-[#212121]">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[380px] shrink-0 bg-white border border-[#f2f4f7] rounded-2xl p-6 flex flex-col gap-5 h-fit">
              <div>
                <p className="font-bold text-lg text-[#212121]">New Announcement</p>
                <p className="text-sm text-[#9f9f9f]">Broadcast to all matching students</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-[#9f9f9f] tracking-wide uppercase">Quick templates</p>
                <div className="flex flex-wrap gap-2">
                  {announcementTemplates.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setAnnouncementTitle(t.label)}
                      className="flex items-center gap-1.5 bg-[#f6f6f6] hover:bg-[#efefef] text-xs font-medium text-[#212121] px-3 py-2 rounded-full"
                    >
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-[#9f9f9f] tracking-wide uppercase">Title</p>
                <input
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g. Important Class Update"
                  className="bg-[#f6f6f6] border border-[#f4f4f4] rounded-lg px-4 py-3 text-sm text-[#212121] placeholder:text-[#21212180] outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-[#9f9f9f] tracking-wide uppercase">Message</p>
                <textarea
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  placeholder="Write your announcement here, or pick a template"
                  className="bg-[#f6f6f6] border border-[#f4f4f4] rounded-lg px-4 py-3 text-sm text-[#212121] placeholder:text-[#21212180] outline-none min-h-[100px] resize-none"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-[#212121]">
                <input type="checkbox" className="accent-[#006dff]" defaultChecked />
                Push Alert to enrolled students
              </label>

              <button
                disabled={!announcementTitle || !announcementMessage || isSubmitting}
                onClick={() => submitAnnouncement({ type: "announcement", title: announcementTitle, message: announcementMessage })}
                className="w-full bg-[#f60] disabled:opacity-40 text-white text-sm font-bold py-3 rounded-xl"
              >
                Broadcast Announcement
              </button>
            </div>
          </div>
        )}

        {submitError && <p className="text-sm text-[#ff3b3b]">{submitError}</p>}

        {isAdHocModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsAdHocModalOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ad-hoc-alert-title"
              className="relative w-full max-w-[560px] max-h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-2xl p-6 flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close ad-hoc alert dialog"
                onClick={() => setIsAdHocModalOpen(false)}
                className="absolute top-5 right-5 text-[#9f9f9f] hover:text-[#212121]"
              >
                <X size={20} />
              </button>

              <div className="pr-8">
                <p id="ad-hoc-alert-title" className="font-bold text-xl text-[#212121]">Ad-hoc Alert</p>
                <p className="text-sm text-[#9f9f9f]">Not tied to a timetable class</p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="ad-hoc-subject" className="text-xs font-bold text-[#9f9f9f] tracking-wide uppercase">
                  Subject / Course (Optional)
                </label>
                <input
                  id="ad-hoc-subject"
                  value={adHocSubject}
                  onChange={(e) => setAdHocSubject(e.target.value)}
                  placeholder="e.g. MEE 401 Tutorial, Study Group, Lab Session..."
                  className="bg-[#f6f6f6] border border-[#f4f4f4] rounded-lg px-4 py-3 text-sm text-[#212121] placeholder:text-[#21212180] outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-[#9f9f9f] tracking-wide uppercase">Quick Templates</p>
                <div className="flex flex-wrap gap-2">
                  {adHocTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.label}
                        type="button"
                        onClick={() => setAdHocMessage(template.message)}
                        className="flex items-center gap-1.5 bg-[#f6f6f6] hover:bg-[#efefef] text-xs font-medium text-[#212121] px-3 py-2 rounded-full"
                      >
                        <Icon size={14} /> {template.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="ad-hoc-message" className="text-xs font-bold text-[#9f9f9f] tracking-wide uppercase">Your Message</label>
                <textarea
                  id="ad-hoc-message"
                  value={adHocMessage}
                  onChange={(e) => setAdHocMessage(e.target.value)}
                  placeholder="Write your alert here, or pick a template"
                  className="bg-[#f6f6f6] border border-[#f4f4f4] rounded-lg px-4 py-3 text-sm text-[#212121] placeholder:text-[#21212180] outline-none min-h-[120px] resize-none"
                />
                <p className="text-xs text-[#9f9f9f] text-right">{adHocMessage.length} chars</p>
              </div>

              <label className="flex items-center gap-2 text-sm text-[#212121]">
                <input
                  type="checkbox"
                  className="accent-[#006dff]"
                  checked={adHocPushAlert}
                  onChange={(e) => setAdHocPushAlert(e.target.checked)}
                />
                Push Alert to enrolled students
              </label>

              <button
                type="button"
                disabled={!adHocMessage.trim() || isSubmitting}
                onClick={async () => {
                  const submitted = await submitAnnouncement({
                    type: "lecture_alert",
                    title: adHocSubject.trim() || "Ad-hoc Alert",
                    message: adHocMessage,
                  });
                  if (submitted) {
                    setAdHocSubject("");
                    setAdHocMessage("");
                    setAdHocPushAlert(true);
                    setIsAdHocModalOpen(false);
                  }
                }}
                className="w-full bg-[#f60] disabled:opacity-40 text-white text-sm font-bold py-3 rounded-xl"
              >
                Send Alert
              </button>
            </div>
          </div>
        )}

        {activeTab === "Timetable" && (
          <div className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-6 border-b border-[#f2f4f7]">
              <div>
                <p className="font-bold text-lg text-[#212121]">Weekly Class Schedule</p>
                <p className="text-sm text-[#9f9f9f]">
                  500L Mechanical Engineering · Semester 1 · {weeklySchedule.length} classes
                </p>
              </div>
              <p className="text-xs text-[#9f9f9f]">Classes are added automatically via the WhatsApp bot.</p>
            </div>

            <div className="overflow-x-auto">
              <div className="flex items-center bg-[#fcfdfd] border-b border-[#f2f4f7] min-w-[600px]">
                {["Day", "Code", "Course", "Time", "Venue"].map((col) => (
                  <p key={col} className="flex-1 font-bold text-xs text-[#9f9f9f] tracking-wide uppercase px-6 py-4">
                    {col}
                  </p>
                ))}
              </div>

              <div className="min-w-[600px]">
                {weeklySchedule.map((c) => (
                  <div key={c.id} className="flex items-center border-b border-[#f2f4f7] last:border-b-0">
                    <p className="flex-1 text-sm text-[#9f9f9f] px-6 py-5">{c.day}</p>
                    <p className="flex-1 text-sm font-bold text-[#006dff] px-6 py-5">{c.code}</p>
                    <p className="flex-1 text-sm text-[#212121] px-6 py-5">{c.course}</p>
                    <p className="flex-1 text-sm text-[#212121] px-6 py-5">{c.time}</p>
                    <p className="flex-1 text-sm text-[#212121] px-6 py-5">{c.venue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}