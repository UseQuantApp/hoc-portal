"use client";

import Image from "next/image";
import { Bell, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { logoutStudent } from "@/lib/auth";
import PageFilters from "@/components/dashboard/PageFilters";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Uploads", href: "/uploads" },
  { label: "Rewards", href: "/rewards" },
  { label: "Account", href: "/account" },
];

const mobileNavItems = navItems;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutStudent(router.push);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
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
            ? "bg-[#f60] text-white px-3.5 py-2.5 rounded-xl text-lg font-normal shadow-sm transition-all duration-200"
            : "relative text-[#9f9f9f] text-lg font-normal px-3.5 py-2.5 rounded-xl transition-all duration-200 hover:text-[#212121] hover:bg-[#fff4eb] hover:shadow-[inset_0_0_0_1px_rgba(255,102,0,0.12)]"
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
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden size-10 rounded-lg bg-[#efefef] border border-[#212121] flex items-center justify-center"
        >
          <Menu size={20} />
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
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#212121]/30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <aside
            aria-label="Mobile navigation"
            className="ml-auto flex h-full w-[min(86vw,360px)] flex-col bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-[#212121]">Menu</p>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsMenuOpen(false)}
                className="flex size-10 items-center justify-center rounded-lg text-[#212121] hover:bg-[#f6f6f6]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 border-b border-[#ececec] pb-5">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-[#212121] bg-[#d9d9d9]">
                <Image src="/images/avatar-user.png" alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="font-bold text-base text-[#212121]">{fullName || "..."}</p>
                <p className="text-sm text-[#212121]">Campus Scholar</p>
              </div>
            </div>

            <nav className="mt-5 flex flex-col gap-2">
              {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={
                      isActive
                        ? "rounded-xl bg-[#f60] px-4 py-3 text-base font-normal text-white"
                        : "rounded-xl px-4 py-3 text-base font-normal text-[#212121] hover:bg-[#fff4eb]"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="mt-auto rounded-xl bg-[#fff1f0] px-4 py-3 text-left text-base text-[#d92d20] transition-colors hover:bg-[#ffe4e2] disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </aside>
        </div>
      )}
      <PageFilters />
    </div>
  );
}