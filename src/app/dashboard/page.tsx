"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Home, Drama, BookOpen, User, Clock, Flame, BookMarked, Mic, ChevronRight, Loader2 } from "lucide-react";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export default function DashboardPage() {
  const router = useRouter();
  const { profile, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const user = {
    name: profile?.username || "사용자",
    levelLabel: LEVEL_LABELS[profile?.level || "beginner"],
    totalTime: 125,
    weeklyStreak: 5,
    thisWeekSessions: 3,
  };

  const recentSessions = [
    { id: 1, scenario: "패스트푸드 주문하기", date: "오늘", duration: 8 },
    { id: 2, scenario: "자기소개하기", date: "어제", duration: 12 },
  ];

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="px-6 pt-12 pb-10 bg-gradient-to-br from-primary via-primary-dark to-secondary-dark">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/70 text-sm mb-2">안녕하세요</p>
              <h1 className="text-3xl font-bold text-white">{user.name}님</h1>
            </div>
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
              {user.levelLabel}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "총 학습", value: `${Math.floor(user.totalTime / 60)}시간`, icon: Clock },
              { label: "연속", value: `${user.weeklyStreak}일`, icon: Flame },
              { label: "이번 주", value: `${user.thisWeekSessions}회`, icon: BookMarked },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl text-center bg-white/15 backdrop-blur">
                <stat.icon className="w-6 h-6 mb-2 mx-auto text-white" strokeWidth={1.5} />
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-white/70 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="px-6 -mt-5 max-w-lg mx-auto">
        {/* 대화 시작 버튼 */}
        <Link
          href="/scenarios"
          className="btn-primary btn-lg w-full flex items-center justify-center gap-4 mb-8 shadow-xl"
        >
          <Mic className="w-7 h-7" />
          영어 대화 시작하기
        </Link>

        {/* 최근 대화 */}
        <div className="card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-text-primary">최근 대화</h3>
            <Link href="/history" className="text-sm text-primary font-medium">전체 보기</Link>
          </div>

          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary">{session.scenario}</p>
                  <p className="text-sm text-text-muted mt-1">{session.date} · {session.duration}분</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 px-6 py-5 bg-white border-t border-gray-100 pb-safe">
        <div className="max-w-lg mx-auto flex justify-around">
          {[
            { id: "home", icon: Home, label: "홈", href: "/dashboard", active: true },
            { id: "scenarios", icon: Drama, label: "시나리오", href: "/scenarios" },
            { id: "history", icon: BookOpen, label: "기록", href: "/history" },
            { id: "profile", icon: User, label: "프로필", href: "/profile" },
          ].map((item) => (
            <Link key={item.id} href={item.href} className="flex flex-col items-center gap-1.5">
              <item.icon className={`w-6 h-6 ${item.active ? "text-primary" : "text-text-muted"}`} strokeWidth={1.5} />
              <span className={`text-xs ${item.active ? "text-primary font-semibold" : "text-text-muted"}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
