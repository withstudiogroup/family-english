"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Category = "all" | "daily" | "school" | "food" | "going_out" | "communication";

const scenarios = [
  // Daily Life
  { id: "self-intro", icon: "👋", title: "자기소개하기", category: "daily", difficulty: "beginner" },
  { id: "family-intro", icon: "👨‍👩‍👧‍👦", title: "가족 소개하기", category: "daily", difficulty: "beginner" },
  { id: "daily-routine", icon: "⏰", title: "하루 일과 말하기", category: "daily", difficulty: "intermediate" },
  { id: "hobby-talk", icon: "🎮", title: "취미 이야기하기", category: "daily", difficulty: "intermediate" },
  // School
  { id: "school-life", icon: "🏫", title: "학교생활 이야기하기", category: "school", difficulty: "intermediate" },
  { id: "make-friends", icon: "🤝", title: "친구 사귀기", category: "school", difficulty: "beginner" },
  { id: "class-time", icon: "📖", title: "수업 시간 대화", category: "school", difficulty: "intermediate" },
  // Food
  { id: "fast-food", icon: "🍔", title: "패스트푸드 주문하기", category: "food", difficulty: "intermediate" },
  { id: "cafe-order", icon: "☕", title: "카페에서 주문하기", category: "food", difficulty: "intermediate" },
  { id: "restaurant", icon: "🍽️", title: "레스토랑 예약하기", category: "food", difficulty: "advanced" },
  { id: "food-taste", icon: "😋", title: "음식 맛 표현하기", category: "food", difficulty: "beginner" },
  // Going Out
  { id: "ask-directions", icon: "🗺️", title: "길 묻고 답하기", category: "going_out", difficulty: "intermediate" },
  { id: "public-transport", icon: "🚌", title: "버스/지하철 타기", category: "going_out", difficulty: "intermediate" },
  { id: "shopping", icon: "🛍️", title: "쇼핑하기", category: "going_out", difficulty: "intermediate" },
  { id: "buy-ticket", icon: "🎫", title: "티켓 구매하기", category: "going_out", difficulty: "advanced" },
  // Communication
  { id: "phone-call", icon: "📞", title: "전화로 약속 잡기", category: "communication", difficulty: "advanced" },
  { id: "text-message", icon: "💬", title: "문자 메시지 보내기", category: "communication", difficulty: "intermediate" },
  { id: "email-writing", icon: "📧", title: "이메일 쓰기", category: "communication", difficulty: "advanced" },
];

const categories = [
  { id: "all", label: "전체", icon: "✨" },
  { id: "daily", label: "일상", icon: "🏠" },
  { id: "school", label: "학교", icon: "🏫" },
  { id: "food", label: "음식", icon: "🍴" },
  { id: "going_out", label: "외출", icon: "🚶" },
  { id: "communication", label: "소통", icon: "💬" },
];

const difficultyInfo = {
  beginner: { label: "초급", color: "var(--success)" },
  intermediate: { label: "중급", color: "var(--sunny-dark)" },
  advanced: { label: "고급", color: "var(--coral)" },
};

export default function ScenariosPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const filteredScenarios = selectedCategory === "all"
    ? scenarios
    : scenarios.filter(s => s.category === selectedCategory);

  const handleStart = () => {
    if (!selectedScenario) return;
    router.push(`/chat?scenario=${selectedScenario}`);
  };

  return (
    <div className="relative min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-20 px-6 py-4"
        style={{
          background: "rgba(255, 248, 240, 0.9)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105"
              style={{
                background: "white",
                boxShadow: "var(--shadow-soft)",
                color: "var(--text-secondary)"
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)"
              }}
            >
              시나리오 선택
            </h1>

            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300"
                style={{
                  background: selectedCategory === cat.id
                    ? "linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%)"
                    : "white",
                  color: selectedCategory === cat.id ? "white" : "var(--text-secondary)",
                  boxShadow: selectedCategory === cat.id
                    ? "0 4px 15px rgba(255, 138, 101, 0.3)"
                    : "var(--shadow-soft)"
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Scenarios Grid */}
      <main className="px-6 py-8 pb-36 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-5">
          {filteredScenarios.map((scenario, index) => {
            const difficulty = difficultyInfo[scenario.difficulty as keyof typeof difficultyInfo];
            const isSelected = selectedScenario === scenario.id;

            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className="relative p-5 rounded-2xl text-left transition-all duration-300 animate-slide-up"
                style={{
                  background: isSelected ? "var(--coral-light)" : "white",
                  boxShadow: isSelected
                    ? "0 8px 30px rgba(255, 138, 101, 0.3)"
                    : "var(--shadow-soft)",
                  border: isSelected ? "3px solid var(--coral)" : "3px solid transparent",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  animationDelay: `${index * 0.05}s`
                }}
              >
                {/* Difficulty Badge */}
                <span
                  className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: difficulty.color,
                    color: "white"
                  }}
                >
                  {difficulty.label}
                </span>

                {/* Icon */}
                <span
                  className="text-4xl mb-3 block transition-transform duration-300"
                  style={{
                    transform: isSelected ? "scale(1.15)" : "scale(1)"
                  }}
                >
                  {scenario.icon}
                </span>

                {/* Title */}
                <h3
                  className="font-bold text-base leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)"
                  }}
                >
                  {scenario.title}
                </h3>

                {/* Selected Check */}
                {isSelected && (
                  <div
                    className="absolute bottom-3 right-3 w-6 h-6 rounded-full flex items-center justify-center animate-scale-in"
                    style={{
                      background: "var(--coral)",
                      color: "white"
                    }}
                  >
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 p-6"
        style={{
          background: "linear-gradient(to top, var(--cream) 80%, transparent)"
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Selected Scenario Preview */}
          {selectedScenario && (
            <div
              className="flex items-center gap-3 p-4 mb-4 rounded-2xl animate-slide-up"
              style={{
                background: "white",
                boxShadow: "var(--shadow-soft)"
              }}
            >
              <span className="text-3xl">
                {scenarios.find(s => s.id === selectedScenario)?.icon}
              </span>
              <div className="flex-1">
                <p
                  className="font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)"
                  }}
                >
                  {scenarios.find(s => s.id === selectedScenario)?.title}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  AI와 역할극을 시작해요
                </p>
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!selectedScenario}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: selectedScenario
                ? "linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%)"
                : "var(--text-muted)",
              boxShadow: selectedScenario
                ? "0 4px 20px rgba(255, 138, 101, 0.4)"
                : "none"
            }}
          >
            {selectedScenario ? (
              <span className="flex items-center justify-center gap-2">
                <span>대화 시작하기</span>
                <span className="text-xl">🎤</span>
              </span>
            ) : (
              "시나리오를 선택해주세요"
            )}
          </button>

          {/* Free Talk Option */}
          <Link
            href="/chat?mode=free"
            className="block text-center mt-4 font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--teal)" }}
          >
            시나리오 없이 자유롭게 대화할래요 💬
          </Link>
        </div>
      </div>
    </div>
  );
}
