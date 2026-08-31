import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row gap-10 lg:gap-16 items-center px-6 py-8 lg:p-8">
        {/* Left: Reset form */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8 max-w-[393px] mx-auto lg:mx-0">
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <h1 className="text-xl lg:text-[28px] font-bold text-[#212121]">Reset password</h1>
            <p className="text-sm lg:text-base text-[#212121]">
              Enter your email to receive a reset link
            </p>
          </div>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-sm lg:text-base font-bold text-[#212121]">
                Email Address
              </label>
              <div className="bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full text-base text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                />
              </div>
            </div>

        <Link
        href="/reset-password"
        className="w-full bg-[#f60] text-white text-base lg:text-lg font-bold lowercase py-3 rounded-xl hover:bg-[#e55600] transition-colors text-center block"
           >
       send reset link
        </Link>

            <Link href="/" className="text-sm lg:text-base font-bold text-[#006dff] text-center">
              Back to Login
            </Link>
          </form>
        </div>

        {/* Right: Blue promo panel */}
        <div className="hidden lg:block w-full lg:w-1/2 relative bg-[#006dff] rounded-3xl overflow-hidden aspect-[644/953] max-w-[644px]">
          <p className="absolute top-8 left-1/2 -translate-x-1/2 w-[80%] text-center text-white text-2xl md:text-[32px] leading-tight">
            Your department&apos;s <span className="font-bold">entire library</span>
          </p>

          <div className="absolute left-[5%] top-[20%] w-[90%] aspect-square opacity-90">
            <Image src="/images/blob-bg.svg" alt="" fill className="object-contain" />
          </div>

          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[380px] rotate-[-7deg]">
            <Image
              src="/images/phone-mockup.png"
              alt="WhatsApp chat on phone showing Quant assistant"
              width={454}
              height={646}
              className="w-full h-auto"
            />
          </div>

          <div className="absolute right-[8%] top-[45%] w-[28%] max-w-[168px] rotate-[10deg]">
            <div className="relative aspect-square">
              <Image src="/images/badge-ellipse.svg" alt="" fill className="object-contain" />
              <Image src="/images/star-badge.svg" alt="" fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white text-xs leading-tight px-4">
                Your Academic Success Begins <span className="font-bold">Here!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}