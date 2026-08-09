"use client";

import Image from "next/image";
import { Bell, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const navItems = [
  { label: "Dashboard", active: true },
  { label: "Uploads", active: false },
  { label: "Rewards", active: false },
  { label: "Account", active: false },
];

export default function Navbar() {
  const { toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-8">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 lg:w-8 lg:h-8">
            <Image src="/images/logo-icon.png" alt="Quant logo" fill className="object-contain" />
          </div>
          <span className="text-xl lg:text-3xl font-medium text-[#212121] dark:text-white">Quant</span>
        </div>
        <p className="text-xs lg:hidden text-[#212121] dark:text-[#c5c8cf]">Campus Scholar Portal Access</p>
      </div>

      <nav className="hidden lg:flex items-center gap-6">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={
              item.active
                ? "bg-[#f60] text-white px-3.5 py-3 rounded-lg text-lg"
                : "text-[#9f9f9f] text-lg hover:text-[#212121] dark:hover:text-white transition-colors"
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3.5">
        <button className="hidden lg:flex size-10 rounded-lg bg-[#efefef] dark:bg-[#2a2e37] border border-[#212121] dark:border-[#3a3f4a] items-center justify-center">
          <Bell size={16} className="dark:text-white" />
        </button>
        <button className="lg:hidden size-10 rounded-lg bg-[#f60] flex items-center justify-center">
          <Bell size={16} className="text-white" />
        </button>
        <button
          onClick={toggleTheme}
          className="hidden lg:flex size-10 rounded-lg bg-[#efefef] dark:bg-[#2a2e37] border border-[#212121] dark:border-[#3a3f4a] items-center justify-center"
        >
          <Moon size={16} className="dark:text-white" />
        </button>
        <div className="hidden lg:flex items-center gap-2.5">
          <div className="relative size-12 rounded-lg border border-[#212121] dark:border-[#3a3f4a] overflow-hidden bg-[#d9d9d9]">
            <Image src="/images/avatar-user.png" alt="Akorede" fill className="object-cover" />
          </div>
          <div>
            <p className="font-bold text-lg text-[#212121] dark:text-white">Akorede</p>
            <p className="text-sm text-[#212121] dark:text-[#c5c8cf]">Campus Scholar</p>
          </div>
        </div>
      </div>
    </div>
  );
}