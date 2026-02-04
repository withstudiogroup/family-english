"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import type { User as AppUser } from "@/lib/supabase/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profile);
      }

      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setProfile(profile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (username: string, pinCode: string, accountType: "parent" | "child") => {
    // 이메일 형식으로 변환 (Supabase Auth는 이메일 필요)
    const email = `${username.toLowerCase().replace(/\s/g, "_")}@familyenglish.local`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pinCode.padEnd(6, "0"), // 최소 6자리 필요
    });

    if (error) throw error;

    if (data.user) {
      // 프로필 생성
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id: data.user.id,
          username,
          pin_code: pinCode,
          account_type: accountType,
          level: "beginner",
        });

      if (profileError) throw profileError;
    }

    return data;
  };

  const signIn = async (username: string, pinCode: string) => {
    const email = `${username.toLowerCase().replace(/\s/g, "_")}@familyenglish.local`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pinCode.padEnd(6, "0"),
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateLevel = async (level: "beginner" | "intermediate" | "advanced") => {
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("users")
      .update({ level })
      .eq("id", user.id);

    if (error) throw error;

    setProfile(prev => prev ? { ...prev, level } : null);
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateLevel,
  };
}
