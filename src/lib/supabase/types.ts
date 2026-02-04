export type UserLevel = "beginner" | "intermediate" | "advanced";
export type AccountType = "parent" | "child";

export interface User {
  id: string;
  username: string;
  account_type: AccountType;
  level: UserLevel;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  scenario_id: string;
  level: UserLevel;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  audio_url: string | null;
  feedback: string | null;
  translation: string | null;
  created_at: string;
}

export interface LearningStats {
  user_id: string;
  total_time_seconds: number;
  total_sessions: number;
  current_streak: number;
  last_session_date: string | null;
}
