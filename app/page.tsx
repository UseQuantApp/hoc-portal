import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Quant | Your campus life, rewarded",
  description:
    "Quant is the student portal that turns your academic work into points and rewards. Upload materials, track grades and CGPA, follow your timetable and climb the leaderboard.",
};

export default function WelcomePage() {
  return <LandingPage />;
}
