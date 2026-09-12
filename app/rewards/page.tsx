"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/dashboard/Navbar";
import { apiFetch } from "@/lib/api";

type ModalState = "success" | "failed" | "processing" | null;

type Reward = {
  _id: string;
  key: string;
  name: string;
  description: string;
  type: "token_conversion" | "voucher" | "merchandise";
  pointsCost: number;
  tokensGranted: number;
  requiresSize: boolean;
  sizes?: string[];
};

type RewardRedemption = {
  _id: string;
  reward: Reward;
  pointsCost: number;
  status: "success" | "failed";
  selectedSize?: string;
  voucherCode?: string;
  expiresAt?: string;
  createdAt: string;
};

// Matches by name keyword first (more resilient to unknown `key` slugs), falls
// back to a generic image per `type` if a reward's name doesn't match anything.
function getRewardImage(reward: Reward): string {
  const name = reward.name.toLowerCase();
  if (name.includes("token")) return "/images/rewards/coin-token.png";
  if (name.includes("airtime") || name.includes("voucher")) return "/images/rewards/voucher.png";
  if (name.includes("journal")) return "/images/rewards/journal.png";
  if (name.includes("t-shirt") || name.includes("tshirt")) return "/images/rewards/t-shirt.png";
  if (name.includes("hoodie")) return "/images/rewards/hoodie.png";

  if (reward.type === "token_conversion") return "/images/rewards/coin-token.png";
  if (reward.type === "voucher") return "/images/rewards/voucher.png";
  return "/images/rewards/journal.png";
}

