import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased bg-[#fbfbfb]">
        {children}
      </body>
    </html>
  );
}