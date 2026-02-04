"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type UserLevel = "beginner" | "intermediate" | "advanced";
export type AccountType = "parent" | "child";

export interface UserProfile {
  id: string;
  username: string;
  account_type: AccountType;
  level: UserLevel;
}

const USER_STORAGE_KEY = "family_english_user";

export function useAuth() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // localStorage에서 사용자 정보 복원
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, pinCode: string) => {
    // users 테이블에서 직접 조회
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("pin_code", pinCode)
      .single();

    if (error || !data) {
      throw new Error("이름 또는 비밀번호가 일치하지 않아요");
    }

    const user: UserProfile = {
      id: data.id,
      username: data.username,
      account_type: data.account_type,
      level: data.level,
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    setProfile(user);
    return user;
  };

  const signOut = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setProfile(null);
  };

  const signUp = async (
    username: string,
    pinCode: string,
    accountType: AccountType
  ) => {
    // users 테이블에 새 사용자 추가
    const { data, error } = await supabase
      .from("users")
      .insert({
        username,
        pin_code: pinCode,
        account_type: accountType,
        level: "beginner",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("이미 사용 중인 이름이에요");
      }
      throw new Error("회원가입에 실패했어요");
    }

    const user: UserProfile = {
      id: data.id,
      username: data.username,
      account_type: data.account_type,
      level: data.level,
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    setProfile(user);
    return user;
  };

  const updateLevel = async (level: UserLevel) => {
    if (!profile) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("users")
      .update({ level })
      .eq("id", profile.id);

    if (error) throw error;

    const updatedProfile = { ...profile, level };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  return {
    user: profile,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateLevel,
    isAuthenticated: !!profile,
  };
}
