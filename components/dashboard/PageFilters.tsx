"use client";

import { useState } from "react";

export default function PageFilters() {
  const [selectedLevel, setSelectedLevel] = useState("All levels");
  const [selectedSemester, setSelectedSemester] = useState("All Semester");

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 w-full">
      <select
        value={selectedLevel}
        onChange={(event) => setSelectedLevel(event.target.value)}
        aria-label="Filter by level"
        className="bg-white rounded-xl px-3 lg:px-4 py-3 text-[#212121] text-sm lg:text-base flex-1 lg:flex-none min-w-0 outline-none border border-[#e5e5e5]"
      >
        <option value="All levels">All levels</option>
        <option value="100">100 level</option>
        <option value="200">200 level</option>
        <option value="300">300 level</option>
        <option value="400">400 level</option>
        <option value="500">500 level</option>
      </select>
      <select
        value={selectedSemester}
        onChange={(event) => setSelectedSemester(event.target.value)}
        aria-label="Filter by semester"
        className="bg-white rounded-xl px-3 lg:px-4 py-3 text-[#212121] text-sm lg:text-base flex-1 lg:flex-none min-w-0 outline-none border border-[#e5e5e5]"
      >
        <option value="All Semester">All Semester</option>
        <option value="1st Semester">1st Semester</option>
        <option value="2nd Semester">2nd Semester</option>
      </select>
    </div>
  );
}