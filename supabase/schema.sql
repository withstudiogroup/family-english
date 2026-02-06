-- FamilyEnglish Database Schema
-- Supabase SQL Editor에서 실행하세요
-- 주의: 기존 테이블이 있다면 먼저 삭제하거나 이 스크립트 실행 전 백업하세요

-- 1. Users 테이블 (프로필 정보) - 간단한 PIN 인증 방식
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  pin_code TEXT NOT NULL CHECK (length(pin_code) = 4), -- 4자리 숫자 비밀번호
  account_type TEXT NOT NULL DEFAULT 'child' CHECK (account_type IN ('parent', 'child')),
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Conversations 테이블 (대화 세션)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Messages 테이블 (대화 메시지)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  audio_url TEXT,
  feedback TEXT,
  translation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Learning Stats 테이블 (학습 통계)
CREATE TABLE IF NOT EXISTS public.learning_stats (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  total_time_seconds INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_session_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_started_at ON public.conversations(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_stats ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 접근 허용 (가족 앱으로 간단하게 구성)
-- 프로덕션에서는 더 엄격한 정책 필요
DROP POLICY IF EXISTS "Allow all for users" ON public.users;
DROP POLICY IF EXISTS "Allow all for conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow all for messages" ON public.messages;
DROP POLICY IF EXISTS "Allow all for learning_stats" ON public.learning_stats;

CREATE POLICY "Allow all for users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for learning_stats" ON public.learning_stats FOR ALL USING (true) WITH CHECK (true);

-- 트리거: updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON public.users;
DROP TRIGGER IF EXISTS learning_stats_updated_at ON public.learning_stats;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER learning_stats_updated_at
  BEFORE UPDATE ON public.learning_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 새 사용자 생성 시 learning_stats 자동 생성
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.learning_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_user_created ON public.users;

CREATE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION create_user_stats();

-- 테스트용 샘플 데이터 (선택사항)
-- INSERT INTO public.users (username, pin_code, account_type, level) VALUES
--   ('아빠', '1234', 'parent', 'intermediate'),
--   ('엄마', '1234', 'parent', 'beginner'),
--   ('민수', '1234', 'child', 'beginner'),
--   ('민지', '1234', 'child', 'beginner');
