"use client";

import Image from "next/image";
import { Bell, Menu, X, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export interface NavbarProps {
  showBackButton?: boolean;
  backHref?: string;
  title?: string;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Uploads", href: "/uploads" },
  { label: "HOC Hub", href: "/hoc-hub" },
  { label: "Rewards", href: "/rewards" },
  { label: "Account", href: "/account" },
];

export default function Navbar({
  showBackButton = false,
  backHref = "/dashboard",
  title,
}: NavbarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("quant_token");
    sessionStorage.clear();
    router.push("/");
  };

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
    <header className="w-full relative z-40">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-8">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Link
                href={backHref}
                className="size-8 rounded-lg bg-[#f4f4f4] hover:bg-[#e8e8e8] flex items-center justify-center text-[#212121] shrink-0 transition-colors mr-1"
                title="Back"
              >
                <ArrowLeft size={16} />
              </Link>
            )}

            <Link href="/dashboard" className="flex flex-col group">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 lg:w-8 lg:h-8">
                  <Image
                    src="/images/logo-icon.png"
                    alt="Quant logo"
                    fill
                    className="object-contain"
                  />
                </div>

                <span className="text-xl lg:text-3xl font-medium text-[#212121]">
                  Quant
                </span>
              </div>
              <span className="text-[10px] lg:text-xs text-[#21212180] leading-none mt-1">
                Campus Scholar Portal Access
              </span>
            </Link>

            {title && (
              <span className="hidden sm:inline-block text-xs font-bold text-[#21212180] border-l border-[#f4f4f4] pl-2.5 ml-2 self-center">
                {title}
              </span>
            )}
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={
                  isActive
                    ? "bg-[#f60] text-white px-3.5 py-3 rounded-lg text-lg font-medium"
                    : "text-[#9f9f9f] text-lg hover:text-[#212121] transition-colors"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            className="hidden lg:flex size-10 rounded-lg bg-[#efefef] border border-[#212121] items-center justify-center cursor-pointer hover:bg-[#e5e5e5] transition-colors"
            title="Notifications"
          >
            <Bell size={16} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden lg:flex size-10 rounded-lg bg-[#efefef] border border-[#212121] items-center justify-center cursor-pointer hover:bg-[#ffebee] hover:text-[#ff3b3b] hover:border-[#ff3b3b] transition-colors"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut size={16} />
          </button>

          <button
            type="button"
            className="lg:hidden size-10 rounded-lg bg-[#f60] flex items-center justify-center cursor-pointer"
            title="Notifications"
          >
            <Bell size={16} className="text-white" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden size-10 rounded-lg bg-[#efefef] border border-[#212121] flex items-center justify-center cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link href="/account" className="hidden lg:flex items-center gap-2.5">
            <div className="relative size-12 rounded-lg border border-[#212121] overflow-hidden bg-[#d9d9d9]">
              <Image
                src="/images/avatar-user.png"
                alt="Akorede"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-bold text-lg text-[#212121]">
                {fullName || "..."}
              </p>

              <p className="text-sm text-[#212121]">Campus Scholar</p>
            </div>
          </Link>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-[#f2f4f7] bg-white rounded-2xl p-4 shadow-lg flex flex-col gap-2">
          <div className="flex items-center gap-3 pb-3 border-b border-[#f2f4f7]">
            <div className="relative size-10 rounded-lg border border-[#212121] overflow-hidden bg-[#d9d9d9]">
              <Image
                src="/images/avatar-user.png"
                alt="Akorede"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-base text-[#212121]">{fullName || "Campus Scholar"}</p>
              <p className="text-xs text-[#21212180]">Campus Scholar Portal Access</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-center text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#f60] text-white"
                      : "bg-[#fbfbfb] text-[#212121] hover:bg-[#f4f4f4]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl text-center text-sm font-bold text-[#ff3b3b] bg-[#fff1f1] hover:bg-[#ffe5e5] transition-colors w-full cursor-pointer mt-1"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </header>
  );
}
