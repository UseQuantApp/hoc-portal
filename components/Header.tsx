import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full mt-6 flex items-center justify-between lg:justify-start gap-6 lg:gap-8 px-6 py-3 lg:px-0 lg:py-0 border-b border-[#e7e7e7] lg:border-0">
      <div className="flex items-center gap-2">
        <div className="relative w-6 h-6 lg:w-8 lg:h-8">
          <Image src="/images/logo-icon.png" alt="Quant logo" fill className="object-contain" />
        </div>
        <span className="text-xl lg:text-3xl font-medium text-[#212121]">Quant</span>
      </div>
      <p className="text-xs lg:text-lg text-[#212121]">Campus Scholar Portal Access</p>
    </div>
  );
}