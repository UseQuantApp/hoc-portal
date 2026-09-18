"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { normalizeNigerianPhone } from "@/lib/phone";

const institutions = ["LASU"];
const faculties = ["Faculty of Engineering"];
const departments = ["Mechanical Engineering", "Electronic and Computer Engineering", "Electrical Engineering", "Civil Engineering", "Computer Engineering"];
const levels = ["100", "200", "300", "400"];

const TOTAL_STEPS = 3;

export default function SignUpPage() {
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [matricNumber, setMatricNumber] = useState("");
  const [institution, setInstitution] = useState("LASU");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("400");

  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleCreateAccount = async () => {
    setSubmitError("");

    if (password !== confirmPassword) {
      setSubmitError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setSubmitError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          phone: normalizeNigerianPhone(whatsapp),
          email,
          password,
          matricNumber,
          university: institution,
          department,
          level,
        }),
      });
      sessionStorage.setItem("quant_signup_email", email);
      window.location.href = "/verify-email";
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center px-6 py-8 lg:p-8">
        {/* Right (visually first on mobile): Header + form */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8 max-w-[393px] mx-auto lg:mx-0">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <div className="relative w-8 h-8">
              <Image src="/images/logo-icon.png" alt="Quant logo" fill className="object-contain" />
            </div>
            <span className="text-2xl font-medium text-[#212121]">Quant</span>
            <p className="hidden lg:block text-lg text-[#212121] ml-4">Campus Scholar Portal Access</p>
          </div>

          <div className="flex gap-1.5 justify-center lg:justify-start">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 w-12 rounded-full ${i === step - 1 ? "bg-[#006dff]" : "bg-[#dbdbdb]"}`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 text-center lg:text-left">
            <h1 className="text-xl lg:text-[28px] font-bold text-[#212121]">Create account</h1>
            <p className="text-sm lg:text-base text-[#212121]">
              Join Campus Scholar and start earning rewards
            </p>
          </div>

          {step === 1 && (
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <label htmlFor="fullName" className="text-sm lg:text-base font-bold text-[#212121]">
                    Full Name
                  </label>
                  <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
                    <input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g Habeebullah Akorede"
                      className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label htmlFor="email" className="text-sm lg:text-base font-bold text-[#212121]">
                    Email Address
                  </label>
                  <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!fullName || !email}
                className="w-full bg-[#f60] disabled:opacity-50 text-white text-base lg:text-lg font-bold lowercase py-3 rounded-xl hover:bg-[#e55600] transition-colors"
              >
                next
              </button>

              <p className="text-sm lg:text-base text-center text-[#21212180]">
                Already have an account?{" "}
                <Link href="/" className="font-bold text-[#006dff]">
                  Login
                </Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <label htmlFor="matric" className="text-sm lg:text-base font-bold text-[#212121]">
                    Matric Number
                  </label>
                  <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
                    <input
                      id="matric"
                      value={matricNumber}
                      onChange={(e) => setMatricNumber(e.target.value)}
                      placeholder="e.g 220123456"
                      className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                    />
                  </div>
                </div>

                <SelectField label="Institution" value={institution} onChange={setInstitution} options={institutions} />
                <SelectField label="Faculty" value={faculty} onChange={setFaculty} options={faculties} placeholder="select faculty" />
                <SelectField label="Department" value={department} onChange={setDepartment} options={departments} placeholder="select Department" />
                <SelectField label="Level" value={level} onChange={setLevel} options={levels} />
              </div>

              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!matricNumber || !faculty || !department}
                className="w-full bg-[#f60] disabled:opacity-50 text-white text-base lg:text-lg font-bold py-3 rounded-xl hover:bg-[#e55600] transition-colors"
              >
                Next
              </button>

              <p className="text-sm lg:text-base text-center text-[#21212180]">
                Already have an account?{" "}
                <Link href="/" className="font-bold text-[#006dff]">
                  Login
                </Link>
              </p>
            </form>
          )}

          {step === 3 && (
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <label htmlFor="whatsapp" className="text-sm lg:text-base font-bold text-[#212121]">
                    WhatsApp Number
                  </label>
                  <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
                    <input
                      id="whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      onBlur={() => setWhatsapp((prev) => normalizeNigerianPhone(prev))}
                      placeholder="+234 701 234 5678"
                      className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label htmlFor="password" className="text-sm lg:text-base font-bold text-[#212121]">
                    Password
                  </label>
                  <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4 flex items-center gap-2.5">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-[#9f9f9f] shrink-0">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label htmlFor="confirmPassword" className="text-sm lg:text-base font-bold text-[#212121]">
                    Confirm Password
                  </label>
                  <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4 flex items-center gap-2.5">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="text-[#9f9f9f] shrink-0">
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {submitError && (
                <p className="text-xs font-bold text-[#ff3b3b] text-center">{submitError}</p>
              )}

              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={isSubmitting}
                className="w-full bg-[#f60] disabled:opacity-50 text-white text-base lg:text-lg font-bold lowercase py-3 rounded-xl hover:bg-[#e55600] transition-colors"
              >
                {isSubmitting ? "creating account..." : "create account"}
              </button>

              <p className="text-sm lg:text-base text-center text-[#21212180]">
                Already have an account?{" "}
                <Link href="/" className="font-bold text-[#006dff]">
                  Login
                </Link>
              </p>
            </form>
          )}
        </div>

        {/* Left: Illustration panel */}
        <div className="hidden lg:block w-full lg:w-1/2 relative bg-[#ddefff] rounded-3xl overflow-hidden aspect-[644/953] max-w-[644px]">
          <p className="absolute top-[7.6%] left-1/2 -translate-x-1/2 w-[75%] text-center text-2xl md:text-[28px] leading-tight text-[#212121]">
            Academic Assistant<br />On <span className="font-bold">WhatsApp</span>
          </p>

          <div className="absolute top-[22.2%] left-[34.5%] flex items-center gap-2.5">
            <div className="relative w-4 h-4">
              <Image src="/images/mini-logo-icon.png" alt="" fill className="object-contain" />
            </div>
            <div className="relative w-px h-5">
              <Image src="/images/divider-line.svg" alt="" fill />
            </div>
            <span className="text-lg text-[#212121]">getquant.app</span>
          </div>

          <div className="absolute left-[-34.3%] top-[49.2%] right-[52%] bottom-[-5.8%]">
            <Image src="/images/cube-shadow.svg" alt="" fill className="object-contain" />
          </div>
          <div className="absolute left-[29.8%] top-[63%] right-[-21.6%] bottom-[-22.3%]">
            <Image src="/images/cube-piece-1.svg" alt="" fill className="object-contain" />
          </div>
          <div className="absolute left-[8%] top-[41.5%] right-[8%] bottom-[2.9%]">
            <Image src="/images/cube-piece-2.svg" alt="" fill className="object-contain" />
          </div>
        </div>
      </div>
    </main>
  );
}

function SelectField({
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
    <div className="flex flex-col gap-3">
      <label className="text-sm lg:text-base font-bold text-[#212121]">{label}</label>
      <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4 flex items-center justify-between">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-base text-[#212121] outline-none bg-transparent appearance-none cursor-pointer"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={20} className="text-[#212121] shrink-0" />
      </div>
    </div>
  );
}