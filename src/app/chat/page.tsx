"use client";

import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRealtime } from "@/hooks/useRealtime";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversation";
import { ArrowLeft, Mic, MicOff, Languages, Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  translation?: string;
};

const scenarioNames: Record<string, string> = {
  "fast-food": "패스트푸드 주문",
  "cafe-order": "카페 주문",
  "self-intro": "자기소개",
  "family-intro": "가족 소개하기",
  "daily-routine": "하루 일과 말하기",
  "hobby-talk": "취미 이야기하기",
  "ask-directions": "길 묻기",
  "shopping": "쇼핑하기",
  "free": "자유 대화",
};

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenario = searchParams.get("scenario") || "free";
  const { profile } = useAuth();
  const level = profile?.level || "intermediate";

  const [messages, setMessages] = useState<Message[]>([]);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const {
    startConversation,
    saveMessages,
    endConversation,
    updateLearningStats,
  } = useConversation();

  const handleMessage = useCallback((message: { id: string; role: "user" | "assistant"; content: string; timestamp: Date }) => {
    setMessages(prev => [...prev, message as Message]);
  }, []);

  const handleError = useCallback((error: string) => {
    console.error("Realtime error:", error);
  }, []);

  const {
    isConnected,
    isRecording,
    isAiSpeaking,
    connectionError,
    connect,
    disconnect,
    toggleRecording,
  } = useRealtime({
    scenario,
    level: level as "beginner" | "intermediate" | "advanced",
    onMessage: handleMessage,
    onError: handleError,
  });

  const hasConnected = useRef(false);
  useEffect(() => {
    if (hasConnected.current) return;
    hasConnected.current = true;
    startTimeRef.current = new Date();
    connect();

    if (profile) {
      startConversation(profile.id, scenario, level).then((id) => {
        conversationIdRef.current = id;
      });
    }

    return () => {
      disconnect();
      hasConnected.current = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTranslate = async (messageId: string, content: string) => {
    setTranslatingId(messageId);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, targetLang: "ko" }),
      });
      const data = await response.json();
      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, translation: data.translation } : m
      ));
    } catch (error) {
      console.error("Translation failed:", error);
    }
    setTranslatingId(null);
  };

  const handleEndChat = async () => {
    if (saving) return;
    setSaving(true);

    try {
      disconnect();

      if (profile && conversationIdRef.current && messages.length > 0) {
        const duration = Math.floor(
          (new Date().getTime() - startTimeRef.current.getTime()) / 1000
        );

        await saveMessages(
          conversationIdRef.current,
          messages.map((m) => ({
            role: m.role,
            content: m.content,
            translation: m.translation,
          }))
        );

        await endConversation(conversationIdRef.current, duration);
        await updateLearningStats(profile.id, duration);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save conversation:", error);
      router.push("/dashboard");
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-100 to-purple-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <Link
          href="/scenarios"
          className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div className="text-center">
          <h1 className="text-base font-bold text-gray-800">{scenarioNames[scenario] || "영어 대화"}</h1>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-orange-400 animate-pulse"}`} />
            <span className="text-xs text-gray-500">{isConnected ? "연결됨" : "연결 중..."}</span>
          </div>
        </div>
        <div className="w-10" />
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Loading State */}
          {!isConnected && !connectionError && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
              <p className="text-gray-500">AI 선생님 연결 중...</p>
            </div>
          )}

          {/* Error State */}
          {connectionError && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 text-center mb-4">{connectionError}</p>
              <button
                onClick={() => connect()}
                className="px-6 py-2 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* AI Avatar */}
              {message.role === "assistant" && (
                <div className="flex-shrink-0 mr-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                </div>
              )}

              <div className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-indigo-500 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>

                  {/* Translation */}
                  {message.translation && (
                    <p className={`text-[13px] mt-2 pt-2 border-t ${
                      message.role === "user"
                        ? "border-indigo-400 text-indigo-100"
                        : "border-gray-200 text-gray-500"
                    }`}>
                      {message.translation}
                    </p>
                  )}
                </div>

                {/* Time & Translate Button */}
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[11px] text-gray-400">{formatTime(message.timestamp)}</span>
                  {message.role === "assistant" && !message.translation && (
                    <button
                      onClick={() => handleTranslate(message.id, message.content)}
                      disabled={translatingId === message.id}
                      className="flex items-center gap-1 text-[11px] text-indigo-500 hover:underline disabled:opacity-50"
                    >
                      <Languages className="w-3 h-3" />
                      {translatingId === message.id ? "번역 중..." : "번역"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 safe-area-bottom">
        <div className="max-w-2xl mx-auto">
          {/* Status */}
          <p className="text-center text-sm text-gray-500 mb-3">
            {isAiSpeaking ? (
              <span className="flex items-center justify-center gap-2">
                <span className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1 bg-indigo-500 rounded-full animate-pulse"
                      style={{ height: `${8 + (i % 2) * 6}px`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </span>
                AI가 말하는 중...
              </span>
            ) : isRecording ? (
              <span className="flex items-center justify-center gap-2 text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                듣고 있어요...
              </span>
            ) : isConnected ? (
              "마이크 버튼을 눌러 말하세요"
            ) : (
              "연결 중..."
            )}
          </p>

          {/* Mic Button */}
          <div className="flex justify-center mb-3">
            <button
              onClick={toggleRecording}
              disabled={!isConnected || isAiSpeaking}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 scale-110"
                  : "bg-indigo-500 hover:bg-indigo-600"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isRecording ? (
                <MicOff className="w-7 h-7 text-white" />
              ) : (
                <Mic className="w-7 h-7 text-white" />
              )}
            </button>
          </div>

          {/* Exit Button */}
          <button
            onClick={handleEndChat}
            disabled={saving}
            className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                저장 중...
              </span>
            ) : (
              "대화 종료"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gradient-to-b from-indigo-100 to-purple-50">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
