"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { apiFetch } from "@/lib/api";

type Profile = {
  fullName: string;
  photoUrl: string | null; // NEW: will hold the real uploaded photo URL once backend supports it
};

type ProfileContextValue = Profile & {
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  setPhotoUrl: (url: string | null) => void; // lets Account page update it optimistically after upload
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await apiFetch("/students/me");
      const student = res.data ?? res;
      setFullName(student.fullName || "");
      setPhotoUrl(student.photoUrl || null); // TODO: confirm real field name once upload endpoint exists
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <ProfileContext.Provider value={{ fullName, photoUrl, isLoading, refreshProfile, setPhotoUrl }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}