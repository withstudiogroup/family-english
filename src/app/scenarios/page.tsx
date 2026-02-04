"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Home, 
  Users, 
  Clock, 
  Gamepad2,
  GraduationCap,
  UserPlus,
  BookOpen,
  UtensilsCrossed,
  Coffee,
  CalendarCheck,
  HelpCircle,
  Map,
  Bus,
  ShoppingBag,
  Ticket,
  Phone,
  MessageSquare,
  Mail,
  Mic,
  Check
} from "lucide-react";

type Category = "all" | "daily" | "school" | "food" | "going_out" | "communication";

const scenarios = [
  // Daily Life
  { id: "self-intro", icon: UserPlus, title: "자기소개하기", category: "daily", difficulty: "beginner" },
  { id: "family-intro", icon: Users, title: "가족 소개하기", category: "daily", difficulty: "beginner" },
  { id: "daily-routine", icon: Clock, title: "하루 일과 말하기", category: "daily", difficulty: "intermediate" },
  { id: "hobby-talk", icon: Gamepad2, title: "취미 이야기하기", category: "daily", difficulty: "intermediate" },
  // School
  { id: "school-life", icon: GraduationCap, title: "학교생활 이야기하기", category: "school", difficulty: "intermediate" },
  { id: "make-friends", icon: UserPlus, title: "친구 사귀기", category: "school", difficulty: "beginner" },
  { id: "class-time", icon: BookOpen, title: "수업 시간 대화", category: "school", difficulty: "intermediate" },
  // Food
  { id: "fast-food", icon: UtensilsCrossed, title: "패스트푸드 주문하기", category: "food", difficulty: "intermediate" },
  { id: "cafe-order", icon: Coffee, title: "카페에서 주문하기", category: "food", difficulty: "intermediate" },
  { id: "restaurant", icon: CalendarCheck, title: "레스토랑 예약하기", category: "food", difficulty: "advanced" },
  { id: "food-taste", icon: HelpCircle, title: "음식 맛 표현하기", category: "food", difficulty: "beginner" },
  // Going Out
  { id: "ask-directions", icon: Map, title: "길 묻고 답하기", category: "going_out", difficulty: "intermediate" },
  { id: "public-transport", icon: Bus, title: "버스/지하철 타기", category: "going_out", difficulty: "intermediate" },
  { id: "shopping", icon: ShoppingBag, title: "쇼핑하기", category: "going_out", difficulty: "intermediate" },
  { id: "buy-ticket", icon: Ticket, title: "티켓 구매하기", category: "going_out", difficulty: "advanced" },
  // Communication
  { id: "phone-call", icon: Phone, title: "전화로 약속 잡기", category: "communication", difficulty: "advanced" },
  { id: "text-message", icon: MessageSquare, title: "문자 메시지 보내기", category: "communication", difficulty: "intermediate" },
  { id: "email-writing", icon: Mail, title: "이메일 쓰기", category: "communication", difficulty: "advanced" },
];

const categories = [
  { id: "all", label: "전체", icon: Sparkles },
  { id: "daily", label: "일상", icon: Home },
  { id: "school", label: "학교", icon: GraduationCap },
  { id: "food", label: "음식", icon: UtensilsCrossed },
  { id: "going_out", label: "외출", icon: Map },
  { id: "communication", label: "소통", icon: MessageSquare },
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
    <div className="relative min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-20 px-6 py-4 bg-cream/90 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-soft text-text-secondary transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <h1 className="text-xl font-bold font-display text-text-primary">
              시나리오 선택
            </h1>

            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
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
                  <IconComponent className="w-4 h-4" strokeWidth={2} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Scenarios Grid */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 pb-72 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {filteredScenarios.map((scenario, index) => {
            const difficulty = difficultyInfo[scenario.difficulty as keyof typeof difficultyInfo];
            const isSelected = selectedScenario === scenario.id;
            const IconComponent = scenario.icon;

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
                <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium text-white"
                  style={{ background: difficulty.color }}
                >
                  {difficulty.label}
                </span>

                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300"
                  style={{
                    background: isSelected ? "var(--coral)" : "var(--coral-light)",
                    transform: isSelected ? "scale(1.1)" : "scale(1)"
                  }}
                >
                  <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="font-bold text-base leading-tight font-display text-text-primary">
                  {scenario.title}
                </h3>

                {/* Selected Check */}
                {isSelected && (
                  <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full flex items-center justify-center bg-coral animate-scale-in">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-cream via-cream/80 to-transparent pb-safe">
        <div className="max-w-2xl mx-auto">
          {/* Selected Scenario Preview */}
          {selectedScenario && (
            <div className="flex items-center gap-3 p-4 mb-4 rounded-2xl bg-white shadow-soft animate-slide-up">
              {(() => {
                const selected = scenarios.find(s => s.id === selectedScenario);
                if (!selected) return null;
                const IconComponent = selected.icon;
                return (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-coral flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold font-display text-text-primary">
                        {selected.title}
                      </p>
                      <p className="text-sm text-text-secondary">
                        AI와 역할극을 시작해요
                      </p>
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
            className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
              <>
                <span>대화 시작하기</span>
                <Mic className="w-5 h-5" strokeWidth={2} />
              </>
            ) : (
              "시나리오를 선택해주세요"
            )}
          </button>

          {/* Free Talk Option */}
          <Link
            href="/chat?mode=free"
            className="block text-center mt-4 font-medium text-teal transition-opacity hover:opacity-70 flex items-center justify-center gap-1"
          >
            <span>시나리오 없이 자유롭게 대화할래요</span>
            <MessageSquare className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
