"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { User, Lock, UserCheck, Users, Loader2, Check, ArrowRight, ArrowLeft } from "lucide-react";

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
      setError(errorMessage.includes("already registered") ? "이미 등록된 이름이에요" : errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <main className="page-content">
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 section-gap-lg">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? "bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg" : "bg-white text-text-muted shadow"
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-10 h-1.5 mx-2 rounded-full ${step > s ? "bg-primary" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="w-full animate-fade-in">
            <div className="page-header">
              <div className="logo">
                <User strokeWidth={1.5} />
              </div>
              <h1>반가워요!</h1>
              <p>먼저 이름을 알려주세요</p>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="영문 또는 한글"
                  className="input"
                  autoFocus
                />
              </div>

              {error && (
                <div className="error-message">
                  <div className="dot" />
                  <span>{error}</span>
                </div>
              )}

              <button onClick={handleNext} className="btn-primary btn-lg w-full flex items-center justify-center gap-3">
                다음으로 <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="w-full animate-fade-in">
            <div className="page-header">
              <div className="logo" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%)" }}>
                <Lock strokeWidth={1.5} />
              </div>
              <h1>비밀번호를 만들어요</h1>
              <p>기억하기 쉬운 숫자 4자리</p>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="****"
                  inputMode="numeric"
                  maxLength={4}
                  className="input text-center tracking-[0.5em]"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="****"
                  inputMode="numeric"
                  maxLength={4}
                  className="input text-center tracking-[0.5em]"
                />
              </div>

              {confirmPassword.length > 0 && (
                <div className={`flex items-center justify-center gap-2 mb-6 ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                  {password === confirmPassword ? <Check className="w-5 h-5" /> : <div className="w-2 h-2 bg-red-500 rounded-full" />}
                  <span className="font-medium">{password === confirmPassword ? "일치해요!" : "일치하지 않아요"}</span>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <div className="dot" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => { setStep(1); setError(""); }} className="btn-secondary btn-md flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> 이전
                </button>
                <button onClick={handleNext} className="btn-primary btn-md flex-1">다음으로</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="w-full animate-fade-in">
            <div className="page-header">
              <div className="logo" style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)" }}>
                <Users strokeWidth={1.5} />
              </div>
              <h1>거의 다 됐어요!</h1>
              <p>계정 유형을 선택해주세요</p>
            </div>

            <div className="space-y-4 section-gap-md">
              <button
                onClick={() => setIsParent(false)}
                className={`w-full p-6 rounded-2xl text-left border-2 transition-all ${
                  !isParent ? "bg-primary/10 border-primary" : "bg-white border-transparent shadow"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${!isParent ? "bg-primary/20" : "bg-gray-100"}`}>
                    <UserCheck className={`w-7 h-7 ${!isParent ? "text-primary" : "text-text-muted"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-text-primary">학습자 (자녀)</div>
                    <div className="text-text-secondary">영어를 배우고 싶어요</div>
                  </div>
                  {!isParent && <Check className="w-6 h-6 text-primary" />}
                </div>
              </button>

              <button
                onClick={() => setIsParent(true)}
                className={`w-full p-6 rounded-2xl text-left border-2 transition-all ${
                  isParent ? "bg-secondary/10 border-secondary" : "bg-white border-transparent shadow"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isParent ? "bg-secondary/20" : "bg-gray-100"}`}>
                    <Users className={`w-7 h-7 ${isParent ? "text-secondary" : "text-text-muted"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-text-primary">부모님</div>
                    <div className="text-text-secondary">자녀 학습을 관리하고 싶어요</div>
                  </div>
                  {isParent && <Check className="w-6 h-6 text-secondary" />}
                </div>
              </button>
            </div>

            {error && (
              <div className="error-message">
                <div className="dot" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => { setStep(2); setError(""); }} className="btn-secondary btn-md flex-1 flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" /> 이전
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-primary btn-md flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> 가입 중...</> : "시작하기"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="page-footer mt-12">
          <p>
            이미 계정이 있나요?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">로그인</Link>
          </p>
          <Link href="/" className="block mt-4">홈으로 돌아가기</Link>
        </div>
      </main>
    </div>
  );
}
