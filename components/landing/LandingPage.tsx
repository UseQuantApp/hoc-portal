"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  FileUp,
  Gift,
  GraduationCap,
  Menu,
  MessageCircle,
  Sparkles,
  Trophy,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

const departments = [
  "Mechanical Engineering",
  "Electronic and Computer Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Industrial Engineering",
  "Aerospace Engineering",
];

const features = [
  {
    icon: FileUp,
    title: "Upload & earn",
    body: "Share lecture notes, past questions and slides. Every approved upload adds points to your balance.",
    tint: "from-[#f60]/15 to-[#f60]/0",
    iconBg: "bg-[#f60]",
    span: "lg:col-span-2",
  },
  {
    icon: Gift,
    title: "Real rewards",
    body: "Trade your points for rewards from the Quant catalog.",
    tint: "from-[#006dff]/15 to-[#006dff]/0",
    iconBg: "bg-[#006dff]",
    span: "",
  },
  {
    icon: GraduationCap,
    title: "Grades & CGPA",
    body: "See every result and your running CGPA in one clean view.",
    tint: "from-[#006dff]/15 to-[#006dff]/0",
    iconBg: "bg-[#006dff]",
    span: "",
  },
  {
    icon: CalendarClock,
    title: "Your timetable",
    body: "Know exactly where your next class is, without digging through group chats.",
    tint: "from-[#f60]/15 to-[#f60]/0",
    iconBg: "bg-[#f60]",
    span: "",
  },
  {
    icon: BookOpen,
    title: "Courses & assignments",
    body: "Enroll in courses, track assignments and tick them off as you finish.",
    tint: "from-[#006dff]/15 to-[#006dff]/0",
    iconBg: "bg-[#006dff]",
    span: "",
  },
  {
    icon: Trophy,
    title: "Leaderboard & badges",
    body: "Climb the campus leaderboard, unlock badges and see how you stack up against your coursemates.",
    tint: "from-[#f60]/15 to-[#006dff]/10",
    iconBg: "bg-gradient-to-br from-[#f60] to-[#006dff]",
    span: "lg:col-span-2",
  },
];

const steps = [
  {
    icon: Sparkles,
    title: "Create your account",
    body: "Sign up with your school email, pick your department and level, and verify with a one-time code.",
  },
  {
    icon: Zap,
    title: "Contribute & stay on track",
    body: "Upload useful materials, keep up with assignments and earn points as you go.",
  },
  {
    icon: Award,
    title: "Redeem & rise",
    body: "Spend points on rewards, collect badges and climb the leaderboard.",
  },
];

const leaders = [
  { avatar: "/images/leaderboard-avatar-1.png", name: "Student A", dept: "Mechanical", pts: 2480, pct: 100 },
  { avatar: "/images/leaderboard-avatar-2.png", name: "Student B", dept: "Aerospace", pts: 2115, pct: 85 },
  { avatar: "/images/leaderboard-avatar-3.png", name: "Student C", dept: "Civil", pts: 1890, pct: 76 },
  { avatar: "/images/leaderboard-avatar-4.png", name: "Student D", dept: "Chemical", pts: 1540, pct: 62 },
];

