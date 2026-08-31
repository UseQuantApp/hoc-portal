'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/dashboard/Navbar';
import {
  Pencil,
  Coins,
  TrendingUp,
  ChevronDown,
  Award,
  Bell,
  Settings,
  User,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const sidebarItems = [
  { label: 'Overview', icon: User },
  { label: 'Badges & Achievements', icon: Award },
  { label: 'Notifications & Activity', icon: Bell },
  { label: 'Account Settings', icon: Settings },
];

const badgeCategoryNames: Record<string, string> = {
  upload_milestones: 'Upload Milestones',
  streak_achievements: 'Streak Achievements',
  rank_prestige: 'Rank & Prestige',
  special_recognition: 'Special Recognition',
  social_impact: 'Social Impact',
};

const activityFeed = [
  {
    id: 1,
    text: 'You Earned +50 pts for uploading MEE 401 Notes',
    time: '2 hrs ago',
    unread: true,
  },
  {
    id: 2,
    text: 'Your MEE 305 Solution Pack was verified by the HOC',
    time: '5 hrs ago',
    unread: true,
  },
  {
    id: 3,
    text: 'You unlocked the 3-Day Contributor Streak badge',
    time: '1 day ago',
    unread: false,
  },
  {
    id: 4,
    text: 'Your uploaded past questions reached 100 downloads',
    time: '2 days ago',
    unread: false,
  },
  {
    id: 5,
    text: 'You Earned +100 bonus pts for monthly top 10 rank',
    time: '3 days ago',
    unread: false,
  },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [badgeFilter, setBadgeFilter] = useState<'All' | 'Earned' | 'Locked'>('All');

  const [surname, setSurname] = useState('');
  const [otherName, setOtherName] = useState('');
  const [matric, setMatric] = useState('');
  const [dept, setDept] = useState('');
  const [settingsLevel, setSettingsLevel] = useState('400');
  const [email, setEmail] = useState('');

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const [badges, setBadges] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      points: number;
      earned: boolean;
    }>
  >([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiFetch('/students/me');
        const student = res.data;

        if (student) {
          const nameParts = (student.fullName || '').split(' ');
          setSurname(nameParts[0] || '');
          setOtherName(nameParts.slice(1).join(' ') || '');
          setMatric(student.matricNumber || '');
          setDept(student.department || '');
          setSettingsLevel(student.level || '400');
          setEmail(student.email || '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    apiFetch('/badges/mine')
      .then((res) => {
        const badgeList = res.data ?? res;
        if (Array.isArray(badgeList)) {
          setBadges(badgeList);
        } else {
          // Default initial set if backend returns empty or formatted structure
          setBadges([
            { id: '1', name: 'First Upload', description: 'Uploaded your first study material', category: 'upload_milestones', points: 50, earned: true },
            { id: '2', name: '5 Study Packs', description: 'Uploaded 5 verified packs', category: 'upload_milestones', points: 250, earned: true },
            { id: '3', name: '3-Day Streak', description: 'Active 3 consecutive days', category: 'streak_achievements', points: 150, earned: true },
            { id: '4', name: 'Campus Top 20', description: 'Entered campus top 20 rank', category: 'rank_prestige', points: 250, earned: true },
            { id: '5', name: 'Century Scholar', description: 'Upload 20+ study materials', category: 'upload_milestones', points: 500, earned: false },
            { id: '6', name: '7-Day Streak', description: 'Active 7 consecutive days', category: 'streak_achievements', points: 300, earned: false },
            { id: '7', name: 'Honor Society', description: 'Top 5 campus rank holder', category: 'rank_prestige', points: 1000, earned: false },
            { id: '8', name: 'HOC Verified Contributor', description: 'Official departmental recognition', category: 'special_recognition', points: 500, earned: false },
          ]);
        }
      })
      .catch((err) => {
        console.error('Failed to load badges:', err);
        // Fallback default badges
        setBadges([
          { id: '1', name: 'First Upload', description: 'Uploaded your first study material', category: 'upload_milestones', points: 50, earned: true },
          { id: '2', name: '5 Study Packs', description: 'Uploaded 5 verified packs', category: 'upload_milestones', points: 250, earned: true },
          { id: '3', name: '3-Day Streak', description: 'Active 3 consecutive days', category: 'streak_achievements', points: 150, earned: true },
          { id: '4', name: 'Campus Top 20', description: 'Entered campus top 20 rank', category: 'rank_prestige', points: 250, earned: true },
          { id: '5', name: 'Century Scholar', description: 'Upload 20+ study materials', category: 'upload_milestones', points: 500, earned: false },
          { id: '6', name: '7-Day Streak', description: 'Active 7 consecutive days', category: 'streak_achievements', points: 300, earned: false },
          { id: '7', name: 'Honor Society', description: 'Top 5 campus rank holder', category: 'rank_prestige', points: 1000, earned: false },
          { id: '8', name: 'HOC Verified Contributor', description: 'Official departmental recognition', category: 'special_recognition', points: 500, earned: false },
        ]);
      });
  }, []);

  const handleSaveProfile = async () => {
    setSaveStatus('saving');

    try {
      await apiFetch('/students/me', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: `${surname} ${otherName}`.trim(),
          department: dept,
          level: settingsLevel,
        }),
      });

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
      console.error('Failed to update student profile:', err);
    }
  };

  const earnedCount = badges.filter((b) => b.earned).length;
  const badgePoints = badges.filter((b) => b.earned).reduce((acc, b) => acc + (b.points || 0), 0);
  const completionPercentage = badges.length > 0 ? Math.round((earnedCount / badges.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-white text-[#212121] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-12 lg:px-16 py-6 lg:py-8">
      {/* 1. Navbar */}
      <div className="w-full max-w-[1312px]">
        <Navbar showBackButton backHref="/dashboard" title="Scholar Account & Settings" />
      </div>

      {/* 2. Search and Filter Bar */}
      <div className="w-full max-w-[1312px] flex items-center gap-3 sm:gap-4">
        <div className="bg-white border border-[#f2f4f7] flex-1 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-xs">
          <input
            placeholder="Search materials, courses..."
            className="w-full text-sm sm:text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
          />
        </div>

        <button className="hidden lg:block bg-white border border-[#f2f4f7] rounded-2xl px-5 py-3.5 text-[#212121] text-sm font-bold shadow-xs hover:bg-[#fbfbfb] transition-colors shrink-0">
          All levels
        </button>

        <button className="hidden lg:block bg-white border border-[#f2f4f7] rounded-2xl px-5 py-3.5 text-[#212121] text-sm font-bold shadow-xs hover:bg-[#fbfbfb] transition-colors shrink-0">
          All Semester
        </button>
      </div>

      {/* 3. Main Account Layout: Sidebar / Tabs + Content */}
      <div className="w-full max-w-[1312px] flex flex-col lg:flex-row gap-6">
        {/* Sidebar for Desktop / Scrollable Bar for Mobile */}
        <aside className="w-full lg:w-[260px] shrink-0 flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#006dff] text-white shadow-xs'
                    : 'text-[#21212180] hover:text-[#212121] hover:bg-[#fbfbfb]'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* Profile Card */}
              <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row gap-6 relative">
                <button
                  onClick={() => setActiveTab('Account Settings')}
                  className="absolute top-6 right-6 size-8 rounded-xl bg-[#fbfbfb] border border-[#f2f4f7] hover:bg-[#f4f4f4] text-[#21212180] hover:text-[#212121] flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Profile"
                >
                  <Pencil size={15} />
                </button>

                <div className="relative size-20 sm:size-24 rounded-full overflow-hidden bg-[#e5e5e5] shrink-0 border-2 border-white shadow-xs">
                  <Image
                    src="/images/avatar-user.png"
                    alt="Profile avatar"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <h2 className="font-bold text-xl sm:text-2xl text-[#212121]">
                      {isLoadingProfile ? (
                        <span className="inline-block w-48 h-7 bg-[#f4f4f4] rounded-lg animate-pulse" />
                      ) : (
                        `${surname} ${otherName}`.trim() || 'Scholar Student'
                      )}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="bg-[#eff7ff] text-[#006dff] text-xs font-bold px-3 py-1 rounded-full">
                        Campus Scholar
                      </span>

                      <span className="bg-[#e6f9f0] text-[#00b368] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        ● Verified Contributor
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#21212180] mt-2">
                      {dept || 'Engineering'} · {settingsLevel ? `${settingsLevel}L` : '400L'} · {matric || 'Matric Pending'}
                    </p>
                  </div>

                  <div className="flex items-center gap-8 mt-2 pt-3 border-t border-[#f2f4f7]">
                    <div>
                      <p className="text-xs text-[#21212180] flex items-center gap-1 font-medium">
                        <Coins size={14} className="text-[#f60]" />
                        Tokens
                      </p>
                      <p className="font-bold text-base sm:text-lg text-[#212121]">
                        4,500
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#21212180] flex items-center gap-1 font-medium">
                        <TrendingUp size={14} className="text-[#006dff]" />
                        Rank
                      </p>
                      <p className="font-bold text-base sm:text-lg text-[#212121]">
                        12th
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#21212180] font-medium">
                        Honor Badge
                      </p>
                      <span className="text-xl">
                        🏅
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contribution Overview */}
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-lg text-[#212121]">
                    Contribution Overview
                  </h3>
                  <p className="text-xs text-[#21212180]">
                    Your verified study uploads are helping students learn faster.
                  </p>
                </div>

                <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#f2f4f7] shadow-xs overflow-hidden">
                  <div className="p-6">
                    <p className="text-xs font-medium text-[#21212180]">
                      Materials Uploaded
                    </p>
                    <p className="font-bold text-2xl text-[#212121] mt-1">
                      25 <span className="text-xs font-normal text-[#21212180]">files</span>
                    </p>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-medium text-[#21212180]">
                      Downloads
                    </p>
                    <p className="font-bold text-2xl text-[#212121] mt-1">
                      800 <span className="text-xs font-normal text-[#21212180]">downloads</span>
                    </p>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-medium text-[#21212180]">
                      Average Rating
                    </p>
                    <p className="font-bold text-2xl text-[#212121] mt-1">
                      4.5 <span className="text-xs font-normal text-[#21212180]">out of 5.0</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Rewards & Points */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg text-[#212121]">
                  Rewards & Points
                </h3>

                <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 shadow-xs flex flex-col gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-2xl sm:text-3xl text-[#006dff]">
                      4,500
                    </span>
                    <span className="text-sm font-medium text-[#21212180]">
                      Quant points
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#212121]">
                        Progress to Tier 2 Milestone
                      </span>
                      <span className="text-[#21212180]">
                        Goal: 5,500 pts
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#f4f4f4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00b368] rounded-full"
                        style={{ width: '75%' }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#21212180]">
                      <span>Keep uploading to unlock more departmental rewards</span>
                      <span>1,000 pts to next reward · 75%</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button className="bg-[#f60] hover:bg-[#e55600] text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl flex-1 shadow-xs transition-colors cursor-pointer">
                      Redeem Rewards
                    </button>

                    <button className="bg-white border border-[#f4f4f4] hover:bg-[#fbfbfb] text-[#212121] text-xs sm:text-sm font-bold py-3 px-6 rounded-xl flex-1 transition-colors cursor-pointer">
                      Reward History
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: BADGES & ACHIEVEMENTS */}
          {activeTab === 'Badges & Achievements' && (
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#f2f4f7] shadow-xs overflow-hidden">
                <div className="p-6">
                  <p className="text-xs font-medium text-[#21212180]">
                    Badges Earned
                  </p>
                  <p className="font-bold text-2xl text-[#212121] mt-1">
                    {earnedCount}
                  </p>
                </div>

                <div className="p-6">
                  <p className="text-xs font-medium text-[#21212180]">
                    Points from Badges
                  </p>
                  <p className="font-bold text-2xl text-[#f60] mt-1">
                    {badgePoints.toLocaleString()}
                  </p>
                </div>

                <div className="p-6">
                  <p className="text-xs font-medium text-[#21212180]">
                    Completion
                  </p>
                  <p className="font-bold text-2xl text-[#212121] mt-1">
                    {completionPercentage}%
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-[#fbfbfb] border border-[#f2f4f7] rounded-xl p-1 w-fit">
                {(['All', 'Earned', 'Locked'] as const).map((f) => {
                  const count = badges.filter(
                    (b) => f === 'All' || (f === 'Earned' ? b.earned : !b.earned)
                  ).length;
                  return (
                    <button
                      key={f}
                      onClick={() => setBadgeFilter(f)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        badgeFilter === f
                          ? 'bg-[#006dff] text-white shadow-2xs'
                          : 'text-[#21212180] hover:text-[#212121]'
                      }`}
                    >
                      {f} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Categorized Badges */}
              {Object.entries(badgeCategoryNames).map(([categoryKey, categoryName]) => {
                const filtered = badges.filter(
                  (b) =>
                    b.category === categoryKey &&
                    (badgeFilter === 'All'
                      ? true
                      : badgeFilter === 'Earned'
                      ? b.earned
                      : !b.earned)
                );

                if (filtered.length === 0) return null;

                return (
                  <div key={categoryKey} className="flex flex-col gap-3">
                    <h4 className="font-bold text-base text-[#212121]">
                      {categoryName}
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {filtered.map((badge) => (
                        <div
                          key={badge.id}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all ${
                            badge.earned
                              ? 'bg-[#fff6f0] border-[#ffd0aa] shadow-2xs'
                              : 'bg-[#fbfbfb] border-[#f2f4f7] opacity-60'
                          }`}
                        >
                          <div className="size-12 rounded-full bg-white flex items-center justify-center text-xl shadow-2xs border border-[#f4f4f4]">
                            {badge.earned ? '🏅' : <Lock size={18} className="text-[#21212180]" />}
                          </div>

                          <p className="text-xs font-bold text-[#212121] leading-tight">
                            {badge.name}
                          </p>

                          <p className="text-[10px] text-[#21212180]">
                            {badge.description || `+${badge.points} pts`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS & ACTIVITY */}
          {activeTab === 'Notifications & Activity' && (
            <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-[#f2f4f7]">
                <h3 className="font-bold text-lg text-[#212121]">Activity & History</h3>
                <p className="text-xs text-[#21212180]">Track milestone alerts, material reviews, and points</p>
              </div>

              <div className="divide-y divide-[#f2f4f7]">
                {activityFeed.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#fbfbfb] transition-colors"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs sm:text-sm font-bold text-[#212121]">
                        {item.text}
                      </p>
                      <p className="text-[11px] text-[#21212180]">
                        {item.time}
                      </p>
                    </div>

                    {item.unread && (
                      <span className="size-2.5 rounded-full bg-[#006dff] ring-4 ring-[#eff7ff] shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT SETTINGS */}
          {activeTab === 'Account Settings' && (
            <div className="bg-white border border-[#f2f4f7] rounded-2xl lg:rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-lg text-[#212121]">
                  Edit Profile Information
                </h3>
                <p className="text-xs text-[#21212180]">
                  Update your institutional details and full legal name
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Surname"
                  value={surname}
                  onChange={setSurname}
                  placeholder="e.g. Ogunmapon"
                />

                <TextField
                  label="First Name & Other Name"
                  value={otherName}
                  onChange={setOtherName}
                  placeholder="e.g. Adewale"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Matric Number"
                  value={matric}
                  onChange={setMatric}
                  disabled
                />

                <TextField
                  label="Department"
                  value={dept}
                  onChange={setDept}
                  placeholder="e.g. Mechanical Engineering"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectFieldSmall
                  label="Level"
                  value={settingsLevel}
                  onChange={setSettingsLevel}
                  options={['100', '200', '300', '400', '500']}
                />

                <TextField
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  disabled
                />
              </div>

              {saveStatus === 'saved' && (
                <div className="p-4 bg-[#e6f9f0] border border-[#a7f3d0] rounded-xl flex items-center gap-2 text-xs font-bold text-[#00b368]">
                  <CheckCircle2 size={16} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {saveStatus === 'error' && (
                <div className="p-4 bg-[#fee2e2] border border-[#fecaca] rounded-xl flex items-center gap-2 text-xs font-bold text-[#ef4444]">
                  <AlertCircle size={16} />
                  <span>Failed to save profile changes. Please try again.</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('Overview')}
                  className="bg-white border border-[#f4f4f4] hover:bg-[#fbfbfb] text-[#212121] text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="bg-[#f60] hover:bg-[#e55600] disabled:opacity-50 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs sm:text-sm font-bold text-[#212121]">
        {label}
      </label>

      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#fbfbfb] border border-[#f4f4f4] focus:border-[#006dff] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-[#212121] placeholder:text-[#21212180] outline-none disabled:opacity-60 transition-colors"
      />
    </div>
  );
}

function SelectFieldSmall({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs sm:text-sm font-bold text-[#212121]">
        {label}
      </label>

      <div className="bg-[#fbfbfb] border border-[#f4f4f4] rounded-xl px-4 py-3 flex items-center justify-between">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-xs sm:text-sm font-bold text-[#212121] appearance-none cursor-pointer"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt} Level
            </option>
          ))}
        </select>

        <ChevronDown size={16} className="text-[#21212180] shrink-0 pointer-events-none" />
      </div>
    </div>
  );
}
