"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Sparkles, Home, Users, Clock, Gamepad2,
  UtensilsCrossed, Coffee, Map, ShoppingBag, Mic, Check, UserPlus
} from "lucide-react";

type Category = "all" | "daily" | "food" | "going_out";

const scenarios = [
  { id: "self-intro", icon: UserPlus, title: "자기소개하기", category: "daily", difficulty: "beginner" },
  { id: "family-intro", icon: Users, title: "가족 소개하기", category: "daily", difficulty: "beginner" },
  { id: "daily-routine", icon: Clock, title: "하루 일과 말하기", category: "daily", difficulty: "intermediate" },
  { id: "hobby-talk", icon: Gamepad2, title: "취미 이야기하기", category: "daily", difficulty: "intermediate" },
  { id: "fast-food", icon: UtensilsCrossed, title: "패스트푸드 주문", category: "food", difficulty: "intermediate" },
  { id: "cafe-order", icon: Coffee, title: "카페 주문하기", category: "food", difficulty: "intermediate" },
  { id: "ask-directions", icon: Map, title: "길 묻고 답하기", category: "going_out", difficulty: "intermediate" },
  { id: "shopping", icon: ShoppingBag, title: "쇼핑하기", category: "going_out", difficulty: "intermediate" },
];

const categories = [
  { id: "all", label: "전체", icon: Sparkles },
  { id: "daily", label: "일상", icon: Home },
  { id: "food", label: "음식", icon: UtensilsCrossed },
  { id: "going_out", label: "외출", icon: Map },
];

const difficultyInfo = {
  beginner: { label: "초급", bg: "bg-green-500" },
  intermediate: { label: "중급", bg: "bg-blue-500" },
  advanced: { label: "고급", bg: "bg-purple-500" },
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
    <div className="min-h-screen pb-56">
      {/* Header */}
      <header className="sticky top-0 z-20 px-6 py-5 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-5">
            <Link href="/dashboard" className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </Link>
            <h1 className="text-xl font-bold text-text-primary">시나리오 선택</h1>
            <div className="w-11" />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-text-secondary"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="px-6 py-8 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-5">
          {filteredScenarios.map((scenario) => {
            const diff = difficultyInfo[scenario.difficulty as keyof typeof difficultyInfo];
            const isSelected = selectedScenario === scenario.id;

            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`relative p-5 rounded-2xl text-left transition-all border-2 ${
                  isSelected ? "bg-primary/10 border-primary shadow-lg" : "bg-white border-transparent shadow"
                }`}
              >
                <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full text-white ${diff.bg}`}>
                  {diff.label}
                </span>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isSelected ? "bg-primary" : "bg-primary/10"
                }`}>
                  <scenario.icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-primary"}`} />
                </div>
                <h3 className="font-bold text-sm text-text-primary">{scenario.title}</h3>
                {isSelected && (
                  <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 pb-safe">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleStart}
            disabled={!selectedScenario}
            className={`btn-primary btn-lg w-full flex items-center justify-center gap-3 ${!selectedScenario ? "opacity-50" : ""}`}
          >
            {selectedScenario ? (
              <><Mic className="w-6 h-6" /> 대화 시작하기</>
            ) : (
              "시나리오를 선택해주세요"
            )}
          </button>

          <Link href="/chat?mode=free" className="block text-center mt-5 text-sm text-primary font-medium">
            시나리오 없이 자유롭게 대화할래요
          </Link>
        </div>
      </div>
    </div>
  );
}
