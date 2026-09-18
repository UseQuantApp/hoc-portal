"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Image from "next/image";
import { ChevronDown, AlertTriangle, Upload, Check } from "lucide-react";
import { apiFetchFormData } from "@/lib/api";

const levels = ["100", "200", "300", "400", "500"];
const semesters = ["first", "second"];
const categories = [
  { value: "lecture_note", label: "Lecture Notes" },
  { value: "exam_summary", label: "Exam Summary" },
  { value: "past_question", label: "Past Question" },
  { value: "other", label: "Other" },
];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [session, setSession] = useState("2024/2025");
  const [creditUnits, setCreditUnits] = useState("3");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleCourseCodeChange = (value: string) => {
    setCourseCode(value);
    const digits = value.match(/\d+/);
    if (digits) {
      const lastDigit = Number(digits[0][digits[0].length - 1]);
      setSemester(lastDigit % 2 === 0 ? "second" : "first");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }, []);

  const isValid = file && title && courseCode && department && category;

  const handleSubmit = async () => {
    if (!isValid) return;
    setUploadError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("title", title);
      formData.append("courseCode", courseCode);
      formData.append("courseTitle", courseName);
      formData.append("university", "LASU");
      formData.append("department", department);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("session", session);
      formData.append("semester", semester);
      formData.append("creditUnits", creditUnits);
      formData.append("tags", tags);

      await apiFetchFormData("/documents/mine", formData);
      router.push("/uploads");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1100px] lg:max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[700px] lg:max-w-[900px] flex flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-4 lg:gap-5">
          <p className="font-bold text-[#212121] text-base lg:text-xl">Upload Document</p>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`bg-white border border-dashed rounded-2xl h-[200px] lg:h-[240px] flex flex-col items-center justify-center gap-1 px-5 py-4.5 cursor-pointer transition-colors ${
              isDragging ? "border-[#006dff] bg-[#f4f9ff]" : "border-[#ebeef2]"
            }`}
          >
            <input
              type="file"
              accept=".doc,.docx,.pdf,.pptx"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            />
            {file ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-center size-16 lg:size-20 rounded-full bg-[#006dff]">
                  <Check size={32} className="lg:w-10 lg:h-10 text-white" />
                </div>
                <p className="text-sm lg:text-base font-semibold text-[#006dff]">{file.name}</p>
                <p className="text-xs lg:text-sm text-[#9f9f9f]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
                </p>
              </div>
            ) : (
              <>
                <Image src="/images/upload-icon.svg" alt="" width={28} height={28} />
                <p className="text-sm lg:text-base text-[#212121] mt-2">
                  Drag and Drop a file, or click to browse
                </p>
                <p className="text-xs lg:text-sm text-[#909dad] text-center">
                  Accepted file types: DOC, PDF, PPTX
                  <br />
                  Max size: 300MB per file
                </p>
              </>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-4 lg:gap-5">
          <p className="font-bold text-[#212121] text-base lg:text-xl">Document Details</p>

          <div className="flex flex-col gap-6 lg:gap-5">
            <Field label="Title*">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Engineering Thermodynamics Week 1 Lecture Notes"
                className="w-full bg-transparent outline-none text-base text-[#212121] placeholder:text-[#21212180]"
              />
            </Field>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-5">
              <Field label="Course Code*">
                <input
                  value={courseCode}
                  onChange={(e) => handleCourseCodeChange(e.target.value)}
                  placeholder="e.g. MEE 401"
                  className="w-full bg-transparent outline-none text-base text-[#212121] placeholder:text-[#21212180]"
                />
              </Field>

              <Field label="Course Name">
                <input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Thermodynamics"
                  className="w-full bg-transparent outline-none text-base text-[#212121] placeholder:text-[#21212180]"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-5">
              <Field label="Department*">
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Mechanical engineering"
                  className="w-full bg-transparent outline-none text-base text-[#212121] placeholder:text-[#21212180]"
                />
              </Field>

              <Field label="Level">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-transparent outline-none text-base text-[#212121] appearance-none cursor-pointer"
                >
                  <option value="">Select Level</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>{l} Level</option>
                  ))}
                </select>
                <ChevronDown size={20} className="text-[#212121] shrink-0" />
              </Field>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-5">
              <Field label="Semester">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-transparent outline-none text-base text-[#212121] appearance-none cursor-pointer"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>{s === "first" ? "1st Semester" : "2nd Semester"}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="text-[#212121] shrink-0" />
              </Field>

              <Field label="Tags">
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. thermodynamics, heat transfer, MEE401"
                  className="w-full bg-transparent outline-none text-base text-[#212121] placeholder:text-[#21212180]"
                />
              </Field>
            </div>

            <Field label="Category*">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent outline-none text-base text-[#212121] appearance-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <ChevronDown size={20} className="text-[#212121] shrink-0" />
            </Field>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-5">
              <Field label="Session">
                <input
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  placeholder="e.g. 2024/2025"
                  className="w-full bg-transparent outline-none text-base text-[#212121] placeholder:text-[#21212180]"
                />
              </Field>

              <Field label="Credit Units">
                <input
                  type="number"
                  value={creditUnits}
                  onChange={(e) => setCreditUnits(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full bg-transparent outline-none text-base text-[#212121] placeholder:text-[#21212180]"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="bg-[#fff6f0] border-[0.6px] border-[#b64a03] rounded-xl flex gap-3 items-start px-4 py-3 lg:px-5 lg:py-4">
          <AlertTriangle size={20} className="text-[#b64a03] shrink-0 mt-0.5" />
          <p className="text-sm lg:text-base text-[#b64a03] flex-1">
            Be specific with your tags — include course code, topics, and keywords. The more relevant tags you add, the easier students can find this material.
          </p>
        </div>

        {uploadError && (
          <p className="text-xs font-bold text-[#ff3b3b] text-center">{uploadError}</p>
        )}

        <div className="flex flex-col lg:flex-row-reverse gap-4">
          <button
            onClick={handleSubmit}
            disabled={!isValid || isUploading}
            className="bg-[#006dff] disabled:opacity-50 rounded-xl py-3 lg:px-10 text-lg text-white flex items-center justify-center gap-2 lg:flex-1"
          >
            <Upload size={18} />
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
          <button className="bg-white border border-[#e5e5e5] rounded-lg py-3 lg:px-10 text-lg text-[#212121] capitalize lg:flex-1">
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 w-full">
      <p className="text-base text-[#212121]">{label}</p>
      <div className="bg-[#f6f6f6] border-[1.5px] border-[#f4f4f4] rounded-xl px-4 py-3.5 flex items-center justify-between">
        {children}
      </div>
    </div>
  );
}