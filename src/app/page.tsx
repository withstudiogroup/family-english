"use client";

import Link from "next/link";
import { MessageCircle, ArrowRight, Mic, Target, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        {/* Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl mb-6">
          <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 text-center">
          Family<span className="text-indigo-500">English</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-center mb-8 max-w-xs">
          AI 영어 선생님과 함께하는<br />
          우리 가족 맞춤 영어 학습
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-10">
          {[
            { icon: Mic, label: "실시간 대화" },
            { icon: Target, label: "맞춤 학습" },
            { icon: Users, label: "가족 학습" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 text-center shadow-sm"
            >
              <item.icon className="w-6 h-6 mx-auto mb-2 text-indigo-500" strokeWidth={1.5} />
              <p className="text-xs font-medium text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-xs space-y-3">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg transition-colors"
          >
            시작하기
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/signup"
            className="flex items-center justify-center w-full py-3 rounded-xl bg-white border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
          >
            회원가입
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 pt-4 text-center">
        <p className="text-sm text-gray-400 mb-4">가족 4명이 함께 사용하는 영어 학습</p>
        <div className="flex justify-center -space-x-2">
          {["👨", "👩", "👧", "👦"].map((emoji, i) => (
            <div
              key={i}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl border-2 border-white shadow-md bg-gradient-to-br from-indigo-100 to-purple-100"
            >
              {emoji}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
