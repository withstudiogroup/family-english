"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

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
    <div className="relative min-h-screen overflow-hidden bg-cream">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 sm:-top-40 -left-32 sm:-left-40 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-coral-light to-coral opacity-12 animate-float" />
        <div className="absolute -bottom-24 sm:-bottom-32 -right-24 sm:-right-32 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-br from-teal-light to-teal opacity-10 animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-16 sm:py-20 pt-safe pb-safe">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white shadow-soft text-text-secondary transition-all duration-300 hover:scale-105 pt-safe pl-safe"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm sm:text-base">돌아가기</span>
        </Link>

        {/* Login Card */}
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-[0_8px_30px_rgba(255,138,101,0.2)] animate-scale-in">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-coral-light to-coral">
              <User className="w-8 sm:w-10 h-8 sm:h-10 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2 font-display text-text-primary">
              다시 만나서 반가워요
            </h1>
            <p className="text-sm sm:text-base text-text-secondary">
              이름과 비밀번호를 입력해주세요
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">
                이름
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-11 sm:pl-12 rounded-xl sm:rounded-2xl text-sm sm:text-base bg-cream border-2 border-transparent text-text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-coral-light"
                />
                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">
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
                  placeholder="····"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-11 sm:pl-12 rounded-xl sm:rounded-2xl text-sm sm:text-base tracking-widest bg-cream border-2 border-transparent text-text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-coral-light"
                />
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Dots Indicator */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="w-3 sm:w-4 h-3 sm:h-4 rounded-full transition-all duration-300"
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
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error animate-slide-down">
                <div className="w-1 h-4 bg-error rounded-full" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-white text-base sm:text-lg bg-gradient-to-r from-coral to-coral-dark shadow-[0_4px_20px_rgba(255,138,101,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="block w-full mt-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-center bg-cream text-coral transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            새로 시작하기 (회원가입)
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-center text-text-muted">
          비밀번호를 잊으셨나요?<br />
          부모님께 말씀해주세요
        </p>
      </main>
    </div>
  );
}
