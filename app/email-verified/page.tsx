import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { CheckCircle2 } from "lucide-react";

export default function EmailVerifiedPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center gap-6 px-6 py-10 lg:py-16">
        <div className="bg-[#e6f9f0] rounded-full size-16 flex items-center justify-center">
          <CheckCircle2 className="text-[#00b368]" size={28} />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-lg lg:text-xl font-bold text-[#212121]">Email verified!</h1>
          <p className="text-sm lg:text-base text-[#212121]">
            Your email has been successfully verified. Your Quant account is ready.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full bg-[#f60] text-white text-base lg:text-lg font-bold py-3 rounded-xl hover:bg-[#e55600] transition-colors text-center block"
        >
          Continue to Dashboard
        </Link>
      </div>
    </main>
  );
}