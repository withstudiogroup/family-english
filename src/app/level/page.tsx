"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Target, Trophy, Loader2, ArrowRight, Sparkles } from "lucide-react";

type Level = "beginner" | "intermediate" | "advanced" | null;

export default function LevelPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<Level>(null);
  const [isLoading, setIsLoading] = useState(false);

  const levels = [
    {
      id: "beginner",
      icon: Award,
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
      icon: Target,
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
      icon: Trophy,
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
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-success opacity-8 animate-float" />
        <div className="absolute top-1/3 -right-16 w-48 h-48 rounded-full bg-sunny opacity-8 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/4 w-56 h-56 rounded-full bg-coral opacity-8 animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 py-12 sm:py-16 max-w-2xl mx-auto pt-safe pb-safe-lg">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-down">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-teal-light to-teal">
            <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 font-display text-text-primary">
            나의 영어 수준은?
          </h1>
          <p className="text-text-secondary">
            맞춤 학습을 위해 수준을 선택해주세요
          </p>
        </div>

        {/* Level Cards */}
        <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
          {levels.map((level, index) => {
            const IconComponent = level.icon;
            return (
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
                  {/* Icon & Badge */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-2 transition-transform duration-300"
                      style={{
                        background: `${level.color}20`,
                        transform: selectedLevel === level.id ? "scale(1.1)" : "scale(1)"
                      }}
                    >
                      <IconComponent className="w-7 h-7" style={{ color: level.color }} strokeWidth={2} />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium text-white"
                      style={{ background: level.color }}
                    >
                      {level.age}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold font-display text-text-primary">
                        {level.title}
                      </h3>
                      <span className="text-sm font-medium" style={{ color: level.color }}>
                        {level.subtitle}
                      </span>
                    </div>
                    <p className="text-sm mb-3 text-text-secondary">
                      {level.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {level.features.map((feature, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-lg bg-cream text-text-secondary">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {selectedLevel === level.id && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full animate-scale-in text-white"
                      style={{ background: level.color }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Auto Test Option */}
        <div className="p-5 rounded-2xl mb-6 bg-gradient-to-r from-teal-light to-teal animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1 font-display">
                잘 모르겠어요?
              </h3>
              <p className="text-sm text-white/80">
                AI가 간단한 대화로 수준을 찾아드려요
              </p>
            </div>
            <button
              onClick={handleAutoTest}
              className="px-4 py-2 rounded-xl font-bold bg-white text-teal-dark transition-all duration-300 hover:scale-105 active:scale-95"
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
            className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : selectedLevel ? (
              <>
                시나리오 선택하기
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              "수준을 선택해주세요"
            )}
          </button>
        </div>

        {/* Skip Link */}
        <Link
          href="/dashboard"
          className="block text-center mt-4 text-sm font-medium text-text-muted transition-opacity hover:opacity-70"
        >
          나중에 선택할게요
        </Link>
      </main>
    </div>
  );
}
