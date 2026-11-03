import type { Metadata } from "next";
import "./globals.css";
import { ProfileProvider } from "@/context/ProfileContext";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apply the saved theme before first paint so dark mode doesn't flash white */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("quant_theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased bg-[#fbfbfb]">
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}