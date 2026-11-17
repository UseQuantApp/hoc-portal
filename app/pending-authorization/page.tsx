"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";
import { logoutStudent } from "@/lib/auth";

type Status = "checking" | "pending" | "signed-out" | "error";

export default function PendingAuthorizationPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Runs on every load, so a plain browser refresh is the re-check: an account awaiting
  // authorization holds a limited session that can read its own profile, and the moment
  // isAmbassador is granted we go straight to the dashboard on that same session.
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!localStorage.getItem("quant_token")) {
        if (!cancelled) setStatus("signed-out");
        return;
      }

      try {
        const res = await apiFetch("/students/me");
        const student = res.data ?? res;
        if (student.isAmbassador) {
          router.replace("/dashboard");
          return;
        }
        if (cancelled) return;
        setEmail(student.email || "");
        setStatus("pending");
      } catch (err) {
        if (cancelled) return;
        if (/token|authentication|authorization header/i.test(err instanceof Error ? err.message : "")) {
          // expired or revoked session
          localStorage.removeItem("quant_token");
          setStatus("signed-out");
        } else {
          setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
          setStatus("error");
        }
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const goToSignIn = () => {
    if (localStorage.getItem("quant_token")) logoutStudent(router.push);
    else router.push("/sign-in");
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[560px] px-6 py-10 lg:py-16">
        {status === "checking" ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Loader2 className="text-[#f60] animate-spin" size={36} />
            <p className="text-base font-bold text-[#212121]">Checking your authorization...</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-[#f60] rounded-3xl overflow-hidden">
            <div className="bg-[#f60] px-6 py-3 text-center">
              <p className="text-xs lg:text-sm font-bold uppercase tracking-[0.2em] text-white">
                Ambassadors only
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 px-6 py-8 lg:px-10 lg:py-10 text-center">
              <div className="bg-[#fff6f0] rounded-full size-20 flex items-center justify-center">
                <ShieldAlert className="text-[#f60]" size={40} strokeWidth={2.25} />
              </div>

              <div className="flex flex-col gap-3">
                <h1 className="text-[28px] lg:text-4xl leading-tight font-bold text-[#212121]">
                  You need to be authorized first
                </h1>
                {status === "pending" && (
                  <p className="text-base lg:text-lg text-[#212121]">
                    Your account{" "}
                    {email && <span className="font-bold text-[#006dff] break-all">{email} </span>}
                    is verified, but it hasn&apos;t been authorized as a Quant ambassador yet. The
                    portal only opens for authorized ambassadors.
                  </p>
                )}
                {status === "signed-out" && (
                  <p className="text-base lg:text-lg text-[#212121]">
                    The portal only opens for authorized Quant ambassadors. Sign in to check
                    whether your account has been authorized.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-base font-bold text-[#ff3b3b]">{errorMessage}</p>
                )}
              </div>

              {status === "pending" && (
                <div className="w-full bg-[#fff6f0] rounded-2xl px-5 py-4">
                  <p className="text-sm lg:text-base font-bold text-[#212121]">
                    Already been authorized? Just refresh this page and you&apos;ll go straight to
                    your dashboard.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 w-full">
                {status === "signed-out" ? (
                  <button
                    type="button"
                    onClick={goToSignIn}
                    className="w-full bg-[#f60] text-white text-base lg:text-lg font-bold lowercase py-3 rounded-xl hover:bg-[#e55600] transition-colors"
                  >
                    sign in
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="w-full bg-[#f60] text-white text-base lg:text-lg font-bold lowercase py-3 rounded-xl hover:bg-[#e55600] transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} />
                      refresh
                    </button>
                    <button
                      type="button"
                      onClick={goToSignIn}
                      className="text-sm lg:text-base font-bold text-[#006dff] hover:underline"
                    >
                      Sign in with a different account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
