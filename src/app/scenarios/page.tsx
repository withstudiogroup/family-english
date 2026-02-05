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
  beginner: { label: "초급", color: "bg-emerald-500" },
  intermediate: { label: "중급", color: "bg-blue-500" },
  advanced: { label: "고급", color: "bg-purple-500" },
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 pb-48">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-800">시나리오 선택</h1>
            <div className="w-10" />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-indigo-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Scenario Grid */}
      <main className="max-w-2xl mx-auto px-5 py-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {filteredScenarios.map((scenario) => {
            const diff = difficultyInfo[scenario.difficulty as keyof typeof difficultyInfo];
            const isSelected = selectedScenario === scenario.id;

            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`relative p-4 sm:p-5 rounded-2xl text-left transition-all ${
                  isSelected
                    ? "bg-white ring-2 ring-indigo-500 shadow-lg"
                    : "bg-white hover:shadow-md shadow-sm"
                }`}
              >
                {/* Difficulty Badge */}
                <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full text-white font-medium ${diff.color}`}>
                  {diff.label}
                </span>

                {/* Icon */}
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected ? "bg-indigo-500" : "bg-indigo-100"
                }`}>
                  <scenario.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? "text-white" : "text-indigo-500"}`} />
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm sm:text-base text-gray-800 pr-6">{scenario.title}</h3>

                {/* Selected Check */}
                {isSelected && (
                  <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="max-w-2xl mx-auto px-5 py-4">
          {/* Selected Preview */}
          {selectedScenario && (
            <div className="flex items-center gap-3 p-3 mb-3 rounded-xl bg-indigo-50">
              {(() => {
                const selected = scenarios.find(s => s.id === selectedScenario);
                if (!selected) return null;
                return (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                      <selected.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-800">{selected.title}</p>
                      <p className="text-xs text-gray-500">AI와 역할극을 시작해요</p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!selectedScenario}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
              selectedScenario
                ? "bg-indigo-500 hover:bg-indigo-600 shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {selectedScenario ? (
              <>
                <Mic className="w-5 h-5" />
                대화 시작하기
              </>
            ) : (
              "시나리오를 선택해주세요"
            )}
          </button>

          {/* Free Talk Link */}
          <Link
            href="/chat?mode=free"
            className="block text-center mt-3 text-sm text-indigo-500 font-medium hover:underline"
          >
            시나리오 없이 자유롭게 대화할래요
          </Link>
        </div>
      </div>
    </div>
  );
}
