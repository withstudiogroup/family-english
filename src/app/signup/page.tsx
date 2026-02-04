"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isParent, setIsParent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1) {
      if (username.length < 2) {
        setError("이름은 2글자 이상이어야 해요");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (password.length !== 4 || !/^\d{4}$/.test(password)) {
        setError("비밀번호는 숫자 4자리예요");
        return;
      }
      if (password !== confirmPassword) {
        setError("비밀번호가 일치하지 않아요");
        return;
      }
      setError("");
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signUp(username, password, isParent ? "parent" : "child");
      router.push("/level");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "회원가입에 실패했어요";
      if (errorMessage.includes("already registered")) {
        setError("이미 등록된 이름이에요. 다른 이름을 사용해주세요.");
      } else {
        setError(errorMessage);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 sm:-top-40 -right-32 sm:-right-40 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-teal-light to-teal opacity-12 animate-float" />
        <div className="absolute -bottom-24 sm:-bottom-32 -left-24 sm:-left-32 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-br from-sunny-light to-sunny opacity-10 animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-16 sm:py-20 pt-safe pb-safe">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white shadow-soft text-text-secondary transition-all duration-300 hover:scale-105 pt-safe pl-safe"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium text-sm sm:text-base">돌아가기</span>
        </Link>

        {/* Progress Indicator */}
        <div className="flex items-center gap-1 sm:gap-2 mb-6 sm:mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300"
                style={{
                  background: step >= s ? "linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%)" : "white",
                  color: step >= s ? "white" : "var(--text-muted)",
                  boxShadow: step >= s ? "0 4px 15px rgba(255, 138, 101, 0.3)" : "var(--shadow-soft)"
                }}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div className="w-6 sm:w-8 h-1 mx-0.5 sm:mx-1 rounded-full transition-all duration-300"
                  style={{ background: step > s ? "var(--coral)" : "var(--cream-dark)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Signup Card */}
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-[0_8px_30px_rgba(255,138,101,0.2)] animate-scale-in">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, var(--teal-light) 0%, var(--teal) 100%)",
                  }}
                >
                  <span className="text-4xl">✨</span>
                </div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)"
                  }}
                >
                  반가워요!
                </h1>
                <p style={{ color: "var(--text-secondary)" }}>
                  먼저 이름을 알려주세요
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    이름
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="영문 또는 한글"
                    className="w-full px-5 py-4 rounded-2xl text-base transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--cream)",
                      border: "2px solid transparent",
                      color: "var(--text-primary)",
                    }}
                    autoFocus
                  />
                </div>

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

                <button
                  onClick={handleNext}
                  className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)",
                    boxShadow: "0 4px 20px rgba(77, 182, 172, 0.4)"
                  }}
                >
                  다음으로
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, var(--sunny-light) 0%, var(--sunny) 100%)",
                  }}
                >
                  <span className="text-4xl">🔐</span>
                </div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)"
                  }}
                >
                  비밀번호를 만들어요
                </h1>
                <p style={{ color: "var(--text-secondary)" }}>
                  기억하기 쉬운 숫자 4자리
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setPassword(val);
                    }}
                    placeholder="●●●●"
                    inputMode="numeric"
                    maxLength={4}
                    className="w-full px-5 py-4 rounded-2xl text-base text-center tracking-[1em] transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--cream)",
                      border: "2px solid transparent",
                      color: "var(--text-primary)",
                    }}
                    autoFocus
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setConfirmPassword(val);
                    }}
                    placeholder="●●●●"
                    inputMode="numeric"
                    maxLength={4}
                    className="w-full px-5 py-4 rounded-2xl text-base text-center tracking-[1em] transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--cream)",
                      border: "2px solid transparent",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Password Match Indicator */}
                {confirmPassword.length > 0 && (
                  <div
                    className="flex items-center justify-center gap-2 py-2 animate-fade-in"
                    style={{
                      color: password === confirmPassword ? "var(--success)" : "var(--error)"
                    }}
                  >
                    <span>{password === confirmPassword ? "✓" : "✗"}</span>
                    <span className="text-sm font-medium">
                      {password === confirmPassword ? "일치해요!" : "일치하지 않아요"}
                    </span>
                  </div>
                )}

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

                <div className="flex gap-3">
                  <button
                    onClick={() => { setStep(1); setError(""); }}
                    className="flex-1 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "var(--cream)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    이전
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, var(--sunny) 0%, var(--sunny-dark) 100%)",
                      boxShadow: "0 4px 20px rgba(255, 213, 79, 0.4)",
                      color: "var(--text-primary)"
                    }}
                  >
                    다음으로
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Account Type */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, var(--coral-light) 0%, var(--coral) 100%)",
                  }}
                >
                  <span className="text-4xl">👨‍👩‍👧‍👦</span>
                </div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)"
                  }}
                >
                  거의 다 됐어요!
                </h1>
                <p style={{ color: "var(--text-secondary)" }}>
                  계정 유형을 선택해주세요
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Child Account */}
                <button
                  onClick={() => setIsParent(false)}
                  className="w-full p-5 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: !isParent ? "var(--coral-light)" : "var(--cream)",
                    border: !isParent ? "2px solid var(--coral)" : "2px solid transparent",
                    transform: !isParent ? "scale(1.02)" : "scale(1)"
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🧒</span>
                    <div>
                      <div
                        className="font-bold"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--text-primary)"
                        }}
                      >
                        학습자 (자녀)
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        영어를 배우고 싶어요
                      </div>
                    </div>
                    {!isParent && (
                      <span
                        className="ml-auto text-xl"
                        style={{ color: "var(--coral)" }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </button>

                {/* Parent Account */}
                <button
                  onClick={() => setIsParent(true)}
                  className="w-full p-5 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: isParent ? "var(--teal-light)" : "var(--cream)",
                    border: isParent ? "2px solid var(--teal)" : "2px solid transparent",
                    transform: isParent ? "scale(1.02)" : "scale(1)"
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">👨‍👩</span>
                    <div>
                      <div
                        className="font-bold"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--text-primary)"
                        }}
                      >
                        부모님
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        자녀 학습을 관리하고 싶어요
                      </div>
                    </div>
                    {isParent && (
                      <span
                        className="ml-auto text-xl"
                        style={{ color: "var(--teal)" }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep(2); setError(""); }}
                  className="flex-1 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "var(--cream)",
                    color: "var(--text-secondary)",
                  }}
                >
                  이전
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
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
                      가입 중...
                    </span>
                  ) : (
                    "시작하기 🎉"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Already have account */}
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-text-muted">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-bold underline text-coral">
            로그인
          </Link>
        </p>
      </main>
    </div>
  );
}
