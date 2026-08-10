// PLACEHOLDER DATA — backend dev: replace each of these with a real API fetch.

export const placeholderUploads: {
  id: number;
  title: string;
  size: string;
  type: "doc" | "pdf";
  course: string;
  date: string;
  status: "In Review" | "Approved" | "Rejected";
  points: string;
}[] = [
  { id: 1, title: "Thermodynamics 1 .doc", size: "120 Mb", type: "doc", course: "ECE 301", date: "2024-12-01", status: "In Review", points: "0 pts (In review)" },
  { id: 2, title: "Thermodynamics 1 .pdf", size: "150 Mb", type: "pdf", course: "MEE 305", date: "2024-11-28", status: "Approved", points: "300 pts" },
  { id: 3, title: "Thermodynamics 1 .doc", size: "120 Mb", type: "doc", course: "MEE 305", date: "2024-12-02", status: "Rejected", points: "0 pts" },
  { id: 4, title: "Thermodynamics 1", size: "50 Mb", type: "pdf", course: "MEE 305", date: "2024-11-25", status: "Approved", points: "300 pts" },
  { id: 5, title: "Thermodynamics 1 .pdf", size: "150 Mb", type: "pdf", course: "MEE 305", date: "2024-12-02", status: "In Review", points: "0 pts (In review)" },
];

export const placeholderWins: { id: number; text: string; time: string; icon: 1 | 2 }[] = [
  { id: 1, text: "You Earned +50 pts for uploading MEE 401 Notes", time: "2 hrs ago", icon: 1 },
  { id: 2, text: "You Earned +50 pts for uploading MEE 401 Notes", time: "2 hrs ago", icon: 2 },
  { id: 3, text: "You Earned +50 pts for uploading MEE 401 Notes", time: "2 hrs ago", icon: 1 },
  { id: 4, text: "You Earned +50 pts for uploading MEE 401 Notes", time: "2 hrs ago", icon: 2 },
  { id: 5, text: "You Earned +50 pts for uploading MEE 401 Notes", time: "2 hrs ago", icon: 1 },
  { id: 6, text: "You Earned +50 pts for uploading MEE 401 Notes", time: "2 hrs ago", icon: 1 },
];

export const placeholderProgress = {
  totalUploaded: 200,
  pointsEarned: 4500,
  pointsAway: 1000,
  ringValue: "5,500",
  weeks: [
    { label: "T1", points: 2500, active: true },
    { label: "T2", points: 5500, active: true },
    { label: "T3", points: 8500, active: false },
    { label: "T4", points: 12500, active: false },
    { label: "T5", points: 12500, active: false },
    { label: "T6", points: 12500, active: false },
    { label: "T7", points: 12500, active: false },
  ],
};

export const placeholderLeaderboard = [
  { name: "Olasunkanmi Abdul Molik", tier: "T 32", materials: 200, points: "13,000", medal: "/images/medal-gold.svg", avatar: "/images/leaderboard-avatar-1.png", isYou: false },
  { name: "Marcus Johnson", tier: "T 32", materials: 200, points: "12,500", medal: "/images/medal-silver.svg", avatar: "/images/leaderboard-avatar-2.png", isYou: false },
  { name: "Akorede Habeebullah (you)", tier: "T 32", materials: 200, points: "12,000", medal: "/images/medal-bronze.svg", avatar: "/images/leaderboard-avatar-3.png", isYou: true },
  { name: "Priya Patel", tier: "T 32", materials: 200, points: "11,000", medal: null, rank: 4, avatar: "/images/leaderboard-avatar-4.png", isYou: false },
];

export const fullUploadsData = [
  { id: 1, title: "Thermodynamics 1 .doc", size: "120 Mb", type: "doc", course: "ECE 301", date: "2024-12-01", status: "In Review", points: "0 pts (In review)" },
  { id: 2, title: "Thermodynamics 1 .pdf", size: "150 Mb", type: "pdf", course: "MEE 305", date: "2024-11-28", status: "Approved", points: "300 pts" },
  { id: 3, title: "Thermodynamics 1 .pdf", size: "150 Mb", type: "pdf", course: "MEE 305", date: "2024-11-28", status: "Rejected", points: "0 pts" },
  { id: 4, title: "Thermodynamics 1 .pdf", size: "150 Mb", type: "pdf", course: "MEE 305", date: "2024-11-28", status: "Approved", points: "300 pts" },
  { id: 5, title: "Thermodynamics 1 .pdf", size: "150 Mb", type: "pdf", course: "MEE 305", date: "2024-11-28", status: "Approved", points: "300 pts" },
  { id: 6, title: "Thermodynamics 1 .doc", size: "120 Mb", type: "doc", course: "MEE 305", date: "2024-12-02", status: "Approved", points: "0 pts" },
  { id: 7, title: "Thermodynamics 1", size: "50 Mb", type: "pptx", course: "MEE 305", date: "2024-11-25", status: "Approved", points: "300 pts" },
  { id: 8, title: "Thermodynamics 1 .pdf", size: "150 Mb", type: "pdf", course: "MEE 305", date: "2024-12-02", status: "In Review", points: "0 pts (In review)" },
  { id: 9, title: "Thermodynamics 1 .pdf", size: "150 Mb", type: "pdf", course: "MEE 305", date: "2024-12-02", status: "In Review", points: "0 pts (In review)" },
  { id: 10, title: "Thermodynamics 1 .pdf", size: "150 Mb", type: "pdf", course: "MEE 305", date: "2024-12-02", status: "In Review", points: "0 pts (In review)" },
];