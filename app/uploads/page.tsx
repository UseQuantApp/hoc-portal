'use client';

import React from 'react';
import Navbar from '@/components/dashboard/Navbar';
import FullUploadsTable from '@/components/dashboard/FullUploadsTable';

export default function UploadsPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col items-center">
      <div className="w-full max-w-[1240px] px-4 sm:px-6 py-4 flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="Document Archive" />
        <FullUploadsTable />
      </div>
    </div>
  );
}
