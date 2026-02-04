"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

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
    <div className="page-container">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <main className="page-content">
        {/* Header */}
        <div className="page-header">
          <div className="logo">
            <User strokeWidth={1.5} />
          </div>
          <h1>다시 만나서 반가워요</h1>
          <p>이름과 비밀번호를 입력해주세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>이름</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="이름을 입력하세요"
                className="input pl-12"
              />
            </div>
          </div>

          <div className="form-group">
            <label>비밀번호 (숫자 4자리)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setPassword(val);
                }}
                placeholder="****"
                inputMode="numeric"
                maxLength={4}
                className="input pl-12 pr-12 tracking-[0.5em] text-center"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-center gap-4 mt-5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all ${
                    i < password.length ? "bg-primary scale-110" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message">
              <div className="dot" />
              <span>{error}</span>
            </div>
          )}

          <div className="btn-group">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary btn-lg flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  로그인 중...
                </>
              ) : (
                <>
                  로그인
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <Link href="/signup" className="btn-secondary btn-md flex items-center justify-center">
              새로 시작하기 (회원가입)
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="page-footer">
          <p>
            비밀번호를 잊으셨나요?<br />
            <span className="text-primary font-medium">부모님께 말씀해주세요</span>
          </p>
          <Link href="/" className="block mt-4">홈으로 돌아가기</Link>
        </div>
      </main>
    </div>
  );
}
