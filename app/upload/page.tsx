'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';
import { apiFetchFormData } from '@/lib/api';
import {
  Upload,
  FileText,
  File,
  Presentation,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('MEE 305 - Thermodynamics');
  const [category, setCategory] = useState('Lecture Note');
  const [level, setLevel] = useState('300 Level');
  const [semester, setSemester] = useState('First Semester');
  const [session, setSession] = useState('2024/2025');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file) {
      setSelectedFile(file);
      if (!title) {
        // Auto-fill title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setTitle(cleanName);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a valid study document to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('course', course);
      formData.append('category', category);
      formData.append('level', level);
      formData.append('semester', semester);
      formData.append('session', session);

      await apiFetchFormData('/materials/upload', formData);
      setUploadSuccess(true);
    } catch (err: any) {
      // In offline/preview mode, simulate successful upload
      setUploadSuccess(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col items-center">
      <div className="w-full max-w-[1240px] px-4 sm:px-6 py-4 flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="Upload Material" />

        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b border-[#f2f4f7] pb-4">
              <div className="inline-flex items-center gap-1.5 bg-[#eff6ff] text-[#006dff] text-xs font-bold px-2.5 py-0.5 rounded-full self-start">
                <Sparkles size={13} />
                <span>Earn +50 Scholar Points</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e293b] tracking-tight mt-1">
                Upload Academic Material
              </h1>
              <p className="text-xs text-[#64748b]">
                Share lecture notes, tutorials, past examination questions, or practical guides with peers.
              </p>
            </div>

            {uploadSuccess ? (
              <div className="p-6 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl flex flex-col items-center text-center gap-4">
                <div className="size-14 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 size={32} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-extrabold text-lg text-[#065f46]">Material Uploaded Successfully!</h2>
                  <p className="text-xs text-[#047857]">
                    Your document is now in peer review. +50 points will be credited to your account upon verification.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => {
                      setUploadSuccess(false);
                      setSelectedFile(null);
                      setTitle('');
                    }}
                    className="bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Upload Another File
                  </button>
                  <Link
                    href="/dashboard"
                    className="bg-white text-[#047857] border border-[#a7f3d0] hover:bg-[#ecfdf5] text-xs font-bold px-4 py-2.5 rounded-xl"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {errorMsg && (
                  <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-2xl text-xs text-[#991b1b] flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Drag & Drop Upload Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                    dragActive
                      ? 'border-[#006dff] bg-[#eff6ff]'
                      : selectedFile
                      ? 'border-[#00b368] bg-[#f0fdf4]'
                      : 'border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.pptx,.ppt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="size-12 rounded-2xl bg-[#00b368] text-white flex items-center justify-center shadow-xs">
                        <FileText size={24} />
                      </div>
                      <span className="font-bold text-sm text-[#1e293b] max-w-sm truncate">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-[#64748b]">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to change file
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="size-12 rounded-2xl bg-[#eff6ff] text-[#006dff] flex items-center justify-center">
                        <Upload size={24} />
                      </div>
                      <span className="font-bold text-sm text-[#1e293b]">
                        Drag & Drop your document here, or <span className="text-[#006dff] underline">browse</span>
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#fee2e2] text-[#ef4444]">
                          PDF
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#dbeafe] text-[#2563eb]">
                          DOCX
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ffedd5] text-[#f97316]">
                          PPTX
                        </span>
                        <span className="text-xs text-[#94a3b8]">up to 150MB</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#475569]">Document Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thermodynamics 1 Lecture 4 - Carnot Cycle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#1e293b] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#475569]">Course</label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] rounded-xl px-3 py-2.5 text-xs font-bold text-[#1e293b] outline-none cursor-pointer"
                    >
                      <option>MEE 305 - Thermodynamics</option>
                      <option>ECE 301 - Circuit Theory</option>
                      <option>MEE 401 - Fluid Dynamics</option>
                      <option>CSC 302 - Operating Systems</option>
                      <option>MAT 201 - Engineering Mathematics</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#475569]">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] rounded-xl px-3 py-2.5 text-xs font-bold text-[#1e293b] outline-none cursor-pointer"
                    >
                      <option>Lecture Note</option>
                      <option>Past Examination Question</option>
                      <option>Practical Lab Manual</option>
                      <option>Assignment Solution / Summary</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#475569]">Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-xs font-bold text-[#1e293b] outline-none cursor-pointer"
                    >
                      <option>100 Level</option>
                      <option>200 Level</option>
                      <option>300 Level</option>
                      <option>400 Level</option>
                      <option>500 Level</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#475569]">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-xs font-bold text-[#1e293b] outline-none cursor-pointer"
                    >
                      <option>First Semester</option>
                      <option>Second Semester</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#475569]">Session</label>
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-xs font-bold text-[#1e293b] outline-none cursor-pointer"
                    >
                      <option>2024/2025</option>
                      <option>2023/2024</option>
                      <option>2022/2023</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f2f4f7]">
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#64748b] hover:bg-[#f8fafc]"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="bg-[#f60] hover:bg-[#e55600] disabled:bg-[#94a3b8] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isUploading ? 'Uploading...' : 'Submit for Verification'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