/** Adds `is-visible` to every [data-reveal] element once it scrolls into view. */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Counts up from 0 to `to` the first time the element becomes visible. */
function CountUp({ to, duration = 1600 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(eased * to));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#leaderboard", label: "Leaderboard" },
    { href: "#whatsapp", label: "WhatsApp" },
  ];

  return (
    <div className="ql-root relative min-h-screen overflow-x-clip bg-[#fbfbfb] text-[#212121]">
      <style>{landingCss}</style>

      {/* ------------------------------------------------------------------ Nav */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/75 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative h-8 w-8">
              <Image src="/images/logo-icon.png" alt="Quant logo" fill className="object-contain" sizes="32px" priority />
            </span>
            <span className="text-2xl font-bold tracking-tight">Quant</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="ql-underline text-sm text-[#212121]/70 transition-colors hover:text-[#212121]">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/sign-in" className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#006dff] transition-colors hover:bg-[#006dff]/10">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="ql-shine group relative overflow-hidden rounded-xl bg-[#f60] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(255,102,0,0.7)] transition-transform hover:-translate-y-0.5"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-[#212121] lg:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="ql-drop mx-4 mb-4 flex flex-col gap-1 rounded-2xl border border-black/5 bg-white/95 p-4 shadow-xl backdrop-blur-xl lg:hidden">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-base">
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/sign-in" className="rounded-xl border border-[#006dff]/30 py-3 text-center font-bold text-[#006dff]">
                Sign in
              </Link>
              <Link href="/sign-up" className="rounded-xl bg-[#f60] py-3 text-center font-bold text-white">
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ----------------------------------------------------------------- Hero */}
      <section className="relative px-6 pb-20 pt-32 lg:pb-32 lg:pt-40">
        {/* backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <div className="ql-grid absolute inset-0" />
          <div className="ql-blob ql-blob-a absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#006dff]/25 blur-3xl" />
          <div className="ql-blob ql-blob-b absolute -right-24 top-40 h-[380px] w-[380px] rounded-full bg-[#f60]/25 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span
              data-reveal
              className="ql-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-[#006dff]/20 bg-white/70 px-4 py-1.5 text-xs font-bold text-[#006dff] backdrop-blur lg:text-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f60] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f60]" />
              </span>
              Now live for LASU Faculty of Engineering
            </span>

            <h1
              data-reveal
              style={{ "--d": "80ms" } as React.CSSProperties}
              className="ql-reveal text-[42px] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[76px]"
            >
              Your campus life,
              <br />
              <span className="ql-gradient-text">rewarded.</span>
            </h1>

            <p
              data-reveal
              style={{ "--d": "160ms" } as React.CSSProperties}
              className="ql-reveal mt-6 max-w-[520px] text-base leading-relaxed text-[#212121]/70 lg:text-lg"
            >
              Quant turns the work you already do into points you can actually spend. Share materials, keep up with
              classes, track your CGPA and climb the leaderboard, all in one portal.
            </p>

            <div
              data-reveal
              style={{ "--d": "240ms" } as React.CSSProperties}
              className="ql-reveal mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              <Link
                href="/sign-up"
                className="ql-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#f60] px-8 py-4 text-base font-bold text-white shadow-[0_16px_40px_-12px_rgba(255,102,0,0.75)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(255,102,0,0.9)]"
              >
                Create free account
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-[#212121]/10 bg-white/70 px-8 py-4 text-base font-bold text-[#212121] backdrop-blur transition-all hover:-translate-y-1 hover:border-[#006dff]/40 hover:text-[#006dff]"
              >
                I already have an account
              </Link>
            </div>

            <div
              data-reveal
              style={{ "--d": "320ms" } as React.CSSProperties}
              className="ql-reveal mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {leaders.map((l) => (
                  <span key={l.avatar} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#fbfbfb]">
                    <Image src={l.avatar} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                ))}
              </div>
              <p className="text-left text-sm text-[#212121]/60">
                Join your coursemates already
                <br />
                <span className="font-bold text-[#212121]">earning on Quant</span>
              </p>
            </div>
          </div>

          {/* hero visual: floating card stack */}
          <div data-reveal style={{ "--d": "200ms" } as React.CSSProperties} className="ql-reveal-scale relative mx-auto h-[440px] w-full max-w-[460px] sm:h-[500px]">
            <div className="ql-ring absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#006dff]/25 sm:h-[440px] sm:w-[440px]" />

            {/* main points card */}
            <div className="ql-float absolute left-1/2 top-1/2 w-[290px] -translate-x-1/2 -translate-y-1/2 sm:w-[320px]">
              <div className="relative overflow-hidden rounded-3xl bg-[#006dff] p-6 text-white shadow-[0_30px_80px_-20px_rgba(0,109,255,0.65)]">
                <div className="ql-sheen absolute inset-0" />
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#f60]/30 blur-2xl" />
                <div className="relative flex items-center justify-between">
                  <span className="text-sm text-white/70">Total points</span>
                  <span className="relative h-9 w-9">
                    <Image src="/images/points-icon.png" alt="" fill sizes="36px" className="object-contain" />
                  </span>
                </div>
                <p className="relative mt-3 text-5xl font-bold tracking-tight">
                  <CountUp to={2480} />
                </p>
                <div className="relative mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">
                  <TrendingUp size={12} /> +320 this week
                </div>
                <div className="relative mt-6">
                  <div className="mb-2 flex justify-between text-xs text-white/70">
                    <span>Next reward</span>
                    <span>83%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/20">
                    <div className="ql-bar h-full rounded-full bg-gradient-to-r from-[#ffb27a] to-[#f60]" style={{ "--w": "83%" } as React.CSSProperties} />
                  </div>
                </div>
              </div>
            </div>

            {/* chip: upload approved */}
            <div className="ql-float-alt absolute left-0 top-6 sm:-left-4">
              <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.25)] backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f9f0] text-[#12b76a]">
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold">Upload approved</p>
                  <p className="text-[11px] text-[#212121]/50">MEE 301 notes · +50 pts</p>
                </div>
              </div>
            </div>

            {/* chip: cgpa */}
            <div className="ql-float absolute right-0 top-16 sm:-right-2" style={{ animationDelay: "-2s" }}>
              <div className="rounded-2xl border border-black/5 bg-white/90 px-4 py-3 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.25)] backdrop-blur">
                <p className="text-[11px] text-[#212121]/50">Current CGPA</p>
                <p className="text-2xl font-bold text-[#006dff]">4.52</p>
              </div>
            </div>

            {/* chip: badge */}
            <div className="ql-float-alt absolute bottom-10 right-2 sm:-right-6" style={{ animationDelay: "-1s" }}>
              <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.25)] backdrop-blur">
                <span className="relative h-9 w-9">
                  <Image src="/images/medal-gold.svg" alt="" fill sizes="36px" />
                </span>
                <div>
                  <p className="text-xs font-bold">Badge unlocked</p>
                  <p className="text-[11px] text-[#212121]/50">Top contributor</p>
                </div>
              </div>
            </div>

            {/* chip: rank */}
            <div className="ql-float absolute bottom-4 left-4 sm:left-0" style={{ animationDelay: "-3s" }}>
              <div className="flex items-center gap-2 rounded-2xl bg-[#f60] px-4 py-3 text-white shadow-[0_16px_40px_-12px_rgba(255,102,0,0.7)]">
                <Trophy size={18} />
                <span className="text-sm font-bold">#1 on the leaderboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Marquee */}
      <section aria-label="Departments on Quant" className="relative border-y border-black/5 bg-white py-6">
        <div className="ql-marquee-mask overflow-hidden">
          <div className="ql-marquee flex w-max gap-12">
            {[...departments, ...departments].map((d, i) => (
              <span key={`${d}-${i}`} className="flex items-center gap-12 whitespace-nowrap text-lg font-bold text-[#212121]/35 lg:text-2xl">
                {d}
                <span className="h-2 w-2 rounded-full bg-[#f60]" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Features */}
      <section id="features" className="scroll-mt-24 px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-16 max-w-[640px] text-center">
            <p data-reveal className="ql-reveal mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#f60]">
              Everything in one place
            </p>
            <h2 data-reveal style={{ "--d": "80ms" } as React.CSSProperties} className="ql-reveal text-3xl font-bold tracking-tight lg:text-5xl">
              Built for how students <span className="text-[#006dff]">actually</span> study
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <article
                key={f.title}
                data-reveal
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
                className={`ql-reveal ql-card group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-7 ${f.span}`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${f.tint} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <span
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${f.iconBg}`}
                >
                  <f.icon size={22} />
                </span>
                <h3 className="relative mt-6 text-xl font-bold">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-[#212121]/60 lg:text-base">{f.body}</p>
                <ArrowRight
                  size={18}
                  className="absolute right-7 top-7 -translate-x-2 text-[#212121]/30 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- How it works */}
      <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden bg-[#0b1220] px-6 py-24 text-white lg:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="ql-grid-dark absolute inset-0" />
          <div className="ql-blob ql-blob-a absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-[#006dff]/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1200px]">
          <div className="mx-auto mb-20 max-w-[640px] text-center">
            <p data-reveal className="ql-reveal mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#ff9a4d]">
              How it works
            </p>
            <h2 data-reveal style={{ "--d": "80ms" } as React.CSSProperties} className="ql-reveal text-3xl font-bold tracking-tight lg:text-5xl">
              Three steps from sign-up to <span className="ql-gradient-text-light">rewards</span>
            </h2>
          </div>

          <div className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
            <div aria-hidden data-reveal className="ql-line absolute left-[16%] right-[16%] top-8 hidden h-px lg:block" />
            {steps.map((s, i) => (
              <div
                key={s.title}
                data-reveal
                style={{ "--d": `${150 + i * 150}ms` } as React.CSSProperties}
                className="ql-reveal relative flex flex-col items-center text-center"
              >
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
                  <span className="ql-pulse absolute inset-0 rounded-2xl" />
                  <s.icon size={26} className="text-[#ff9a4d]" />
                </span>
                <span className="mt-6 text-xs font-bold tracking-[0.2em] text-white/40">STEP 0{i + 1}</span>
                <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
                <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-white/60 lg:text-base">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Leaderboard */}
      <section id="leaderboard" className="scroll-mt-24 px-6 py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p data-reveal className="ql-reveal mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#f60]">
              Leaderboard
            </p>
            <h2 data-reveal style={{ "--d": "80ms" } as React.CSSProperties} className="ql-reveal text-3xl font-bold tracking-tight lg:text-5xl">
              A little competition goes a long way
            </h2>
            <p data-reveal style={{ "--d": "160ms" } as React.CSSProperties} className="ql-reveal mx-auto mt-5 max-w-[480px] text-base leading-relaxed text-[#212121]/60 lg:mx-0 lg:text-lg">
              Every point you earn moves you up the campus leaderboard. Collect gold, silver and bronze badges along the
              way, and show your department what consistency looks like.
            </p>
            <div data-reveal style={{ "--d": "240ms" } as React.CSSProperties} className="ql-reveal mt-8 flex justify-center gap-4 lg:justify-start">
              {["medal-gold", "medal-silver", "medal-bronze"].map((m, i) => (
                <span key={m} className="ql-bob relative h-14 w-14" style={{ animationDelay: `${i * 0.25}s` }}>
                  <Image src={`/images/${m}.svg`} alt={`${m.split("-")[1]} medal`} fill sizes="56px" />
                </span>
              ))}
            </div>
          </div>

          <div data-reveal style={{ "--d": "120ms" } as React.CSSProperties} className="ql-reveal-scale relative">
            <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-[#006dff]/20 via-transparent to-[#f60]/20 blur-2xl" />
            <div className="relative rounded-3xl border border-black/5 bg-white p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold">This week&apos;s top students</h3>
                <span className="rounded-full bg-[#006dff]/10 px-3 py-1 text-xs font-bold text-[#006dff]">Live</span>
              </div>
              <ul className="flex flex-col gap-5">
                {leaders.map((l, i) => (
                  <li key={l.name} className="flex items-center gap-4">
                    <span
                      className={`w-5 text-center text-sm font-bold ${i === 0 ? "text-[#f60]" : "text-[#212121]/40"}`}
                    >
                      {i + 1}
                    </span>
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                      <Image src={l.avatar} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-bold">{l.name}</p>
                        <p className="text-sm font-bold text-[#006dff]">
                          <CountUp to={l.pts} duration={1400 + i * 200} /> pts
                        </p>
                      </div>
                      <p className="text-xs text-[#212121]/50">{l.dept}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f2f4f7]">
                        <div
                          className={`ql-bar h-full rounded-full ${i === 0 ? "bg-gradient-to-r from-[#ffb27a] to-[#f60]" : "bg-[#006dff]"}`}
                          style={{ "--w": `${l.pct}%`, animationDelay: `${300 + i * 150}ms` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-xs text-[#212121]/40">Preview: names and scores are illustrative.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- WhatsApp */}
      <section id="whatsapp" className="scroll-mt-24 px-4 pb-24 lg:px-6 lg:pb-32">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[40px] bg-gradient-to-br from-[#006dff] via-[#0057d6] to-[#0a2a6b] px-6 pt-16 text-white lg:px-16 lg:pt-0">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="ql-blob ql-blob-b absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full bg-[#f60]/40 blur-3xl" />
            <div className="ql-grid-dark absolute inset-0 opacity-60" />
          </div>
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div className="text-center lg:py-24 lg:text-left">
              <span data-reveal className="ql-reveal inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur lg:text-sm">
                <MessageCircle size={14} /> Quant on WhatsApp
              </span>
              <h2 data-reveal style={{ "--d": "80ms" } as React.CSSProperties} className="ql-reveal mt-6 text-3xl font-bold tracking-tight lg:text-5xl">
                Your portal, right inside your chats
              </h2>
              <p data-reveal style={{ "--d": "160ms" } as React.CSSProperties} className="ql-reveal mx-auto mt-5 max-w-[440px] text-base leading-relaxed text-white/75 lg:mx-0 lg:text-lg">
                Say hi to Quant to summarize a topic, grab a PDF, check your assignments, review your CGPA goal or pull up
                today&apos;s timetable, without opening another app.
              </p>
              <div data-reveal style={{ "--d": "240ms" } as React.CSSProperties} className="ql-reveal mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                {["Summarize topic", "Get PDF", "View assignments", "Check CGPA goal", "View timetable"].map((c) => (
                  <span key={c} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs backdrop-blur transition-colors hover:bg-white/20 lg:text-sm">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div data-reveal style={{ "--d": "200ms" } as React.CSSProperties} className="ql-reveal-up relative mx-auto -mb-2 w-full max-w-[520px]">
              <div className="ql-float-slow relative aspect-[4/3] w-full">
                <Image
                  src="/images/phone-mockup.png"
                  alt="Quant chat on WhatsApp showing quick actions like Summarize Topic, Get PDF and View Timetable"
                  fill
                  sizes="(max-width: 1024px) 90vw, 520px"
                  className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Final CTA */}
      <section className="px-6 pb-24 lg:pb-32">
        <div data-reveal className="ql-reveal-scale relative mx-auto max-w-[900px] text-center">
          <div className="ql-glow absolute left-1/2 top-1/2 -z-0 h-64 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f60]/25 blur-3xl" />
          <h2 className="relative text-4xl font-bold tracking-tight lg:text-6xl">
            Ready to make your
            <br />
            semester <span className="ql-gradient-text">count?</span>
          </h2>
          <p className="relative mx-auto mt-6 max-w-[480px] text-base text-[#212121]/60 lg:text-lg">
            It takes a couple of minutes to sign up. Your first points are one upload away.
          </p>
          <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="ql-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#f60] px-10 py-4 text-lg font-bold text-white shadow-[0_16px_40px_-12px_rgba(255,102,0,0.75)] transition-all hover:-translate-y-1"
            >
              Get started free
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-2xl px-10 py-4 text-lg font-bold text-[#006dff] transition-colors hover:bg-[#006dff]/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- Footer */}
      <footer className="border-t border-black/5 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 text-sm text-[#212121]/50 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="relative h-6 w-6">
              <Image src="/images/logo-icon.png" alt="" fill className="object-contain" sizes="24px" />
            </span>
            <span className="font-bold text-[#212121]">Quant</span>
            <span>· Campus Scholar Portal</span>
          </div>
          <p>© {new Date().getFullYear()} Quant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const landingCss = `
.ql-root { --ease: cubic-bezier(.22,1,.36,1); }

/* scroll reveal */
.ql-reveal, .ql-reveal-scale, .ql-reveal-up {
  opacity: 0;
  transition: opacity .9s var(--ease), transform .9s var(--ease), filter .9s var(--ease);
  transition-delay: var(--d, 0ms);
}
.ql-reveal { transform: translateY(28px); filter: blur(6px); }
.ql-reveal-scale { transform: scale(.92) translateY(20px); }
.ql-reveal-up { transform: translateY(80px); }
.is-visible.ql-reveal, .is-visible.ql-reveal-scale, .is-visible.ql-reveal-up {
  opacity: 1; transform: none; filter: none;
}

/* animated gradient words */
.ql-gradient-text {
  background: linear-gradient(100deg, #006dff 0%, #5b8cff 30%, #f60 60%, #006dff 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: ql-shift 6s ease-in-out infinite;
}
.ql-gradient-text-light {
  background: linear-gradient(100deg, #ff9a4d, #ffd2ad, #6ea8ff, #ff9a4d);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: ql-shift 6s ease-in-out infinite;
}
@keyframes ql-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

/* background grids */
.ql-grid {
  background-image:
    linear-gradient(to right, rgba(0,109,255,.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,109,255,.07) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%);
}
.ql-grid-dark {
  background-image:
    linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 80%);
}

/* drifting blobs */
.ql-blob-a { animation: ql-drift-a 18s ease-in-out infinite; }
.ql-blob-b { animation: ql-drift-b 22s ease-in-out infinite; }
@keyframes ql-drift-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(80px,60px) scale(1.15); } }
@keyframes ql-drift-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-70px,50px) scale(1.1); } }

