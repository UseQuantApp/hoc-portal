import Image from "next/image";
import Header from "@/components/Header";
import Link from "next/link";

export default function AddRecoveryEmailPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[500px] flex flex-col items-center gap-8 lg:gap-10 px-6 py-10 lg:py-16">
        <div className="relative w-16 h-16">
          <Image src="/images/recovery-mail-icon.svg" alt="" fill className="object-contain" />
          <div className="absolute -top-2 -right-2 w-6 h-6">
            <Image src="/images/recovery-badge-icon.svg" alt="" fill className="object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 lg:gap-4 text-center">
          <h1 className="text-lg lg:text-2xl font-bold text-[#212121]">Add Recovery Email</h1>
          <p className="text-sm lg:text-base text-[#212121] max-w-[380px]">
            Add a backup email to keep your account secure and recover it easily.
          </p>
        </div>

        <form className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-3">
            <label htmlFor="recovery-email" className="text-sm lg:text-base text-[#212121]">
              Recovery email (optional)
            </label>
            <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
              <Image src="/images/mail.svg" alt="" width={20} height={20} />
              <input
                id="recovery-email"
                type="email"
                placeholder="example@gmail.com"
                className="w-full text-base lg:text-lg text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
              />
            </div>
          </div>

        <Link
        href="/account/verify-recovery-email"
       className="w-full bg-[#006dff] text-white text-base lg:text-lg lowercase py-3 rounded-xl hover:bg-[#005ce0] transition-colors text-center block"
         >
          send verification code (otp)
       </Link>
        </form>
      </div>
    </main>
  );
}