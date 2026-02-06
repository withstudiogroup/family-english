"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useConversation, ConversationWithMessages } from "@/hooks/useConversation";
import { ArrowLeft, Loader2, Calendar, Clock, Languages } from "lucide-react";

const scenarioNames: Record<string, string> = {
  "fast-food": "패스트푸드 주문",
  "cafe-order": "카페 주문하기",
  "self-intro": "자기소개하기",
  "family-intro": "가족 소개하기",
  "daily-routine": "하루 일과 말하기",
  "hobby-talk": "취미 이야기하기",
  "ask-directions": "길 묻고 답하기",
  "shopping": "쇼핑하기",
  "free": "자유 대화",
};

export default function ConversationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;
  const { profile, loading: authLoading, isAuthenticated } = useAuth();
  const { getConversationWithMessages, loading } = useConversation();
  const [conversation, setConversation] = useState<ConversationWithMessages | null>(null);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (conversationId && profile) {
      loadConversation();
    }
  }, [conversationId, profile]);

  const loadConversation = async () => {
    const data = await getConversationWithMessages(conversationId);
    if (data) {
      setConversation(data);
      const existingTranslations: Record<string, string> = {};
      data.messages?.forEach((msg) => {
        if (msg.translation) {
          existingTranslations[msg.id] = msg.translation;
        }
      });
      setTranslations(existingTranslations);
    }
  };

  const handleTranslate = async (messageId: string, content: string) => {
    if (translations[messageId]) return;

    setTranslatingId(messageId);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, targetLang: "ko" }),
      });
      const data = await response.json();
      setTranslations((prev) => ({ ...prev, [messageId]: data.translation }));
    } catch (error) {
      console.error("Translation failed:", error);
    }
    setTranslatingId(null);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}초`;
    return `${Math.floor(seconds / 60)}분 ${seconds % 60}초`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (authLoading || loading || !conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-100 to-purple-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/history"
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div className="text-center">
              <h1 className="text-base font-bold text-gray-800">
                {scenarioNames[conversation.scenario_id] || conversation.scenario_id}
              </h1>
              <div className="flex items-center justify-center gap-3 mt-0.5 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateTime(conversation.started_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(conversation.duration_seconds)}
                </span>
              </div>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {conversation.messages?.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 mr-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                </div>
              )}

              <div
                className={`flex flex-col max-w-[80%] ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-indigo-500 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {translations[message.id] && (
                    <p
                      className={`text-[13px] mt-2 pt-2 border-t ${
                        message.role === "user"
                          ? "border-indigo-400 text-indigo-100"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {translations[message.id]}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[11px] text-gray-400">
                    {formatTime(message.created_at)}
                  </span>
                  {message.role === "assistant" && !translations[message.id] && (
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

          {(!conversation.messages || conversation.messages.length === 0) && (
            <div className="text-center py-10 text-gray-500">
              저장된 메시지가 없습니다
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-4 safe-area-bottom">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/chat?scenario=${conversation.scenario_id}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors"
          >
            이 시나리오 다시 대화하기
          </Link>
        </div>
      </div>
    </div>
  );
}
