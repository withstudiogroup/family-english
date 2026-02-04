"use client";

import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="page-container">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <main className="page-content">
        {/* Header */}
        <div className="page-header">
          <div className="logo">
            <MessageCircle strokeWidth={1.5} />
          </div>
          <h1>
            Family<span className="text-primary">English</span>
          </h1>
          <p>
            AI 영어 선생님과 함께하는<br />
            우리 가족 맞춤 영어 학습
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="btn-group">
          <Link href="/login" className="btn-primary btn-lg flex items-center justify-center gap-3">
            시작하기
            <ArrowRight className="w-6 h-6" />
          </Link>

          <Link href="/signup" className="btn-secondary btn-md flex items-center justify-center">
            회원가입
          </Link>
        </div>

        {/* Footer */}
        <div className="page-footer">
          <p>실시간 음성 대화 · 맞춤 학습 · 가족 학습</p>

          <div className="flex justify-center -space-x-2 mt-6">
            {["👨", "👩", "👧", "👦"].map((emoji, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-3 border-white shadow-lg bg-gradient-to-br from-primary/20 to-secondary/20"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
