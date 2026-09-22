"use client";

import { Search } from "lucide-react";
import { useState } from "react";

// NEW: optional props so a parent page can "own" the search value and react to it.
// Pages that don't pass these still work exactly as before (falls back to local state).
type PageFiltersProps = {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
};

export default function PageFilters({ searchQuery, onSearchChange }: PageFiltersProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const isControlled = onSearchChange !== undefined;
  const currentSearch = isControlled ? (searchQuery ?? "") : internalSearch;

  const handleSearchChange = (value: string) => {
    if (isControlled) {
      onSearchChange?.(value);
    } else {
      setInternalSearch(value);
    }
  };

  const [selectedLevel, setSelectedLevel] = useState("All levels");
  const [selectedSemester, setSelectedSemester] = useState("All Semester");

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <div className="bg-white rounded-xl px-3 lg:px-4 py-3 flex items-center gap-2.5 flex-1 min-w-[160px] border border-[#e5e5e5]">
        <Search size={18} className="text-[#9f9f9f] shrink-0" />
        <input
          value={currentSearch}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search materials, courses..."
          className="w-full text-sm lg:text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
        />
      </div>

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