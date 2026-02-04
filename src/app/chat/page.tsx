"use client";

import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRealtime } from "@/hooks/useRealtime";
import { useAuth } from "@/hooks/useAuth";
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
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <Link href="/scenarios" className="chat-header-btn">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </Link>
        <div className="text-center">
          <h1 className="text-base font-bold text-text-primary">{scenarioNames[scenario] || "영어 대화"}</h1>
          <div className="chat-connection-status">
            <span className={`chat-connection-dot ${isConnected ? "connected" : "connecting"}`} />
            <span className="text-xs text-text-muted">{isConnected ? "연결됨" : "연결 중..."}</span>
          </div>
        </div>
        <div className="w-11" />
      </header>

      {/* Chat */}
      <div className="chat-messages">
        {!isConnected && !connectionError && (
          <div className="chat-loading">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p>AI 선생님 연결 중...</p>
          </div>
        )}

        {connectionError && (
          <div className="chat-error">
            <p>{connectionError}</p>
            <button onClick={() => connect()} className="btn-primary">다시 시도</button>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
            {message.role === "assistant" && (
              <div className="chat-ai-avatar">
                <span>AI</span>
              </div>
            )}
            <div className="chat-bubble">
              <div className={message.role === "user" ? "bubble-user" : "bubble-ai"}>
                <p className="chat-bubble-content">{message.content}</p>
                {message.translation && (
                  <p className="text-[13px] text-text-secondary px-5 pb-4 border-t border-gray-100 mt-2 pt-3">{message.translation}</p>
                )}
              </div>
              {message.role === "assistant" && !message.translation && (
                <button
                  onClick={() => handleTranslate(message.id, message.content)}
                  disabled={translatingId === message.id}
                  className="chat-translate-btn"
                >
                  <Languages className="w-3.5 h-3.5" />
                  {translatingId === message.id ? "번역 중..." : "번역하기"}
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom */}
      <div className="chat-bottom pb-safe">
        <p className="chat-status">
          {isAiSpeaking ? "AI가 말하는 중..." : isRecording ? "듣고 있어요..." : isConnected ? "마이크 버튼을 눌러 말하세요" : "연결 중..."}
        </p>

        <div className="flex justify-center">
          <button
            onClick={toggleRecording}
            disabled={!isConnected || isAiSpeaking}
            className={`chat-mic-btn ${isRecording ? "recording" : "idle"}`}
          >
            {isRecording ? <MicOff /> : <Mic />}
          </button>
        </div>

        <Link href="/dashboard" className="chat-exit-link">대화 종료</Link>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
