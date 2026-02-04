"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Level = "beginner" | "intermediate" | "advanced" | null;

export default function LevelPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<Level>(null);
  const [isLoading, setIsLoading] = useState(false);

  const levels = [
    {
      id: "beginner",
      emoji: "🌱",
      title: "초급",
      subtitle: "Beginner",
      description: "간단한 단어와 인사말을 배워요",
      age: "초등 1-3학년",
      color: "var(--success)",
      bgColor: "rgba(129, 199, 132, 0.15)",
      features: ["기본 인사", "숫자와 색깔", "가족 소개"]
    },
    {
      id: "intermediate",
      emoji: "🌿",
      title: "중급",
      subtitle: "Intermediate",
      description: "일상 대화를 자연스럽게 해요",
      age: "초등 4-6학년",
      color: "var(--sunny-dark)",
      bgColor: "rgba(255, 213, 79, 0.15)",
      features: ["일상 대화", "취미 이야기", "감정 표현"]
    },
    {
      id: "advanced",
      emoji: "🌳",
      title: "고급",
      subtitle: "Advanced",
      description: "자유롭게 의견을 나눠요",
      age: "중학생 이상",
      color: "var(--coral)",
      bgColor: "rgba(255, 138, 101, 0.15)",
      features: ["토론하기", "뉴스 이야기", "복잡한 문장"]
    }
  ];

  const handleContinue = () => {
    if (!selectedLevel) return;
    setIsLoading(true);
    // TODO: Save level to Supabase
    setTimeout(() => {
      router.push("/scenarios");
    }, 800);
  };

  const handleAutoTest = () => {
    setIsLoading(true);
    // TODO: Auto level test
    setTimeout(() => {
      router.push("/chat?mode=level-test");
    }, 500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 -left-20 w-64 h-64 rounded-full animate-float"
          style={{
            background: "var(--success)",
            opacity: 0.08,
          }}
        />
        <div
          className="absolute top-1/3 -right-16 w-48 h-48 rounded-full animate-float"
          style={{
            background: "var(--sunny)",
            opacity: 0.08,
            animationDelay: "1s"
          }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-56 h-56 rounded-full animate-float"
          style={{
            background: "var(--coral)",
            opacity: 0.08,
            animationDelay: "2s"
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 py-12 sm:py-16 max-w-2xl mx-auto pt-safe pb-safe-lg">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-down">
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, var(--teal-light) 0%, var(--teal) 100%)",
            }}
          >
            <span className="text-3xl">📚</span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)"
            }}
          >
            나의 영어 수준은?
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            맞춤 학습을 위해 수준을 선택해주세요
          </p>
        </div>

        {/* Level Cards */}
        <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
          {levels.map((level, index) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id as Level)}
              className="w-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl text-left transition-all duration-300 animate-slide-up"
              style={{
                background: selectedLevel === level.id ? level.bgColor : "white",
                boxShadow: selectedLevel === level.id
                  ? `0 8px 30px ${level.color}40`
                  : "var(--shadow-soft)",
                border: selectedLevel === level.id
                  ? `2px solid ${level.color}`
                  : "2px solid transparent",
                transform: selectedLevel === level.id ? "scale(1.02)" : "scale(1)",
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex items-start gap-4">
                {/* Emoji & Badge */}
                <div className="flex flex-col items-center">
                  <span
                    className="text-4xl mb-2 transition-transform duration-300"
                    style={{
                      transform: selectedLevel === level.id ? "scale(1.2)" : "scale(1)"
                    }}
                  >
                    {level.emoji}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      background: level.color,
                      color: "white"
                    }}
                  >
                    {level.age}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="text-xl font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--text-primary)"
                      }}
                    >
                      {level.title}
                    </h3>
                    <span
                      className="text-sm font-medium"
                      style={{ color: level.color }}
                    >
                      {level.subtitle}
                    </span>
                  </div>
                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {level.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {level.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-lg"
                        style={{
                          background: "var(--cream)",
                          color: "var(--text-secondary)"
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Selected Indicator */}
                {selectedLevel === level.id && (
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full animate-scale-in"
                    style={{
                      background: level.color,
                      color: "white"
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Auto Test Option */}
        <div
          className="p-5 rounded-2xl mb-6 animate-fade-in"
          style={{
            background: "linear-gradient(135deg, var(--teal-light) 0%, var(--teal) 100%)",
            animationDelay: "0.3s"
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🎯</span>
            <div className="flex-1">
              <h3
                className="font-bold text-white mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                잘 모르겠어요?
              </h3>
              <p className="text-sm text-white/80">
                AI가 간단한 대화로 수준을 찾아드려요
              </p>
            </div>
            <button
              onClick={handleAutoTest}
              className="px-4 py-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "white",
                color: "var(--teal-dark)"
              }}
            >
              테스트하기
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleContinue}
            disabled={!selectedLevel || isLoading}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: selectedLevel
                ? "linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%)"
                : "var(--text-muted)",
              boxShadow: selectedLevel
                ? "0 4px 20px rgba(255, 138, 101, 0.4)"
                : "none"
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                저장 중...
              </span>
            ) : selectedLevel ? (
              "시나리오 선택하기 →"
            ) : (
              "수준을 선택해주세요"
            )}
          </button>
        </div>

        {/* Skip Link */}
        <Link
          href="/dashboard"
          className="block text-center mt-4 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          나중에 선택할게요
        </Link>
      </main>
    </div>
  );
}