export default function RewardsPage() {
  const [modal, setModal] = useState<ModalState>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [history, setHistory] = useState<RewardRedemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [redemption, setRedemption] = useState<RewardRedemption | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/rewards"), apiFetch("/rewards/mine/history")])
      .then(([rewardResponse, historyResponse]) => {
        setRewards(rewardResponse.data ?? rewardResponse);
        setHistory(historyResponse.data ?? historyResponse);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load rewards."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRedeem = async (reward: Reward) => {
    const size = selectedSizes[reward._id];
    if (reward.requiresSize && !size) return;
    setErrorMessage("");
    setModal("processing");
    try {
      const response = await apiFetch(`/rewards/${reward._id}/redeem`, {
        method: "POST",
        body: JSON.stringify(reward.requiresSize ? { size } : {}),
      });
      const newRedemption: RewardRedemption = response.data ?? response;
      setRedemption(newRedemption);
      setHistory((current) => [newRedemption, ...current]);
      setModal("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Redemption failed.");
      setModal("failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col items-center gap-6 lg:gap-8 px-4 md:px-16 py-6 lg:py-8">
      <div className="w-full max-w-[1312px]">
        <Navbar />
      </div>

      <div className="w-full max-w-[1312px] flex items-center gap-4">
        <div className="bg-white flex-1 rounded-xl p-3 lg:p-4 flex items-center gap-2.5">
          <input
            placeholder="Search materials, courses..."
            className="w-full text-sm lg:text-lg text-[#212121] placeholder:text-[#21212180] outline-none bg-transparent"
          />
        </div>
      </div>

      <div className="w-full max-w-[1312px] flex flex-col gap-2">
        <p className="text-xl lg:text-2xl font-bold text-[#212121]">Earn Rewards for Sharing Knowledge</p>
        <p className="text-sm lg:text-base text-[#9f9f9f]">
          The more you contribute, the more you earn. Upload quality materials and help students succeed while unlocking rewards.
        </p>
      </div>

      {isLoading && <p className="text-sm text-[#9f9f9f]">Loading rewards…</p>}

      {loadError && <p className="text-sm text-[#ff3b3b]">{loadError}</p>}

      {!isLoading && !loadError && rewards.length === 0 && (
        <p className="text-sm text-[#9f9f9f]">No rewards available right now — check back soon.</p>
      )}

      {!isLoading && rewards.length > 0 && (
        <div className="w-full max-w-[1312px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward._id} className="bg-white border border-[#f1e9e9] rounded-2xl overflow-hidden flex flex-col p-3.5 gap-6">
              <div className="relative h-[180px] rounded-2xl overflow-hidden bg-[#eff7ff]">
                <span className="absolute top-3 right-3 z-10 bg-white text-xs font-bold text-[#f60] px-3 py-1.5 rounded-full">
                  {reward.pointsCost} points
                </span>
                <Image
                  src={getRewardImage(reward)}
                  alt={reward.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 px-4 flex-1">
                <p className="font-bold text-lg lg:text-2xl text-[#212121] lowercase">{reward.name}</p>
                <p className="text-sm lg:text-lg text-[#747474] lowercase flex-1">{reward.description}</p>
                {reward.requiresSize && (
                  <select
                    value={selectedSizes[reward._id] || ""}
                    onChange={(e) => setSelectedSizes((current) => ({ ...current, [reward._id]: e.target.value }))}
                    className="border border-[#e5e5e5] rounded-lg p-2 text-sm"
                  >
                    <option value="">Select size</option>
                    {(reward.sizes || []).map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={reward.requiresSize && !selectedSizes[reward._id]}
                  className="w-full bg-[#006dff] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm lg:text-lg py-3 lg:py-5 rounded-xl"
                >
                  Redeem Reward
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="w-full max-w-[1312px] bg-white border border-[#f2f4f7] rounded-2xl p-5 flex flex-col gap-4">
        <div>
          <p className="font-bold text-lg text-[#212121]">Redemption History</p>
          <p className="text-sm text-[#9f9f9f] mt-1">
            {history.length} redemption{history.length === 1 ? "" : "s"} recorded.
          </p>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-[#9f9f9f]">You haven't redeemed anything yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-[#f2f4f7]">
            {history.map((entry) => (
              <div key={entry._id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm lg:text-base text-[#212121]">{entry.reward?.name ?? "Reward"}</p>
                  <p className="text-xs lg:text-sm text-[#9f9f9f]">
                    {new Date(entry.createdAt).toLocaleDateString()}
                    {entry.selectedSize ? ` · Size ${entry.selectedSize}` : ""}
                    {entry.voucherCode ? ` · Code: ${entry.voucherCode}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm lg:text-base text-[#212121]">-{entry.pointsCost} pts</p>
                  <p className={`text-xs font-bold ${entry.status === "success" ? "text-[#00b368]" : "text-[#ff3b3b]"}`}>
                    {entry.status === "success" ? "Success" : "Failed"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setModal(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-[340px] p-6 flex flex-col items-center gap-4 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-[#9f9f9f]">
              ✕
            </button>

            <div
              className={`size-10 rounded-full flex items-center justify-center text-white text-lg ${
                modal === "failed" ? "bg-[#ff3b3b]" : "bg-[#00b368]"
              }`}
            >
              {modal === "failed" ? "✕" : "✓"}
            </div>

            <div>
              <p
                className={`font-bold text-lg ${
                  modal === "success" ? "text-[#00b368]" : modal === "failed" ? "text-[#ff3b3b]" : "text-[#212121]"
                }`}
              >
                {modal === "success" && "Redemption Successful!"}
                {modal === "failed" && "Redemption Failed"}
                {modal === "processing" && "Processing Your Reward"}
              </p>
              <p className="text-sm text-[#9f9f9f] mt-1">
                {modal === "success" && "Your reward has been successfully redeemed. Enjoy your benefit and keep contributing to earn more."}
                {modal === "failed" && errorMessage}
                {modal === "processing" && "Hang tight — we're confirming your request. You'll be notified once it's completed."}
              </p>
            </div>

            {redemption && (
              <div className="w-full bg-[#fdf3e0] rounded-xl p-4 flex items-center justify-center gap-3 text-xs font-bold">
                <span className="text-[#212121]">{redemption.reward?.name ?? "REWARD"}</span>
                {redemption.voucherCode && (
                  <>
                    <span>⟶</span>
                    <span className="text-[#212121]">{redemption.voucherCode}</span>
                  </>
                )}
              </div>
            )}

            <p
              className={`text-xs font-bold ${
                modal === "success" ? "text-[#00b368]" : modal === "failed" ? "text-[#ff3b3b]" : "text-[#f60]"
              }`}
            >
              {modal === "success" && (redemption?.expiresAt ? `Expires on ${new Date(redemption.expiresAt).toLocaleDateString()}` : "Redeemed")}
              {modal === "failed" && "Failed"}
              {modal === "processing" && "In Progress"}
            </p>

            <p className="text-xs text-[#9f9f9f]">
              {modal === "success" && (redemption?.voucherCode ? `Voucher: ${redemption.voucherCode}` : "Your reward is ready.")}
              {modal === "failed" && "No points were deducted. You can try again anytime."}
              {modal === "processing" && "Don't worry — your points are safe while we process this."}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}