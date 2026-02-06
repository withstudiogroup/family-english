"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserLevel } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversation";
import {
  Home,
  Drama,
  BookOpen,
  User,
  LogOut,
  ChevronRight,
  Loader2,
  Clock,
  Flame,
  BookMarked,
  GraduationCap,
  Check,
} from "lucide-react";

const LEVEL_CONFIG: Record<UserLevel, { label: string; color: string; description: string }> = {
  beginner: {
    label: "초급",
    color: "bg-emerald-500",
    description: "기초 단어와 간단한 문장",
  },
  intermediate: {
    label: "중급",
    color: "bg-blue-500",
    description: "일상 대화와 다양한 표현",
  },
  advanced: {
    label: "고급",
    color: "bg-purple-500",
    description: "자연스러운 영어 대화",
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading: authLoading, isAuthenticated, signOut, updateLevel } = useAuth();
  const { getLearningStats } = useConversation();
  const [stats, setStats] = useState<{
    total_time_seconds: number;
    total_sessions: number;
    current_streak: number;
  } | null>(null);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      loadStats();
    }
  }, [profile]);

  const loadStats = async () => {
    if (!profile) return;
    const data = await getLearningStats(profile.id);
    if (data) {
      setStats(data);
    }
  };

  const handleLevelChange = async (level: UserLevel) => {
    setUpdating(true);
    try {
      await updateLevel(level);
      setShowLevelPicker(false);
    } catch (error) {
      console.error("Failed to update level:", error);
    }
    setUpdating(false);
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const currentLevel = profile?.level || "beginner";
  const levelConfig = LEVEL_CONFIG[currentLevel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600">
        <div className="max-w-2xl mx-auto px-5 pt-10 pb-20">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
              {profile?.account_type === "parent" ? "👨" : "👧"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile?.username}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${levelConfig.color}`}>
                  {levelConfig.label}
                </span>
                <span className="text-indigo-200 text-sm">
                  {profile?.account_type === "parent" ? "부모" : "자녀"} 계정
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 -mt-10">
        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <h2 className="font-bold text-gray-800 mb-4">학습 통계</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-500" />
              </div>
              <p className="text-lg font-bold text-gray-800">
                {stats ? formatTime(stats.total_time_seconds) : "0분"}
              </p>
              <p className="text-xs text-gray-500">총 학습시간</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-orange-100 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-lg font-bold text-gray-800">
                {stats?.current_streak || 0}일
              </p>
              <p className="text-xs text-gray-500">연속 학습</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-100 flex items-center justify-center">
                <BookMarked className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-lg font-bold text-gray-800">
                {stats?.total_sessions || 0}회
              </p>
              <p className="text-xs text-gray-500">총 대화</p>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
          <h2 className="font-bold text-gray-800 px-5 pt-5 pb-3">설정</h2>

          {/* Level Setting */}
          <button
            onClick={() => setShowLevelPicker(true)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">학습 레벨</p>
                <p className="text-sm text-gray-500">{levelConfig.label} - {levelConfig.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="h-px bg-gray-100 mx-5" />

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-red-500"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-medium">로그아웃</span>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>FamilyEnglish v1.0</p>
          <p className="mt-1">AI 영어 학습 앱</p>
        </div>
      </div>

      {/* Level Picker Modal */}
      {showLevelPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl p-5 pb-8 safe-area-bottom animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">학습 레벨 선택</h2>
              <button
                onClick={() => setShowLevelPicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                닫기
              </button>
            </div>

            <div className="space-y-3">
              {(Object.keys(LEVEL_CONFIG) as UserLevel[]).map((level) => {
                const config = LEVEL_CONFIG[level];
                const isSelected = currentLevel === level;

                return (
                  <button
                    key={level}
                    onClick={() => handleLevelChange(level)}
                    disabled={updating}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isSelected
                        ? "bg-indigo-50 ring-2 ring-indigo-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${config.color}`}>
                      {config.label}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-800">{config.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="max-w-2xl mx-auto px-4 py-2 flex justify-around">
          {[
            { id: "home", icon: Home, label: "홈", href: "/dashboard", active: false },
            { id: "scenarios", icon: Drama, label: "시나리오", href: "/scenarios", active: false },
            { id: "history", icon: BookOpen, label: "기록", href: "/history", active: false },
            { id: "profile", icon: User, label: "프로필", href: "/profile", active: true },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                item.active ? "text-indigo-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className="w-6 h-6" strokeWidth={item.active ? 2 : 1.5} />
              <span className={`text-[11px] ${item.active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
