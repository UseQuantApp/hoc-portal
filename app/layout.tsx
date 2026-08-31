import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quant | Campus Scholar Portal Access',
  description: 'Campus Scholar Portal Access — Academic library, assignment tracker, timetable, contributor rewards, and HOC communication hub.',
  openGraph: {
    title: 'Quant | Campus Scholar Portal Access',
    description: 'Campus Scholar Portal Access — Academic library, assignment tracker, timetable, contributor rewards, and HOC communication hub.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fbfbfb] text-[#212121] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
