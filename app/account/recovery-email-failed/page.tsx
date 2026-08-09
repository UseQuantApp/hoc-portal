import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

export default function RecoveryEmailFailedPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center gap-8 px-6 py-10 lg:py-16">
        <div className="relative size-[89px]">
          <Image src="/images/error-x.svg" alt="" fill className="object-contain" />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl lg:text-2xl font-bold text-[#d52700]">Verification failed</h1>
          <p className="text-sm lg:text-base text-[#212121]">
            Looks like the code is wrong or expired. Try again or request a new code.
          </p>
        </div>

        <Link
          href="/account/verify-recovery-email"
          className="w-full bg-[#006dff] text-white text-base lowercase py-3 rounded-xl hover:bg-[#005ce0] transition-colors text-center block"
        >
          resend a new code
        </Link>
      </div>
    </main>
  );
}