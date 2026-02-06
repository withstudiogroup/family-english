"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversation";
import type { Conversation } from "@/lib/supabase/types";
import { Home, Drama, BookOpen, User, Clock, Flame, BookMarked, Mic, ChevronRight, Loader2 } from "lucide-react";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

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

export default function DashboardPage() {
  const router = useRouter();
  const { profile, loading, isAuthenticated } = useAuth();
  const { getConversations, getLearningStats } = useConversation();

  const [stats, setStats] = useState<{
    total_time_seconds: number;
    total_sessions: number;
    current_streak: number;
  } | null>(null);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (profile && !dataLoaded) {
      setDataLoaded(true);
      loadData();
    }
  }, [profile, dataLoaded]);

  const loadData = async () => {
    if (!profile) return;

    const [statsData, conversationsData] = await Promise.all([
      getLearningStats(profile.id),
      getConversations(profile.id),
    ]);

    if (statsData) {
      setStats(statsData);
    }
    setRecentConversations(conversationsData.slice(0, 3));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}시간`;
    return `${minutes}분`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "오늘";
    if (days === 1) return "어제";
    return `${days}일 전`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const totalMinutes = Math.floor((stats?.total_time_seconds || 0) / 60);
  const displayTime = totalMinutes >= 60
    ? `${Math.floor(totalMinutes / 60)}시간`
    : `${totalMinutes}분`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600">
        <div className="max-w-2xl mx-auto px-5 pt-10 pb-24 sm:pt-12 sm:pb-28">
          {/* 인사말 */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-indigo-200 text-sm mb-1">안녕하세요</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {profile?.username || "사용자"}님
              </h1>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
              {LEVEL_LABELS[profile?.level || "beginner"]}
            </span>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "총 학습", value: displayTime, icon: Clock },
              { label: "연속", value: `${stats?.current_streak || 0}일`, icon: Flame },
              { label: "총 대화", value: `${stats?.total_sessions || 0}회`, icon: BookMarked },
            ].map((stat, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-white/90" strokeWidth={1.5} />
                <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                <p className="text-[11px] sm:text-xs text-indigo-200 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-2xl mx-auto px-5 -mt-16 pb-28">
        {/* CTA 버튼 */}
        <Link
          href="/scenarios"
          className="flex items-center justify-center gap-3 w-full py-4 sm:py-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow mb-6"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-800">영어 대화 시작하기</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        {/* 최근 대화 */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">최근 대화</h3>
            <Link href="/history" className="text-sm text-indigo-500 font-medium hover:underline">
              전체 보기
            </Link>
          </div>

          {recentConversations.length > 0 ? (
            <div className="space-y-3">
              {recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/history/${conv.id}`}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                      {scenarioNames[conv.scenario_id] || conv.scenario_id}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      {formatDate(conv.started_at)} · {Math.floor(conv.duration_seconds / 60)}분
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Mic className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">아직 대화 기록이 없어요</p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="max-w-2xl mx-auto px-4 py-2 flex justify-around">
          {[
            { id: "home", icon: Home, label: "홈", href: "/dashboard", active: true },
            { id: "scenarios", icon: Drama, label: "시나리오", href: "/scenarios", active: false },
            { id: "history", icon: BookOpen, label: "기록", href: "/history", active: false },
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
              <span className={`text-[11px] ${item.active ? "font-semibold" : "font-medium"}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
