"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!username.trim()) {
      setError("이름을 입력해주세요");
      setIsLoading(false);
      return;
    }

    if (password.length !== 4 || !/^\d{4}$/.test(password)) {
      setError("비밀번호는 숫자 4자리입니다");
      setIsLoading(false);
      return;
    }

    try {
      await signIn(username, password);
      router.push("/dashboard");
    } catch (err) {
      setError("이름 또는 비밀번호가 일치하지 않아요");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "var(--cream)" }}>
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full animate-float"
          style={{
            background: "linear-gradient(135deg, var(--coral-light) 0%, var(--coral) 100%)",
            opacity: 0.12,
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full animate-float"
          style={{
            background: "linear-gradient(135deg, var(--teal-light) 0%, var(--teal) 100%)",
            opacity: 0.1,
            animationDelay: "1.5s"
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
          style={{
            background: "white",
            boxShadow: "var(--shadow-soft)",
            color: "var(--text-secondary)"
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">돌아가기</span>
        </Link>

        {/* Login Card */}
        <div
          className="w-full max-w-md p-8 rounded-3xl animate-scale-in"
          style={{
            background: "white",
            boxShadow: "var(--shadow-medium)"
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, var(--coral-light) 0%, var(--coral) 100%)",
              }}
            >
              <span className="text-4xl">👋</span>
            </div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)"
              }}
            >
              다시 만나서 반가워요!
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              이름과 비밀번호를 입력해주세요
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                이름
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-5 py-4 rounded-2xl text-base transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--cream)",
                    border: "2px solid transparent",
                    color: "var(--text-primary)",
                    // @ts-ignore
                    "--tw-ring-color": "var(--coral-light)"
                  }}
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                >
                  👤
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                비밀번호 (숫자 4자리)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setPassword(val);
                  }}
                  placeholder="●●●●"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  className="w-full px-5 py-4 rounded-2xl text-base tracking-widest transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--cream)",
                    border: "2px solid transparent",
                    color: "var(--text-primary)",
                    // @ts-ignore
                    "--tw-ring-color": "var(--coral-light)"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-60 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password Dots Indicator */}
              <div className="flex justify-center gap-3 mt-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full transition-all duration-300"
                    style={{
                      background: index < password.length ? "var(--coral)" : "var(--cream-dark)",
                      transform: index < password.length ? "scale(1.2)" : "scale(1)"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl animate-slide-down"
                style={{
                  background: "rgba(229, 115, 115, 0.1)",
                  color: "var(--error)"
                }}
              >
                <span>⚠️</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%)",
                boxShadow: "0 4px 20px rgba(255, 138, 101, 0.4)"
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: "var(--cream-dark)" }} />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>또는</span>
            <div className="flex-1 h-px" style={{ background: "var(--cream-dark)" }} />
          </div>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="block w-full py-4 rounded-2xl font-bold text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--cream)",
              color: "var(--coral)",
            }}
          >
            새로 시작하기 (회원가입)
          </Link>
        </div>

        {/* Help Text */}
        <p
          className="mt-8 text-sm text-center"
          style={{ color: "var(--text-muted)" }}
        >
          비밀번호를 잊으셨나요?<br />
          부모님께 말씀해주세요 😊
        </p>
      </main>
    </div>
  );
}
