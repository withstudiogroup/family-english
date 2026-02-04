"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Mic, Target, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Coral Blob - Top Right */}
        <div className="absolute -top-20 sm:-top-32 -right-20 sm:-right-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-br from-coral-light to-coral opacity-15 animate-float" />
        {/* Teal Blob - Bottom Left */}
        <div className="absolute -bottom-16 sm:-bottom-24 -left-16 sm:-left-24 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-gradient-to-br from-teal-light to-teal opacity-12 animate-float" style={{ animationDelay: "1s" }} />
        {/* Sunny Blob - Center Right */}
        <div className="absolute top-1/2 -right-12 sm:-right-16 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-gradient-to-br from-sunny-light to-sunny opacity-10 animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-16 sm:py-20">
        {/* Logo & Title Section */}
        <div className="text-center mb-12 sm:mb-16 animate-slide-down">
          {/* Logo Icon */}
          <div className="inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl shadow-lg bg-gradient-to-br from-coral to-coral-dark animate-float">
            <MessageCircle className="w-10 sm:w-12 h-10 sm:h-12 text-white" strokeWidth={2} />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 font-display text-text-primary tracking-tight">
            Family<span className="text-coral">English</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl max-w-md mx-auto text-text-secondary">
            AI 영어 선생님과 함께하는<br />
            우리 가족 맞춤 영어 학습
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-3xl w-full mb-12 sm:mb-16">
          {[
            { icon: Mic, title: "실시간 음성 대화", desc: "AI와 자연스럽게 대화해요" },
            { icon: Target, title: "맞춤 학습", desc: "수준에 딱 맞는 난이도" },
            { icon: Users, title: "가족 학습", desc: "함께 배우는 영어" },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-5 sm:p-8 rounded-xl sm:rounded-2xl text-center bg-white shadow-soft animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-coral-light/20 to-coral/20">
                <feature.icon className="w-6 sm:w-7 h-6 sm:h-7 text-coral" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-sm sm:text-base mb-1 font-display text-text-primary">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-white text-base sm:text-lg bg-gradient-to-r from-coral to-coral-dark shadow-[0_4px_20px_rgba(255,138,101,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <span>시작하기</span>
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </Link>

          <Link
            href="/signup"
            className="flex-1 flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg bg-white text-coral shadow-soft border-2 border-coral-light transition-all duration-300 hover:scale-105 active:scale-95"
          >
            회원가입
          </Link>
        </div>

        {/* Demo Section */}
        <div className="mt-16 sm:mt-24 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <p className="text-xs sm:text-sm mb-4 sm:mb-6 text-text-muted">
            가족 4명이 함께 사용하는 영어 학습 플랫폼
          </p>

          {/* Family Avatars - Simplified */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4].map((num, index) => (
              <div
                key={num}
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold border-2 sm:border-3 border-white text-white"
                style={{
                  background: index % 2 === 0 ? "var(--coral)" : "var(--teal)",
                }}
              >
                {num}
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
