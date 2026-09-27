"use client";

// Shared WhatsApp-style fallback avatar — colored circle + first letter of name.
// Used everywhere a profile photo would normally render, until a real photo exists.

const AVATAR_COLORS = ["#006dff", "#00b368", "#ff8a00", "#8b5cf6", "#f43f5e", "#0ea5e9"];

function getAvatarColor(name: string) {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.trim().charCodeAt(0) % AVATAR_COLORS.length];
}

export default function InitialsAvatar({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return (
    <div
      className={`${className} flex items-center justify-center text-white font-bold`}
      style={{ backgroundColor: getAvatarColor(name) }}
    >
      {initial}
    </div>
  );
}