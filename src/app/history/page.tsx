"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversation";
import type { Conversation } from "@/lib/supabase/types";
import {
  ArrowLeft,
  Home,
  Drama,
  BookOpen,
  User,
  Mic,
  ChevronRight,
  Loader2,
  Calendar,
  Clock,
} from "lucide-react";

const scenarioNames: Record<string, string> = {
  "fast-food": "패스트푸드 주문",
  "cafe-order": "카페 주문하기",
  "self-intro": "자기소개하기",
  "family-intro": "가족 소개하기",
  "daily-routine": "하루 일과 말하기",
  "hobby-talk": "취미 이야기하기",
  "ask-directions": "길 묻고 답하기",
  "shopping": "쇼핑하기",
  "free": "자유 대화",
};

export default function HistoryPage() {
  const router = useRouter();
  const { profile, loading: authLoading, isAuthenticated } = useAuth();
  const { getConversations, loading } = useConversation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (profile && !initialized) {
      setInitialized(true);
      loadConversations();
    }
  }, [profile, initialized]);

  const loadConversations = async () => {
    if (!profile) return;
    const data = await getConversations(profile.id);
    setConversations(data);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "오늘";
    if (days === 1) return "어제";
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}초`;
    return `${Math.floor(seconds / 60)}분`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-800">대화 기록</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-5 py-6">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Mic className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">
              아직 대화 기록이 없어요
            </h2>
            <p className="text-gray-500 text-center mb-6">
              AI 선생님과 영어로 대화해보세요!
            </p>
            <Link
              href="/scenarios"
              className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors"
            >
              대화 시작하기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/history/${conv.id}`}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">
                    {scenarioNames[conv.scenario_id] || conv.scenario_id}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(conv.started_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(conv.duration_seconds)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="max-w-2xl mx-auto px-4 py-2 flex justify-around">
          {[
            { id: "home", icon: Home, label: "홈", href: "/dashboard", active: false },
            { id: "scenarios", icon: Drama, label: "시나리오", href: "/scenarios", active: false },
            { id: "history", icon: BookOpen, label: "기록", href: "/history", active: true },
            { id: "profile", icon: User, label: "프로필", href: "/profile", active: false },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                item.active ? "text-indigo-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className="w-6 h-6" strokeWidth={item.active ? 2 : 1.5} />
              <span className={`text-[11px] ${item.active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
