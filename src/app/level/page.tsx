"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Target, Trophy, Loader2, ArrowRight, Check, Sparkles } from "lucide-react";

type Level = "beginner" | "intermediate" | "advanced" | null;

export default function LevelPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<Level>(null);
  const [isLoading, setIsLoading] = useState(false);

  const levels = [
    { id: "beginner", icon: Award, title: "초급", subtitle: "Beginner", desc: "간단한 단어와 인사말", age: "초등 1-3학년", color: "bg-green-500" },
    { id: "intermediate", icon: Target, title: "중급", subtitle: "Intermediate", desc: "일상 대화를 자연스럽게", age: "초등 4-6학년", color: "bg-blue-500" },
    { id: "advanced", icon: Trophy, title: "고급", subtitle: "Advanced", desc: "자유롭게 의견을 나눠요", age: "중학생 이상", color: "bg-purple-500" },
  ];

  const handleContinue = () => {
    if (!selectedLevel) return;
    setIsLoading(true);
    setTimeout(() => router.push("/scenarios"), 500);
  };

  return (
    <div className="page-container">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <main className="page-content">
        {/* Header */}
        <div className="page-header">
          <div className="logo">
            <Sparkles strokeWidth={1.5} />
          </div>
          <h1>나의 영어 수준은?</h1>
          <p>맞춤 학습을 위해 수준을 선택해주세요</p>
        </div>

        {/* Level Cards */}
        <div className="w-full space-y-5 section-gap-lg">
          {levels.map((level) => {
            const isSelected = selectedLevel === level.id;
            return (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id as Level)}
                className={`w-full p-6 rounded-2xl text-left border-2 transition-all ${
                  isSelected ? "bg-primary/5 border-primary shadow-lg" : "bg-white border-transparent shadow"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${level.color} shadow-lg`}>
                    <level.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-text-primary">{level.title}</h3>
                      <span className="text-sm text-text-muted">{level.subtitle}</span>
                    </div>
                    <p className="text-text-secondary mb-2">{level.desc}</p>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full text-white ${level.color}`}>
                      {level.age}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="w-full">
          <button
            onClick={handleContinue}
            disabled={!selectedLevel || isLoading}
            className={`btn-primary btn-lg w-full flex items-center justify-center gap-3 ${!selectedLevel ? "opacity-50" : ""}`}
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> 저장 중...</>
            ) : (
              <>시나리오 선택하기 <ArrowRight className="w-5 h-5" /></>
            )}
          </button>

          <Link href="/dashboard" className="block text-center mt-6 text-text-muted hover:text-text-secondary">
            나중에 선택할게요
          </Link>
        </div>
      </main>
    </div>
  );
}
