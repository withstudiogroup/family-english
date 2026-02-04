"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Home, Drama, BookOpen, User, Clock, Flame, BookMarked, Mic, ChevronRight } from "lucide-react";

type Tab = "home" | "history" | "profile";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export default function DashboardPage() {
  const router = useRouter();
  const { profile, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-coral border-t-transparent" />
      </div>
    );
  }

  // User data from profile
  const user = {
    name: profile?.username || "사용자",
    level: profile?.level || "beginner",
    levelLabel: LEVEL_LABELS[profile?.level || "beginner"],
    totalTime: 125, // TODO: DB에서 가져오기
    totalSessions: 18,
    weeklyStreak: 5,
    thisWeekSessions: 3,
  };

  // Mock recent sessions
  const recentSessions = [
    { id: 1, scenario: "패스트푸드 주문하기", date: "오늘", duration: 8, level: "중급" },
    { id: 2, scenario: "자기소개하기", date: "어제", duration: 12, level: "중급" },
    { id: 3, scenario: "길 묻기", date: "2일 전", duration: 6, level: "중급" },
  ];

  // Mock weekly data for chart
  const weeklyData = [
    { day: "월", minutes: 15 },
    { day: "화", minutes: 8 },
    { day: "수", minutes: 0 },
    { day: "목", minutes: 12 },
    { day: "금", minutes: 10 },
    { day: "토", minutes: 0 },
    { day: "일", minutes: 5 },
  ];

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 15);

  return (
    <div className="min-h-screen pb-20 sm:pb-24 bg-cream pb-safe-lg">
      {/* Header */}
      <header className="px-6 pt-8 pb-6 bg-gradient-to-r from-coral to-coral-dark">
        <div className="max-w-2xl mx-auto">
          {/* Greeting */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">안녕하세요</p>
              <h1 className="text-2xl font-bold text-white font-display">
                {user.name}님
              </h1>
            </div>
            <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white">
              {user.levelLabel}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "총 학습 시간", value: `${Math.floor(user.totalTime / 60)}시간 ${user.totalTime % 60}분`, icon: Clock },
              { label: "연속 학습", value: `${user.weeklyStreak}일`, icon: Flame },
              { label: "이번 주", value: `${user.thisWeekSessions}회`, icon: BookMarked },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="p-2 sm:p-3 rounded-xl sm:rounded-2xl text-center bg-white/15 backdrop-blur-sm">
                  <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 mb-1 mx-auto text-white" strokeWidth={2} />
                  <p className="text-white font-bold text-sm sm:text-lg">{stat.value}</p>
                  <p className="text-white/70 text-[10px] sm:text-xs">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 -mt-4 max-w-2xl mx-auto">
        {/* Start Learning Card */}
        <Link
          href="/scenarios"
          className="block p-6 rounded-3xl mb-6 bg-white shadow-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-teal-light to-teal animate-bounce-soft">
              <Mic className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1 font-display text-text-primary">
                영어 대화 시작하기
              </h2>
              <p className="text-sm text-text-secondary">
                AI 선생님과 대화해보세요
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-teal" strokeWidth={2} />
          </div>
        </Link>

        {/* Weekly Chart */}
        <div className="p-6 rounded-3xl mb-6 bg-white shadow-soft">
          <h3 className="font-bold mb-4 font-display text-text-primary">
            이번 주 학습
          </h3>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((data, index) => {
              const height = data.minutes > 0 ? (data.minutes / maxMinutes) * 100 : 4;
              const isToday = index === new Date().getDay() - 1 || (index === 6 && new Date().getDay() === 0);

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${height}%`,
                      minHeight: "4px",
                      background: data.minutes > 0
                        ? isToday
                          ? "linear-gradient(to top, var(--coral), var(--coral-light))"
                          : "linear-gradient(to top, var(--teal), var(--teal-light))"
                        : "var(--cream-dark)"
                    }}
                  />
                  <span className={`text-xs font-medium ${isToday ? "text-coral" : "text-text-muted"}`}>
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm mt-4 text-text-muted">
            이번 주 총 <span className="font-bold text-teal">
              {weeklyData.reduce((sum, d) => sum + d.minutes, 0)}분
            </span> 학습했어요
          </p>
        </div>

        {/* Recent Sessions */}
        <div className="p-6 rounded-3xl bg-white shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-text-primary">
              최근 대화
            </h3>
            <Link href="/history" className="text-sm font-medium text-coral">
              전체 보기
            </Link>
          </div>

          <div className="space-y-3">
            {recentSessions.map((session) => (
              <Link
                key={session.id}
                href={`/history/${session.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-cream transition-all hover:scale-[1.01]"
              >
                <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-coral" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">
                    {session.scenario}
                  </p>
                  <p className="text-xs text-text-muted">
                    {session.date} · {session.duration}분 · {session.level}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted" />
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 px-4 sm:px-6 py-3 sm:py-4 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-2xl mx-auto flex justify-around">
          {[
            { id: "home", icon: Home, label: "홈", href: "/dashboard" },
            { id: "scenarios", icon: Drama, label: "시나리오", href: "/scenarios" },
            { id: "history", icon: BookOpen, label: "기록", href: "/history" },
            { id: "profile", icon: User, label: "프로필", href: "/profile" },
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center gap-1 transition-all hover:scale-110"
              >
                <IconComponent 
                  className="w-6 h-6" 
                  strokeWidth={2}
                  style={{ color: item.id === "home" ? "var(--coral)" : "var(--text-muted)" }}
                />
                <span className="text-xs font-medium"
                  style={{ color: item.id === "home" ? "var(--coral)" : "var(--text-muted)" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
