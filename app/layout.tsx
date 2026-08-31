import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = localFont({
  src: [
    { path: "../fonts/CodecPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/CodecPro-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Quant | Campus Scholar Portal Access",
  description: "Login to your Quant account",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased bg-[#fbfbfb]`}>
        {children}
      </body>
    </html>
  );
}