"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/dashboard/Navbar";
import { Pencil, Coins, TrendingUp, ChevronDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

const sidebarItems = ["Overview", "Badges & Achievements", "Notifications & Activity", "Account Settings"];

const badgeCategoryNames: Record<string, string> = {
  upload_milestones: "Upload Milestones",
  streak_achievements: "Streak Achievements",
  rank_prestige: "Rank & Prestige",
  special_recognition: "Special Recognition",
  social_impact: "Social Impact",
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [badgeFilter, setBadgeFilter] = useState<"All" | "Earned" | "Locked">("All");

  const [surname, setSurname] = useState("");
  const [otherName, setOtherName] = useState("");
  const [matric, setMatric] = useState("");
  const [dept, setDept] = useState("");
  const [settingsLevel, setSettingsLevel] = useState("");
  const [email, setEmail] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [badges, setBadges] = useState<Array<{ id: string; name: string; description: string; category: string; points: number; earned: boolean }>>([]);
  const [pointsSummary, setPointsSummary] = useState({ points: 0, tokens: 0, lifetimePointsEarned: 0, uploadStreakDays: 0 });
  const [rankValue, setRankValue] = useState("Unranked");
  const [activity, setActivity] = useState<Array<{ id: string; description: string; createdAt: string }>>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiFetch("/students/me");
        const student = res.data ?? res;
        const nameParts = (student.fullName || "").split(" ");
        setSurname(nameParts[0] || "");
        setOtherName(nameParts.slice(1).join(" ") || "");
        setMatric(student.matricNumber || "");
        setDept(student.department || "");
        setSettingsLevel(student.level || "");
        setEmail(student.email || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    async function loadOverviewData() {
      try {
        const [pointsResponse, leaderboardResponse] = await Promise.all([
          apiFetch("/points/mine"),
          apiFetch("/leaderboard?limit=20"),
        ]);

        const summary = pointsResponse.data ?? pointsResponse;
        setPointsSummary({
          points: Number(summary.points ?? 0),
          tokens: Number(summary.tokens ?? 0),
          lifetimePointsEarned: Number(summary.lifetimePointsEarned ?? 0),
          uploadStreakDays: Number(summary.uploadStreakDays ?? 0),
        });

        const leaderboard = leaderboardResponse.data ?? leaderboardResponse;
        const me = leaderboard.me ?? null;
        setRankValue(me?.rank ? `#${me.rank}` : "Unranked");
      } catch (err) {
        console.error("Failed to load overview data:", err);
      }
    }

    loadOverviewData();
  }, []);

  useEffect(() => {
    async function loadBadges() {
      try {
        const res = await apiFetch("/badges/mine");
        setBadges(res.data ?? res);
      } catch (err) {
        console.error("Failed to load badges:", err);
      }
    }

    loadBadges();
  }, []);

  useEffect(() => {
    if (activeTab !== "Notifications & Activity") return;

    async function loadActivity() {
      try {
        const res = await apiFetch("/points/mine/history");
        setActivity(res.data ?? res ?? []);
      } catch (err) {
        console.error("Failed to load activity:", err);
        setActivity([]);
      }
    }

    loadActivity();
  }, [activeTab]);

  const earnedBadges = badges.filter((badge) => badge.earned);
  const totalBadgePoints = earnedBadges.reduce((sum, badge) => sum + Number(badge.points ?? 0), 0);
  const badgeCompletion = badges.length > 0 ? Math.round((earnedBadges.length / badges.length) * 100) : 0;

  const handleSaveProfile = async () => {
    setSaveStatus("saving");
    try {
      await apiFetch("/students/me", {
        method: "PATCH",
        body: JSON.stringify({
          fullName: `${surname} ${otherName}`.trim(),
          department: dept,
          level: settingsLevel,
        }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      setSaveStatus("error");
      console.error(err);
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

      <div className="w-full max-w-[1312px] flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-[220px] shrink-0 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`text-left px-4 py-3 rounded-lg text-sm lg:text-base transition-colors ${
                activeTab === item ? "bg-[#006dff] text-white" : "text-[#212121] hover:bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-6">
          {activeTab === "Overview" && (
            <>
              <div className="bg-white border border-[#f2f4f7] rounded-2xl p-6 flex flex-col lg:flex-row gap-6 relative">
                <button className="absolute top-6 right-6 text-[#9f9f9f]">
                  <Pencil size={18} />
                </button>

                <div className="relative size-20 lg:size-24 rounded-full overflow-hidden bg-[#d9d9d9] shrink-0">
                  <Image src="/images/avatar-user.png" alt="Profile avatar" fill className="object-cover" />
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <p className="font-bold text-xl lg:text-2xl text-[#212121]">
                      {isLoadingProfile ? "Loading..." : `${surname} ${otherName}`.trim() || "—"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="bg-[#eff7ff] text-[#006dff] text-xs font-bold px-3 py-1 rounded-full">
                        Campus Scholar
                      </span>
                      <span className="bg-[#e6f9f0] text-[#00b368] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        ● Verified Contributor
                      </span>
                    </div>
                    <p className="text-sm text-[#9f9f9f] mt-2">
                      {dept || "—"} · {settingsLevel ? `${settingsLevel}L` : "—"} · {matric || "—"}
                    </p>
                  </div>

                  <div className="flex items-center gap-8 mt-2">
                    <div>
                      <p className="text-xs text-[#9f9f9f] flex items-center gap-1">
                        <Coins size={14} /> Tokens
                      </p>
                      <p className="font-bold text-lg text-[#212121]">4,500</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#9f9f9f] flex items-center gap-1">
                        <TrendingUp size={14} /> Rank
                      </p>
                      <p className="font-bold text-lg text-[#212121]">12th</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#9f9f9f]">Badge</p>
                      <span className="text-2xl">🏅</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-bold text-lg text-[#212121]">Contribution Overview</p>
                  <p className="text-sm text-[#9f9f9f]">Your uploads are helping students learn faster.</p>
                </div>
                <div className="bg-white border border-[#f2f4f7] rounded-2xl grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#f2f4f7]">
                  <div className="p-6">
                    <p className="text-sm text-[#9f9f9f]">Materials Uploaded</p>
                    <p className="font-bold text-2xl text-[#212121]">
                      25 <span className="text-sm font-normal text-[#9f9f9f]">files</span>
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-[#9f9f9f]">Downloads</p>
                    <p className="font-bold text-2xl text-[#212121]">
                      800 <span className="text-sm font-normal text-[#9f9f9f]">Downloads</span>
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-[#9f9f9f]">Average Rating</p>
                    <p className="font-bold text-2xl text-[#212121]">
                      4.5 <span className="text-sm font-normal text-[#9f9f9f]">out of 5.0</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-bold text-lg text-[#212121]">Rewards &amp; Points</p>
                <div className="bg-white border border-[#f2f4f7] rounded-2xl p-6 flex flex-col gap-4">
                  <p className="font-bold text-2xl text-[#212121]">
                    {pointsSummary.points.toLocaleString()} <span className="text-base font-normal text-[#9f9f9f]">Quant points</span>
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#212121]">Progress to Next reward tier</span>
                      <span className="text-[#9f9f9f]">Goal: 5,500 pts</span>
                    </div>
                    <div className="w-full h-2 bg-[#f2f4f7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00b368] rounded-full" style={{ width: "75%" }} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#9f9f9f]">Keep uploading to unlock more rewards</span>
                      <span className="text-[#9f9f9f]">1,000 pts to next reward · 75%</span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-3">
                    <button className="bg-[#006dff] text-white text-sm font-bold py-3 rounded-xl flex-1">
                      Redeem Rewards
                    </button>
                    <button className="bg-white border border-[#e5e5e5] text-[#212121] text-sm py-3 rounded-xl flex-1">
                      Reward History
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "Badges & Achievements" && (
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-[#f2f4f7] rounded-2xl grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#f2f4f7]">
                <div className="p-6">
                  <p className="text-sm text-[#9f9f9f]">Badges Earned</p>
                  <p className="font-bold text-2xl text-[#212121]">{earnedBadges.length}</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#9f9f9f]">Points from Badges</p>
                  <p className="font-bold text-2xl text-[#f60]">{totalBadgePoints}</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#9f9f9f]">Completion</p>
                  <p className="font-bold text-2xl text-[#212121]">{badgeCompletion}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-fit bg-white rounded-lg p-1">
                {(["All", "Earned", "Locked"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setBadgeFilter(f)}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      badgeFilter === f ? "bg-[#006dff] text-white" : "text-[#212121] hover:bg-[#f6f6f6]"
                    }`}
                  >
                    {f} ({badges.filter((b) => f === "All" || (f === "Earned" ? b.earned : !b.earned)).length})
                  </button>
                ))}
              </div>

              {Object.entries(badgeCategoryNames).map(([categoryKey, categoryName]) => {
                const filtered = badges.filter((b) =>
                  b.category === categoryKey &&
                  (badgeFilter === "All" ? true : badgeFilter === "Earned" ? b.earned : !b.earned)
                );
                if (filtered.length === 0) return null;

                return (
                  <div key={categoryKey} className="flex flex-col gap-3">
                    <p className="font-bold text-base text-[#212121]">{categoryName}</p>
                    <div className="flex flex-wrap gap-4">
                      {filtered.map((badge, i) => (
                        <div
                          key={i}
                          className={`w-[140px] flex flex-col items-center gap-2 p-4 rounded-xl border text-center ${
                            badge.earned ? "bg-[#fff6f0] border-[#ffd0aa]" : "bg-[#f6f6f6] border-[#ececec] opacity-50"
                          }`}
                        >
                          <div className="size-12 rounded-full bg-white flex items-center justify-center text-xl">
                            {badge.earned ? "🏅" : "🔒"}
                          </div>
                          <p className="text-xs font-bold text-[#212121]">{badge.name}</p>
                          <p className="text-[10px] text-[#9f9f9f]">{badge.description || `${badge.points} pts`}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "Notifications & Activity" && (
            <div className="bg-white border border-[#f2f4f7] rounded-2xl overflow-hidden">
              {activity.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-[#9f9f9f]">No activity yet</div>
              ) : (
                activity.map((item) => (
                  <div key={item.id || `${item.description}-${item.createdAt}`} className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#f2f4f7] last:border-b-0">
                    <div>
                      <p className="text-sm lg:text-base text-[#212121]">{item.description}</p>
                      <p className="text-xs text-[#9f9f9f]">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Account Settings" && (
            <div className="bg-white border border-[#f2f4f7] rounded-2xl p-6 flex flex-col gap-6">
              <p className="font-bold text-lg text-[#212121]">Edit Profile Info</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TextField label="Surname" value={surname} onChange={setSurname} placeholder="e.g Ogunmapon" />
                <TextField label="First Name & other Name" value={otherName} onChange={setOtherName} placeholder="e.g Adewale" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TextField label="Matric Number" value={matric} onChange={setMatric} disabled />
                <TextField label="Department" value={dept} onChange={setDept} placeholder="e.g Mechanical engineering" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SelectFieldSmall
                  label="Level"
                  value={settingsLevel}
                  onChange={setSettingsLevel}
                  options={["100", "200", "300", "400", "500"]}
                />
                <TextField label="Email" value={email} onChange={setEmail} disabled />
              </div>

              {saveStatus === "saved" && <p className="text-sm text-[#00b368] font-bold">Saved!</p>}
              {saveStatus === "error" && <p className="text-sm text-[#ff3b3b] font-bold">Failed to save.</p>}

              <div className="flex flex-col lg:flex-row gap-3 lg:justify-end">
                <button className="bg-white border border-[#e5e5e5] text-[#212121] text-sm font-bold px-6 py-3 rounded-xl">
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === "saving"}
                  className="bg-[#006dff] disabled:opacity-50 text-white text-sm font-bold px-6 py-3 rounded-xl"
                >
                  {saveStatus === "saving" ? "Saving..." : "Save Changes"}
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
      <label className="text-sm text-[#212121]">{label}</label>
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#f6f6f6] border border-[#f4f4f4] rounded-xl px-4 py-3 text-sm text-[#212121] placeholder:text-[#21212180] outline-none disabled:opacity-60"
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
      <label className="text-sm text-[#212121]">{label}</label>
      <div className="bg-[#f6f6f6] border border-[#f4f4f4] rounded-xl px-4 py-3 flex items-center justify-between">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-[#212121] appearance-none cursor-pointer"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={16} className="text-[#212121] shrink-0" />
      </div>
    </div>
  );
}