/* floating cards (Tailwind's centring uses the separate translate property, so transform is free here) */
.ql-float { animation: ql-float 6s ease-in-out infinite; }
.ql-float-alt { animation: ql-float-alt 7s ease-in-out infinite; }
.ql-float-slow { animation: ql-float-alt 9s ease-in-out infinite; }
@keyframes ql-float { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-14px) rotate(1deg); } }
@keyframes ql-float-alt { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(12px) rotate(-1.5deg); } }

/* rotating dashed ring */
.ql-ring { animation: ql-spin 40s linear infinite; }
@keyframes ql-spin { to { transform: rotate(360deg); } }

/* moving sheen across the points card */
.ql-sheen {
  background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.18) 45%, transparent 60%);
  background-size: 250% 100%;
  animation: ql-sheen 4.5s ease-in-out infinite;
}
@keyframes ql-sheen { 0% { background-position: 130% 0; } 60%,100% { background-position: -30% 0; } }

/* progress bars that fill when revealed */
.ql-bar { width: 0; animation: ql-fill 1.6s var(--ease) forwards; animation-play-state: paused; }
.is-visible .ql-bar { animation-play-state: running; }
@keyframes ql-fill { to { width: var(--w); } }

/* button shine */
.ql-shine::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,.45) 50%, transparent 80%);
  transform: translateX(-120%);
  transition: transform .8s var(--ease);
}
.ql-shine:hover::after { transform: translateX(120%); }

