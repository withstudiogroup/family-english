"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "var(--cream)" }}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Coral Blob - Top Right */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full animate-float"
          style={{
            background: "linear-gradient(135deg, var(--coral-light) 0%, var(--coral) 100%)",
            opacity: 0.15,
            animationDelay: "0s"
          }}
        />
        {/* Teal Blob - Bottom Left */}
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full animate-float"
          style={{
            background: "linear-gradient(135deg, var(--teal-light) 0%, var(--teal) 100%)",
            opacity: 0.12,
            animationDelay: "1s"
          }}
        />
        {/* Sunny Blob - Center Right */}
        <div
          className="absolute top-1/2 -right-16 w-64 h-64 rounded-full animate-float"
          style={{
            background: "linear-gradient(135deg, var(--sunny-light) 0%, var(--sunny) 100%)",
            opacity: 0.1,
            animationDelay: "2s"
          }}
        />
        {/* Small Coral Circle */}
        <div
          className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full animate-bounce-soft"
          style={{
            background: "var(--coral)",
            opacity: 0.08,
          }}
        />
        {/* Small Teal Circle */}
        <div
          className="absolute bottom-1/4 right-1/3 w-12 h-12 rounded-full animate-bounce-soft"
          style={{
            background: "var(--teal)",
            opacity: 0.08,
            animationDelay: "0.5s"
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Logo & Title Section */}
        <div className="text-center mb-16 animate-slide-down">
          {/* Logo Icon */}
          <div
            className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-3xl shadow-lg animate-float"
            style={{
              background: "linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%)",
              boxShadow: "0 8px 32px rgba(255, 138, 101, 0.35)"
            }}
          >
            <span className="text-5xl">💬</span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em"
            }}
          >
            Family<span style={{ color: "var(--coral)" }}>English</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl max-w-md mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            AI 영어 선생님과 함께하는<br />
            우리 가족 맞춤 영어 학습
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full mb-16">
          {[
            { icon: "🎤", title: "실시간 음성 대화", desc: "AI와 자연스럽게 대화해요" },
            { icon: "🎯", title: "맞춤 학습", desc: "수준에 딱 맞는 난이도" },
            { icon: "🎭", title: "시나리오 학습", desc: "실생활 상황 역할극" },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl text-center animate-slide-up"
              style={{
                background: "white",
                boxShadow: "var(--shadow-soft)",
                animationDelay: `${index * 0.1}s`
              }}
            >
              <span className="text-4xl mb-3 block">{feature.icon}</span>
              <h3
                className="font-bold text-base mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-primary)"
                }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%)",
              boxShadow: "0 4px 20px rgba(255, 138, 101, 0.4)"
            }}
          >
            <span>시작하기</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <Link
            href="/signup"
            className="flex-1 flex items-center justify-center px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "white",
              color: "var(--coral)",
              boxShadow: "var(--shadow-soft)",
              border: "2px solid var(--coral-light)"
            }}
          >
            회원가입
          </Link>
        </div>

        {/* Demo Section */}
        <div className="mt-24 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            가족 4명이 함께 사용하는 영어 학습 플랫폼
          </p>

          {/* Family Avatars */}
          <div className="flex justify-center -space-x-3">
            {["👨", "👩", "👧", "👦"].map((emoji, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-3 border-white animate-bounce-soft"
                style={{
                  background: index % 2 === 0 ? "var(--coral-light)" : "var(--teal-light)",
                  animationDelay: `${index * 0.15}s`
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
          style={{ height: "100%" }}
        >
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            d="M0,80 C240,20 480,100 720,60 C960,20 1200,100 1440,80 L1440,120 L0,120 Z"
            fill="white"
            fillOpacity="0.8"
          />
        </svg>
      </div>
    </div>
  );
}
