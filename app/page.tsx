import Image from "next/image";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center">
      <div className="w-full max-w-[1100px]">
        <Header />
      </div>

      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-center px-6 py-8 lg:p-8">
        {/* Left: Login form */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8 lg:gap-10">
          <StepIndicator step={1} className="hidden lg:flex" />

          <div className="flex flex-col gap-6 lg:gap-8 max-w-[393px] mx-auto lg:mx-0 w-full">
            <h1 className="text-xl lg:text-[28px] font-bold text-[#212121] text-center lg:text-left">
              Login to your Account
            </h1>

            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <label htmlFor="whatsapp" className="text-sm lg:text-base text-[#212121]">
                    WhatsApp Number <span className="text-[#ff4343] text-lg">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
                    <Image src="/images/whatsapp.svg" alt="" width={20} height={20} />
                    <input
                      id="whatsapp"
                      type="tel"
                      placeholder="+234 701 234 5678"
                      className="w-full text-base lg:text-lg text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label htmlFor="email" className="text-sm lg:text-base text-[#212121]">
                    Recovery Email (optional)
                  </label>
                  <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-[#f4f4f4] rounded-xl p-4">
                    <Image src="/images/mail.svg" alt="" width={20} height={20} />
                    <input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      className="w-full text-base lg:text-lg text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="w-3 h-3 rounded-sm accent-[#006dff]" />
                  <span className="text-sm lg:text-base text-[#21212180]">Remember me</span>
                </label>
              </div>

             <Link
            href="/verify-otp"
           className="w-full bg-[#006dff] text-white text-base lg:text-lg lowercase py-3 rounded-xl hover:bg-[#005ce0] transition-colors text-center block"
               >
            send verification code (otp)
          </Link>
            </form>
          </div>
        </div>

        {/* Right: Blue promo panel — desktop only */}
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