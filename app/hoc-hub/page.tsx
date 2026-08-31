'use client';

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { Radio, AlertCircle, MessageSquare, Send, Bell, CheckCircle2, Megaphone } from 'lucide-react';

const classBroadcasts = [
  {
    id: 1,
    sender: 'HOC - Fashola Ridwan',
    department: 'Mechanical Engineering (400 Level)',
    time: '35 mins ago',
    title: 'Urgent: Continuous Assessment Test MEE 401 Postponement',
    content:
      'Good afternoon colleagues. Prof. Adebayo just notified the class executives that tomorrow\'s test has been shifted to Friday 10:00 AM at LT1 due to the Faculty accreditation exercise. Please inform your study groups accordingly.',
    priority: 'High',
    pinned: true,
  },
  {
    id: 2,
    sender: 'Assistant HOC - Funke Olawale',
    department: 'Mechanical Engineering (400 Level)',
    time: 'Yesterday, 04:15 PM',
    title: 'Submission of Thermal Engineering Lab Worksheets',
    content:
      'Please ensure all signed group lab sheets are collated and submitted to the HOC desk before 2:00 PM tomorrow. Late submissions will attract a 5-mark penalty.',
    priority: 'Normal',
    pinned: false,
  },
  {
    id: 3,
    sender: 'Course Rep - ECE 301',
    department: 'Electrical Engineering Cross-Enrolled',
    time: '2 days ago',
    title: 'Lecture Slide Compilation & Tutorial Solutions Available',
    content:
      'All 8 modules of Circuit Theory slides are now uploaded to the Quant Portal. Check the Courses section or download directly from the document archive.',
    priority: 'Normal',
    pinned: false,
  },
];

export default function HocHubPage() {
  const [messages, setMessages] = useState(classBroadcasts);
  const [newMsg, setNewMsg] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');

  const handlePostBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;

    const newBroadcast = {
      id: Date.now(),
      sender: 'HOC Executive Desk',
      department: 'Mechanical Engineering (400 Level)',
      time: 'Just now',
      title: broadcastTitle,
      content: broadcastContent,
      priority: 'Normal',
      pinned: false,
    };

    setMessages([newBroadcast, ...messages]);
    setBroadcastTitle('');
    setBroadcastContent('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col items-center">
      <div className="w-full max-w-[1240px] px-4 sm:px-6 py-4 flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="Head of Class (HOC) Hub" />

        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          {/* Header - strictly NO search bar per constraint */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2f4f7] pb-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-[#eff6ff] text-[#006dff] flex items-center justify-center shrink-0">
                <Radio size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e293b] tracking-tight">
                  Head of Class (HOC) Announcement Hub
                </h1>
                <p className="text-xs text-[#64748b]">
                  Verified department executive updates, timetable alterations, and lecture hall changes
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="bg-[#f60] hover:bg-[#e55600] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Megaphone size={15} />
              <span>Broadcast Update</span>
            </button>
          </div>

          {/* Broadcasts Feed */}
          <div className="flex flex-col gap-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col gap-3 ${
                  item.pinned
                    ? 'bg-[#eff6ff]/50 border-[#bfdbfe]'
                    : 'bg-[#f8fafc]/50 border-[#f2f4f7] hover:bg-[#f8fafc]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#006dff] bg-white px-2.5 py-1 rounded-lg border border-[#dbeafe] shadow-2xs">
                      {item.sender}
                    </span>
                    <span className="text-[11px] text-[#64748b]">{item.department}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.priority === 'High' && (
                      <span className="bg-[#fef2f2] text-[#ef4444] border border-[#fecaca] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        HIGH PRIORITY
                      </span>
                    )}
                    <span className="text-[11px] text-[#94a3b8]">{item.time}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="font-extrabold text-base text-[#1e293b]">{item.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed whitespace-pre-line">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for new broadcast */}
        {showBroadcastModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#f2f4f7] pb-3">
                <h3 className="font-extrabold text-lg text-[#1e293b]">Issue Executive Class Broadcast</h3>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="text-[#94a3b8] hover:text-[#1e293b] text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePostBroadcast} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#475569]">Subject / Header</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MEE 305 Tutorial Relocation"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] rounded-xl px-3.5 py-2 text-xs text-[#1e293b] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#475569]">Announcement Body</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide exact details, room number, or assignment instructions..."
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#006dff] rounded-xl p-3 text-xs text-[#1e293b] outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748b] hover:bg-[#f8fafc] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#f60] hover:bg-[#e55600] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer"
                  >
                    Publish to Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
