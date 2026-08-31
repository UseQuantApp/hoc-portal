'use client';

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { Gift, Sparkles, CheckCircle2, Award, Zap, Wifi, BookOpen, Printer, Ticket } from 'lucide-react';

const rewardCatalog = [
  {
    id: 1,
    title: '5GB MTN / Airtel Campus Data Bundle',
    cost: 1500,
    category: 'Connectivity',
    description: 'Instant data top-up sent directly to your registered student phone number.',
    icon: Wifi,
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: 2,
    title: '100 AI Research Tokens (Gemini / Claude)',
    cost: 800,
    category: 'AI Assistant',
    description: 'Use advanced AI for literature review summarization and engineering formulas.',
    icon: Zap,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 3,
    title: 'Faculty Library Free Printing Pass (50 Pages)',
    cost: 1200,
    category: 'Campus Service',
    description: 'Voucher valid at Faculty of Engineering & Central Library print kiosks.',
    icon: Printer,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 4,
    title: 'Official Quant Scholar Hooded Sweatshirt',
    cost: 5000,
    category: 'Merchandise',
    description: 'Premium heavyweight cotton embroidered scholar hoodie. Available in Navy and Black.',
    icon: Gift,
    color: 'from-purple-500 to-pink-600',
  },
];

export default function RewardsPage() {
  const [pointsBalance, setPointsBalance] = useState(4500);
  const [claimedReward, setClaimedReward] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);

  const handleRedeem = (item: (typeof rewardCatalog)[0]) => {
    if (pointsBalance < item.cost) {
      alert(`Insufficient points. You need ${item.cost - pointsBalance} more points.`);
      return;
    }
    setPointsBalance((prev) => prev - item.cost);
    const code = 'QUANT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setClaimedReward(item.title);
    setVoucherCode(code);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#212121] flex flex-col items-center">
      <div className="w-full max-w-[1240px] px-4 sm:px-6 py-4 flex flex-col gap-6">
        <Navbar showBackButton backHref="/dashboard" title="Scholar Rewards" />

        {/* Top Points Balance Card - strictly NO search bar per constraint */}
        <div className="bg-white border border-[#f2f4f7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#eff6ff] text-[#006dff] text-xs font-bold px-3 py-1 rounded-full self-center sm:self-start">
              <Sparkles size={14} />
              <span>Tier 2 Active Contributor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] tracking-tight">
              Scholar Rewards & Perks Catalog
            </h1>
            <p className="text-xs text-[#64748b]">
              Redeem your accumulated academic contribution points for airtime, data, and campus vouchers.
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl flex flex-col items-center sm:items-end text-center shrink-0">
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
              Available Points Balance
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#006dff]">
                {pointsBalance.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#64748b]">pts</span>
            </div>
          </div>
        </div>

        {/* Claimed Modal / Alert */}
        {voucherCode && (
          <div className="p-5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-[#065f46]">
                  Redemption Code Issued for: {claimedReward}
                </span>
                <span className="text-xs text-[#047857]">
                  Present voucher code: <strong className="font-mono bg-white px-2 py-0.5 rounded-md border border-[#a7f3d0] text-[#1e293b]">{voucherCode}</strong> at the student desk or SMS bot.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setVoucherCode(null);
                setClaimedReward(null);
              }}
              className="text-xs font-bold text-[#065f46] hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Rewards Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rewardCatalog.map((item) => {
            const Icon = item.icon;
            const canAfford = pointsBalance >= item.cost;

            return (
              <div
                key={item.id}
                className="bg-white border border-[#f2f4f7] rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-2xl bg-[#eff6ff] text-[#006dff] flex items-center justify-center shrink-0">
                    <Icon size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#006dff] uppercase tracking-wider bg-[#eff6ff] px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <span className="text-sm font-black text-[#1e293b]">{item.cost.toLocaleString()} pts</span>
                    </div>
                    <h3 className="font-bold text-base text-[#1e293b]">{item.title}</h3>
                    <p className="text-xs text-[#64748b] leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f2f4f7] flex items-center justify-end">
                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford}
                    className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-[#f60] hover:bg-[#e55600] text-white shadow-2xs'
                        : 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed'
                    }`}
                  >
                    <Ticket size={14} />
                    <span>{canAfford ? 'Redeem Voucher' : 'Need More Points'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
