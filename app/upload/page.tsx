"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/dashboard/Navbar";
import Image from "next/image";
import { ChevronDown, AlertTriangle, Upload } from "lucide-react";

const levels = ["100", "200", "300", "400", "500"];
const semesters = ["1st Semester", "2nd Semester"];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [tags, setTags] = useState("");

  const handleCourseCodeChange = (value: string) => {
    setCourseCode(value);
    const digits = value.match(/\d+/);
    if (digits) {
      const lastDigit = Number(digits[0][digits[0].length - 1]);
      setSemester(lastDigit % 2 === 0 ? "2nd Semester" : "1st Semester");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }, []);

  const isValid = file && title && courseCode && department;

  const handleSubmit = async () => {
    if (!isValid) return;
    // TODO: backend — upload `file` + form fields to the upload API,
    // show processing loader, then route to success/review overlay per the AI validation flow
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
            <Image src="/images/upload-icon.svg" alt="" width={28} height={28} />
            <p className="text-sm lg:text-base text-[#212121] mt-2">
              {file ? file.name : "Drag and Drop a file, or click to browse"}
            </p>
            <p className="text-xs lg:text-sm text-[#909dad] text-center">
              Accepted file types: DOC, PDF, PPTX
              <br />
              Max size: 300MB per file
            </p>
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
                    <option key={s} value={s}>{s}</option>
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
          </div>
        </div>

        <div className="bg-[#fff6f0] border-[0.6px] border-[#b64a03] rounded-xl flex gap-3 items-start px-4 py-3 lg:px-5 lg:py-4">
          <AlertTriangle size={20} className="text-[#b64a03] shrink-0 mt-0.5" />
          <p className="text-sm lg:text-base text-[#b64a03] flex-1">
            Be specific with your tags — include course code, topics, and keywords. The more relevant tags you add, the easier students can find this material.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-4">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-[#006dff] disabled:opacity-50 rounded-xl py-3 lg:px-10 text-lg text-white flex items-center justify-center gap-2 lg:flex-1"
          >
            <Upload size={18} />
            Upload Document
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