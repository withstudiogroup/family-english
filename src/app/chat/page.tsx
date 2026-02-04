"use client";

import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRealtime } from "@/hooks/useRealtime";
import { useAuth } from "@/hooks/useAuth";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  translation?: string;
  feedback?: {
    type: "correction" | "better" | "native";
    original?: string;
    suggestion: string;
    explanation: string;
  };
};

type Suggestion = {
  english: string;
  korean: string;
};

const scenarioNames: Record<string, string> = {
  "fast-food": "🍔 패스트푸드 주문",
  "cafe-order": "☕ 카페 주문",
  "self-intro": "👋 자기소개",
  "ask-directions": "🗺️ 길 묻기",
  "shopping": "🛍️ 쇼핑하기",
  "free": "💬 자유 대화",
};

function ChatContent() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get("scenario") || "free";
  const mode = searchParams.get("mode");

  const { profile } = useAuth();
  const level = profile?.level || "intermediate";

  const [messages, setMessages] = useState<Message[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    connect,
    disconnect,
    toggleRecording,
    sendTextMessage,
  } = useRealtime({
    scenario,
    level: level as "beginner" | "intermediate" | "advanced",
    onMessage: handleMessage,
    onError: handleError,
  });

  // Connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch suggestions when showing
  useEffect(() => {
    if (showSuggestions && messages.length > 0) {
      fetchSuggestions();
    }
  }, [showSuggestions]);

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const context = messages.slice(-4).map(m => `${m.role}: ${m.content}`).join("\n");
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, level, scenario }),
      });
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([
        { english: "I understand", korean: "이해했어요" },
        { english: "Can you repeat that?", korean: "다시 말해줄래요?" },
        { english: "Thank you", korean: "감사합니다" },
      ]);
    }
    setLoadingSuggestions(false);
  };

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

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    sendTextMessage(suggestion.english);
  };

  const handleMicClick = () => {
    toggleRecording();
  };

  return (
    <div className="relative flex flex-col h-screen bg-cream">
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3 z-20"
        style={{
          background: "white",
          boxShadow: "var(--shadow-soft)"
        }}
      >
        <Link
          href="/scenarios"
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-105"
          style={{
            background: "var(--cream)",
            color: "var(--text-secondary)"
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="text-center">
          <h1
            className="font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)"
            }}
          >
            {scenarioNames[scenario] || "💬 영어 대화"}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}
            />
            <span style={{ color: "var(--text-muted)" }}>
              {isConnected ? "연결됨" : "연결 중..."}
            </span>
          </div>
        </div>

        {/* Level Badge */}
        <div
          className="px-2 py-1 rounded-lg text-xs font-medium"
          style={{
            background: level === "beginner" ? "var(--success)"
              : level === "intermediate" ? "var(--sunny)"
              : "var(--coral)",
            color: "white"
          }}
        >
          {level === "beginner" ? "초급" : level === "intermediate" ? "중급" : "고급"}
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {!isConnected && (
          <div className="flex flex-col items-center justify-center h-full">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-pulse-soft"
              style={{
                background: "linear-gradient(135deg, var(--coral-light) 0%, var(--coral) 100%)"
              }}
            >
              <span className="text-4xl">🎤</span>
            </div>
            <p
              className="font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              AI 선생님을 연결하는 중...
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
          >
            <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] ${message.role === "user" ? "order-2" : "order-1"}`}>
              {/* Avatar */}
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--teal-light) 0%, var(--teal) 100%)"
                    }}
                  >
                    <span className="text-sm">🤖</span>
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    AI Teacher
                  </span>
                  {isAiSpeaking && message.id === messages[messages.length - 1]?.id && (
                    <div className="flex gap-1 items-center h-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="voice-bar"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`px-4 py-3 ${message.role === "user" ? "bubble-user" : "bubble-ai"}`}
              >
                <p className="text-base leading-relaxed">{message.content}</p>

                {/* Translation */}
                {message.translation && (
                  <p
                    className="text-sm mt-2 pt-2 border-t"
                    style={{
                      color: "var(--text-secondary)",
                      borderColor: "var(--cream-dark)"
                    }}
                  >
                    🇰🇷 {message.translation}
                  </p>
                )}
              </div>

              {/* Message Actions (for AI messages) */}
              {message.role === "assistant" && (
                <div className="flex gap-2 mt-2 ml-2">
                  <button
                    onClick={() => handleTranslate(message.id, message.content)}
                    disabled={!!message.translation || translatingId === message.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 disabled:opacity-50"
                    style={{
                      background: "white",
                      boxShadow: "var(--shadow-soft)",
                      color: "var(--text-secondary)"
                    }}
                  >
                    {translatingId === message.id ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        번역 중...
                      </>
                    ) : message.translation ? (
                      <>
                        <span>✓</span>
                        번역됨
                      </>
                    ) : (
                      <>
                        <span>🌐</span>
                        번역
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Feedback */}
              {message.feedback && (
                <div
                  className="mt-3 p-3 rounded-xl animate-fade-in"
                  style={{
                    background: "var(--sunny-light)",
                    border: "1px solid var(--sunny)"
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span>💡</span>
                    <div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        더 나은 표현
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span className="line-through opacity-60">{message.feedback.original}</span>
                        {" → "}
                        <span className="font-medium" style={{ color: "var(--teal-dark)" }}>
                          {message.feedback.suggestion}
                        </span>
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {message.feedback.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Panel */}
      {showSuggestions && (
        <div
          className="px-4 py-3 animate-slide-up"
          style={{
            background: "white",
            borderTop: "1px solid var(--cream-dark)"
          }}
        >
          <p
            className="text-xs font-medium mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            💡 이렇게 말해보세요
          </p>
          {loadingSuggestions ? (
            <div className="text-center py-4">
              <span className="animate-spin inline-block">⏳</span>
              <span className="ml-2 text-sm" style={{ color: "var(--text-muted)" }}>
                추천 문장 생성 중...
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: "var(--cream)",
                    color: "var(--text-primary)"
                  }}
                >
                  <p className="font-medium">{suggestion.english}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {suggestion.korean}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Controls */}
      <div className="px-4 py-4 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex items-center justify-center gap-6 sm:gap-4">
          {/* Suggestion Button */}
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all hover:scale-110 active:scale-95"
            style={{
              background: showSuggestions ? "var(--sunny)" : "var(--cream)",
              color: showSuggestions ? "var(--text-primary)" : "var(--text-secondary)"
            }}
          >
            <span className="text-xl">💡</span>
          </button>

          {/* Mic Button */}
          <button
            onClick={handleMicClick}
            disabled={!isConnected || isAiSpeaking}
            className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
              isRecording ? "scale-110" : "hover:scale-105 active:scale-95"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              background: isRecording
                ? "linear-gradient(135deg, var(--error) 0%, #C62828 100%)"
                : "linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%)",
              boxShadow: isRecording
                ? "0 0 0 8px rgba(229, 115, 115, 0.3), 0 8px 30px rgba(229, 115, 115, 0.4)"
                : "0 8px 30px rgba(255, 138, 101, 0.4)"
            }}
          >
            {isRecording ? (
              <div className="flex gap-1 items-center h-8">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-white rounded-full"
                    style={{
                      height: `${Math.random() * 24 + 8}px`,
                      animation: "voice-wave 0.5s ease-in-out infinite",
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}

            {/* Recording Pulse */}
            {isRecording && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: "var(--error)",
                  opacity: 0.3
                }}
              />
            )}
          </button>

          {/* End Button */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all hover:scale-110 active:scale-95"
            style={{
              background: "var(--cream)",
              color: "var(--text-secondary)"
            }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>

        {/* Recording Status */}
        <p
          className="text-center text-sm mt-3 font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {isRecording
            ? "🔴 듣고 있어요... (다시 누르면 전송)"
            : isAiSpeaking
            ? "🔊 AI가 말하는 중..."
            : "🎤 버튼을 눌러 말하세요"
          }
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen" style={{ background: "var(--cream)" }}>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-pulse-soft mx-auto"
              style={{
                background: "linear-gradient(135deg, var(--coral-light) 0%, var(--coral) 100%)"
              }}
            >
              <span className="text-3xl">🎤</span>
            </div>
            <p style={{ color: "var(--text-secondary)" }}>로딩 중...</p>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
