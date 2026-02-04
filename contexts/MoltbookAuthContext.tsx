"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ProfileType = "human" | "agent";

export interface MoltbookProfile {
  profileId: string;
  profileType: ProfileType;
  username?: string;
}

const STORAGE_KEY = "moltbook_profile";

const MoltbookAuthContext = createContext<{
  profile: MoltbookProfile | null;
  setProfile: (p: MoltbookProfile | null) => void;
  isLoading: boolean;
  signOut: () => void;
}>({
  profile: null,
  setProfile: () => {},
  isLoading: true,
  signOut: () => {},
});

export function MoltbookAuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<MoltbookProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as MoltbookProfile;
        setProfileState(p);
      }
    } catch {
      setProfileState(null);
    }
    setIsLoading(false);
  }, []);

  const setProfile = (p: MoltbookProfile | null) => {
    setProfileState(p);
    if (p) localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const signOut = () => {
    setProfileState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <MoltbookAuthContext.Provider
      value={{ profile, setProfile, isLoading, signOut }}
    >
      {children}
    </MoltbookAuthContext.Provider>
  );
}

export function useMoltbookAuth() {
  return useContext(MoltbookAuthContext);
}
