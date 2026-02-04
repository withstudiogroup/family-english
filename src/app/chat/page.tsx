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
};

const scenarioNames: Record<string, string> = {
  "fast-food": "패스트푸드 주문",
  "cafe-order": "카페 주문",
  "self-intro": "자기소개",
  "ask-directions": "길 묻기",
  "shopping": "쇼핑하기",
  "free": "자유 대화",
};

function ChatContent() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get("scenario") || "free";
  const { profile } = useAuth();
  const level = profile?.level || "intermediate";

  const [messages, setMessages] = useState<Message[]>([]);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
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
    connect();
    return () => {
      disconnect();
      hasConnected.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#B2C7D9]">
      {/* Header - 카카오톡 스타일 */}
      <header className="flex items-center h-14 px-4 bg-[#B2C7D9] border-b border-[#9DB8CC]">
        <Link href="/scenarios" className="p-2 -ml-2">
          <svg className="w-6 h-6 text-[#3A4A5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="flex-1 text-center">
          <h1 className="text-[17px] font-semibold text-[#3A4A5C]">
            {scenarioNames[scenario] || "영어 대화"}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-orange-400"}`} />
          <span className="text-xs text-[#5A6A7C]">
            {isConnected ? "연결됨" : "연결중"}
          </span>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 space-y-3">
          {/* 연결 중 표시 */}
          {!isConnected && !connectionError && (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[#5B9BD5] border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm text-[#5A6A7C]">AI 선생님 연결 중...</p>
              </div>
            </div>
          )}

          {/* 연결 에러 */}
          {connectionError && (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-sm text-red-600 text-center px-4">{connectionError}</p>
                <button
                  onClick={() => connect()}
                  className="px-4 py-2 bg-[#5B9BD5] text-white text-sm rounded-full"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* 메시지 목록 */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* AI 아바타 */}
              {message.role === "assistant" && (
                <div className="flex-shrink-0 mr-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B9BD5] to-[#4A8BC4] flex items-center justify-center shadow-sm">
                    <span className="text-lg">🎓</span>
                  </div>
                </div>
              )}

              <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[75%]`}>
                {/* AI 이름 */}
                {message.role === "assistant" && (
                  <span className="text-xs text-[#5A6A7C] mb-1 ml-1">AI Teacher</span>
                )}

                {/* 메시지 버블 */}
                <div className="flex items-end gap-1">
                  {message.role === "user" && (
                    <span className="text-[11px] text-[#7A8A9C] mb-1">{formatTime(message.timestamp)}</span>
                  )}

                  <div
                    className={`px-3 py-2 rounded-2xl ${
                      message.role === "user"
                        ? "bg-[#FEE500] text-[#3A1D1D] rounded-tr-sm"
                        : "bg-white text-[#333] rounded-tl-sm shadow-sm"
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>

                    {/* 번역 */}
                    {message.translation && (
                      <p className="text-[13px] text-[#666] mt-2 pt-2 border-t border-gray-200">
                        {message.translation}
                      </p>
                    )}
                  </div>

                  {message.role === "assistant" && (
                    <span className="text-[11px] text-[#7A8A9C] mb-1">{formatTime(message.timestamp)}</span>
                  )}
                </div>

                {/* 번역 버튼 (AI 메시지만) */}
                {message.role === "assistant" && !message.translation && (
                  <button
                    onClick={() => handleTranslate(message.id, message.content)}
                    disabled={translatingId === message.id}
                    className="mt-1 ml-1 text-xs text-[#5B9BD5] hover:underline disabled:opacity-50"
                  >
                    {translatingId === message.id ? "번역 중..." : "번역하기"}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Bar - 음성 입력 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 pb-safe">
        <div className="flex items-center justify-center gap-4">
          {/* 상태 텍스트 */}
          <div className="flex-1 text-center">
            <p className="text-sm text-[#666]">
              {isAiSpeaking ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="flex gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <span
                        key={i}
                        className="w-1 bg-[#5B9BD5] rounded-full animate-pulse"
                        style={{
                          height: `${8 + Math.random() * 8}px`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </span>
                  AI가 말하는 중...
                </span>
              ) : isRecording ? (
                <span className="text-red-500 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  듣고 있어요...
                </span>
              ) : isConnected ? (
                "마이크 버튼을 눌러 말하세요"
              ) : (
                "연결 중..."
              )}
            </p>
          </div>
        </div>

        {/* 마이크 버튼 */}
        <div className="flex justify-center mt-3">
          <button
            onClick={toggleRecording}
            disabled={!isConnected || isAiSpeaking}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              isRecording
                ? "bg-red-500 scale-110"
                : "bg-[#5B9BD5] hover:bg-[#4A8BC4] active:scale-95"
            } disabled:opacity-40 disabled:cursor-not-allowed shadow-lg`}
          >
            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded-sm" />
            ) : (
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>
        </div>

        {/* 종료 버튼 */}
        <div className="flex justify-center mt-3">
          <Link
            href="/dashboard"
            className="text-sm text-[#888] hover:text-[#666]"
          >
            대화 종료
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-[#B2C7D9]">
          <div className="w-8 h-8 border-2 border-[#5B9BD5] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
