"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, Message } from "@/lib/supabase/types";

export interface ConversationWithMessages extends Conversation {
  messages?: Message[];
}

export function useConversation() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const startConversation = async (
    userId: string,
    scenarioId: string,
    level: string
  ): Promise<string | null> => {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        scenario_id: scenarioId,
        level,
        started_at: new Date().toISOString(),
        duration_seconds: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to start conversation:", error);
      return null;
    }

    return data.id;
  };

  const saveMessages = async (
    conversationId: string,
    messages: Array<{
      role: "user" | "assistant";
      content: string;
      translation?: string;
    }>
  ): Promise<boolean> => {
    setSaving(true);
    try {
      const messagesToInsert = messages.map((msg) => ({
        conversation_id: conversationId,
        role: msg.role,
        content: msg.content,
        translation: msg.translation || null,
        audio_url: null,
        feedback: null,
      }));

      const { error } = await supabase.from("messages").insert(messagesToInsert);

      if (error) {
        console.error("Failed to save messages:", error);
        return false;
      }

      return true;
    } finally {
      setSaving(false);
    }
  };

  const endConversation = async (
    conversationId: string,
    durationSeconds: number
  ): Promise<boolean> => {
    const { error } = await supabase
      .from("conversations")
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
      })
      .eq("id", conversationId);

    if (error) {
      console.error("Failed to end conversation:", error);
      return false;
    }

    return true;
  };

  const getConversations = async (
    userId: string
  ): Promise<Conversation[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .order("started_at", { ascending: false });

      if (error) {
        console.error("Failed to get conversations:", error);
        return [];
      }

      return data || [];
    } finally {
      setLoading(false);
    }
  };

  const getConversationWithMessages = async (
    conversationId: string
  ): Promise<ConversationWithMessages | null> => {
    setLoading(true);
    try {
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

      if (convError || !conversation) {
        console.error("Failed to get conversation:", convError);
        return null;
      }

      const { data: messages, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (msgError) {
        console.error("Failed to get messages:", msgError);
        return { ...conversation, messages: [] };
      }

      return { ...conversation, messages: messages || [] };
    } finally {
      setLoading(false);
    }
  };

  const getLearningStats = async (userId: string) => {
    const { data, error } = await supabase
      .from("learning_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Failed to get learning stats:", error);
      return null;
    }

    return data;
  };

  const updateLearningStats = async (
    userId: string,
    sessionDuration: number
  ) => {
    const today = new Date().toISOString().split("T")[0];

    const existing = await getLearningStats(userId);

    if (existing) {
      const lastDate = existing.last_session_date?.split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      let newStreak = existing.current_streak;
      if (lastDate === yesterday) {
        newStreak += 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }

      await supabase
        .from("learning_stats")
        .update({
          total_time_seconds: existing.total_time_seconds + sessionDuration,
          total_sessions: existing.total_sessions + 1,
          current_streak: newStreak,
          last_session_date: today,
        })
        .eq("user_id", userId);
    } else {
      await supabase.from("learning_stats").insert({
        user_id: userId,
        total_time_seconds: sessionDuration,
        total_sessions: 1,
        current_streak: 1,
        last_session_date: today,
      });
    }
  };

  return {
    saving,
    loading,
    startConversation,
    saveMessages,
    endConversation,
    getConversations,
    getConversationWithMessages,
    getLearningStats,
    updateLearningStats,
  };
}
