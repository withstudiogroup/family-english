"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "home" | "history" | "profile";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  // Mock user data
  const user = {
    name: "민준",
    level: "intermediate",
    levelLabel: "중급",
    totalTime: 125, // minutes
    totalSessions: 18,
    weeklyStreak: 5,
    thisWeekSessions: 3,
  };

  // Mock recent sessions
  const recentSessions = [
    { id: 1, scenario: "패스트푸드 주문하기", icon: "🍔", date: "오늘", duration: 8, level: "중급" },
    { id: 2, scenario: "자기소개하기", icon: "👋", date: "어제", duration: 12, level: "중급" },
    { id: 3, scenario: "길 묻기", icon: "🗺️", date: "2일 전", duration: 6, level: "중급" },
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
    <div className="min-h-screen pb-24" style={{ background: "var(--cream)" }}>
      {/* Header */}
      <header
        className="px-6 pt-8 pb-6"
        style={{
          background: "linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%)"
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Greeting */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">안녕하세요! 👋</p>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {user.name}님
              </h1>
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "white"
              }}
            >
              🌿 {user.levelLabel}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "총 학습 시간", value: `${Math.floor(user.totalTime / 60)}시간 ${user.totalTime % 60}분`, icon: "⏱️" },
              { label: "연속 학습", value: `${user.weeklyStreak}일`, icon: "🔥" },
              { label: "이번 주", value: `${user.thisWeekSessions}회`, icon: "📚" },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-3 rounded-2xl text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <span className="text-2xl mb-1 block">{stat.icon}</span>
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-white/70 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 -mt-4 max-w-2xl mx-auto">
        {/* Start Learning Card */}
        <Link
          href="/scenarios"
          className="block p-6 rounded-3xl mb-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "white",
            boxShadow: "var(--shadow-medium)"
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce-soft"
              style={{
                background: "linear-gradient(135deg, var(--teal-light) 0%, var(--teal) 100%)"
              }}
            >
              <span className="text-3xl">🎤</span>
            </div>
            <div className="flex-1">
              <h2
                className="text-lg font-bold mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-primary)"
                }}
              >
                영어 대화 시작하기
              </h2>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                AI 선생님과 대화해보세요!
              </p>
            </div>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: "var(--teal)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Weekly Chart */}
        <div
          className="p-6 rounded-3xl mb-6"
          style={{
            background: "white",
            boxShadow: "var(--shadow-soft)"
          }}
        >
          <h3
            className="font-bold mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)"
            }}
          >
            📊 이번 주 학습
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
                  <span
                    className={`text-xs font-medium ${isToday ? "text-coral" : ""}`}
                    style={{ color: isToday ? "var(--coral)" : "var(--text-muted)" }}
                  >
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>

          <p
            className="text-center text-sm mt-4"
            style={{ color: "var(--text-muted)" }}
          >
            이번 주 총 <span className="font-bold" style={{ color: "var(--teal)" }}>
              {weeklyData.reduce((sum, d) => sum + d.minutes, 0)}분
            </span> 학습했어요!
          </p>
        </div>

        {/* Recent Sessions */}
        <div
          className="p-6 rounded-3xl"
          style={{
            background: "white",
            boxShadow: "var(--shadow-soft)"
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)"
              }}
            >
              📝 최근 대화
            </h3>
            <Link
              href="/history"
              className="text-sm font-medium"
              style={{ color: "var(--coral)" }}
            >
              전체 보기
            </Link>
          </div>

          <div className="space-y-3">
            {recentSessions.map((session) => (
              <Link
                key={session.id}
                href={`/history/${session.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01]"
                style={{ background: "var(--cream)" }}
              >
                <span className="text-2xl">{session.icon}</span>
                <div className="flex-1">
                  <p
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {session.scenario}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {session.date} · {session.duration}분 · {session.level}
                  </p>
                </div>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: "var(--text-muted)" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 px-6 py-4"
        style={{
          background: "white",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="max-w-2xl mx-auto flex justify-around">
          {[
            { id: "home", icon: "🏠", label: "홈", href: "/dashboard" },
            { id: "scenarios", icon: "🎭", label: "시나리오", href: "/scenarios" },
            { id: "history", icon: "📚", label: "기록", href: "/history" },
            { id: "profile", icon: "👤", label: "프로필", href: "/profile" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center gap-1 transition-all hover:scale-110"
            >
              <span className="text-2xl">{item.icon}</span>
              <span
                className="text-xs font-medium"
                style={{
                  color: item.id === "home" ? "var(--coral)" : "var(--text-muted)"
                }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