/* nav underline */
.ql-underline { position: relative; }
.ql-underline::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; border-radius: 2px;
  background: #f60; transform: scaleX(0); transform-origin: right; transition: transform .35s var(--ease);
}
.ql-underline:hover::after { transform: scaleX(1); transform-origin: left; }

/* feature cards */
.ql-card {
  transition: opacity .9s var(--ease), transform .6s var(--ease), box-shadow .5s var(--ease), filter .9s var(--ease);
  transition-delay: var(--d, 0ms);
}
.ql-card.is-visible:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -30px rgba(0,109,255,.35); transition-delay: 0ms; }

/* marquee */
.ql-marquee { animation: ql-marquee 32s linear infinite; }
.ql-marquee-mask:hover .ql-marquee { animation-play-state: paused; }
.ql-marquee-mask { mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent); }
@keyframes ql-marquee { to { transform: translateX(-50%); } }

/* step connector line draws in */
.ql-line {
  background: linear-gradient(90deg, rgba(255,154,77,0), rgba(255,154,77,.8), rgba(110,168,255,.8), rgba(110,168,255,0));
  transform: scaleX(0); transform-origin: left; transition: transform 1.6s var(--ease) .3s;
}
.ql-line.is-visible { transform: scaleX(1); }

/* step icon pulse */
.ql-pulse { box-shadow: 0 0 0 0 rgba(255,154,77,.45); animation: ql-pulse 2.6s ease-out infinite; }
@keyframes ql-pulse { 0% { box-shadow: 0 0 0 0 rgba(255,154,77,.45); } 100% { box-shadow: 0 0 0 18px rgba(255,154,77,0); } }

/* medals bob */
.ql-bob { animation: ql-bob 3s ease-in-out infinite; }
@keyframes ql-bob { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-8px) rotate(-6deg); } }

/* CTA glow breathing */
.ql-glow { animation: ql-glow 5s ease-in-out infinite; }
@keyframes ql-glow { 0%,100% { opacity: .6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }

/* mobile menu */
.ql-drop { animation: ql-drop .3s var(--ease); }
@keyframes ql-drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  .ql-root *, .ql-root *::before, .ql-root *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
  .ql-reveal, .ql-reveal-scale, .ql-reveal-up { opacity: 1; transform: none; filter: none; }
  .ql-bar { width: var(--w); }
}
`;
