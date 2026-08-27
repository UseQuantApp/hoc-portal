"use client";

import Image from "next/image";
import { Bell, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Uploads", href: "/uploads" },
  { label: "HOC Hub", href: "/hoc-hub" },
  { label: "Rewards", href: "/rewards" },
  { label: "Account", href: "/account" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [fullName, setFullName] = useState("");

useEffect(() => {
  async function loadUser() {
    try {
      const res = await apiFetch("/students/me");
      setFullName(res.data.fullName || "");
    } catch (err) {
      console.error("Failed to load user for navbar:", err);
    }
  }
  loadUser();
}, []);
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-8">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 lg:w-8 lg:h-8">
            <Image src="/images/logo-icon.png" alt="Quant logo" fill className="object-contain" />
          </div>
          <span className="text-xl lg:text-3xl font-medium text-[#212121]">Quant</span>
        </div>
        <p className="text-xs lg:hidden text-[#212121]">Campus Scholar Portal Access</p>
      </div>

<nav className="hidden lg:flex items-center gap-6">
  {navItems.map((item) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.label}
        href={item.href}
        className={
          isActive
            ? "bg-[#f60] text-white px-3.5 py-3 rounded-lg text-lg"
            : "text-[#9f9f9f] text-lg hover:text-[#212121] dark:hover:text-white transition-colors"
        }
      >
        {item.label}
      </Link>
    );
  })}
</nav>

      <div className="flex items-center gap-3.5">
        <button className="hidden lg:flex size-10 rounded-lg bg-[#efefef] border border-[#212121] items-center justify-center">
          <Bell size={16} />
        </button>
        <button className="lg:hidden size-10 rounded-lg bg-[#f60] flex items-center justify-center">
          <Bell size={16} className="text-white" />
        </button>
        {/**
        <button className="hidden lg:flex size-10 rounded-lg bg-[#efefef] border border-[#212121] items-center justify-center">
          <Moon size={16} />
        </button>
        */}
        <div className="hidden lg:flex items-center gap-2.5">
          <div className="relative size-12 rounded-lg border border-[#212121] overflow-hidden bg-[#d9d9d9]">
            <Image src="/images/avatar-user.png" alt="Akorede" fill className="object-cover" />
          </div>
          <div>
         <p className="font-bold text-lg text-[#212121]">{fullName || "..."}</p>
       <p className="text-sm text-[#212121]">Campus Scholar</p>
     </div>
        </div>
      </div>
    </div>
  );
}