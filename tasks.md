# FamilyEnglish 구현 Tasks

## 현재 진행 상황
**Phase**: Phase 1 - UI 프론트엔드 완료 ✅

---

## 📋 Task 목록

### Phase 0: 프로젝트 설정 ✅

#### Task 0.1: Next.js 프로젝트 초기화 ✅
- [x] Next.js 16 (App Router) 프로젝트 생성
- [x] TypeScript 설정
- [x] Tailwind CSS 설정
- [x] 폴더 구조 생성

#### Task 0.2: 테마 및 스타일 설정 ✅
- [x] Warm Educational Playground 테마 구현
- [x] CSS Variables (Coral, Teal, Sunny, Cream)
- [x] Nunito + Pretendard 폰트 설정
- [x] 애니메이션 (float, slide-up, bounce-soft, voice-wave)

---

### Phase 1: UI 페이지 구현 ✅

#### Task 1.1: 랜딩 페이지 ✅
- [x] 로고 및 타이틀
- [x] 특징 카드 (실시간 음성, 맞춤 학습, 시나리오)
- [x] CTA 버튼 (시작하기, 회원가입)
- [x] 장식적 배경 요소

#### Task 1.2: 로그인 페이지 ✅
- [x] 이름 + 4자리 비밀번호 입력 폼
- [x] 비밀번호 표시/숨김 토글
- [x] 비밀번호 진행 상태 표시 (4개 점)
- [x] 에러 메시지 표시
- [x] 회원가입 링크

#### Task 1.3: 회원가입 페이지 ✅
- [x] 3단계 진행 표시 (이름 → 비밀번호 → 계정 유형)
- [x] 이름 입력 (Step 1)
- [x] 비밀번호 설정 및 확인 (Step 2)
- [x] 부모/자녀 계정 선택 (Step 3)

#### Task 1.4: 수준 선택 페이지 ✅
- [x] 초급/중급/고급 카드 (이모지, 대상 연령, 설명)
- [x] 자동 레벨 테스트 옵션
- [x] 선택 상태 시각적 피드백

#### Task 1.5: 시나리오 선택 페이지 ✅
- [x] 카테고리 탭 (전체, 일상, 학교, 음식, 외출, 소통)
- [x] 18개 시나리오 카드
- [x] 난이도 배지 (초급/중급/고급)
- [x] 선택 시 하단 프리뷰 표시

#### Task 1.6: 대화 페이지 UI ✅
- [x] 헤더 (시나리오 이름, 연결 상태, 난이도 조절 버튼)
- [x] 메시지 말풍선 (사용자/AI)
- [x] AI 아바타 및 음성 시각화
- [x] 번역 버튼 및 결과 표시
- [x] 피드백 카드 (더 나은 표현 제안)
- [x] 대답 추천 패널
- [x] 마이크 버튼 (녹음 상태 애니메이션)

#### Task 1.7: 대시보드 페이지 ✅
- [x] 헤더 (사용자 이름, 레벨 배지)
- [x] 통계 카드 (총 학습 시간, 연속 학습, 이번 주)
- [x] 학습 시작 CTA 카드
- [x] 주간 학습 차트
- [x] 최근 대화 목록
- [x] 하단 네비게이션 바

---

### Phase 2: 백엔드 연동 🔄 진행중

#### Task 2.1: Supabase 설정 ✅
- [x] Supabase 프로젝트 생성
- [x] 데이터베이스 스키마 작성 (supabase/schema.sql)
- [x] Row Level Security (RLS) 정책 설정
- [ ] **SQL Editor에서 스키마 실행 (사용자 작업 필요)**

#### Task 2.2: 인증 연동 ✅
- [x] Supabase 클라이언트 설정 (src/lib/supabase/)
- [x] useAuth 훅 구현 (회원가입/로그인/로그아웃)
- [x] 미들웨어 설정 (세션 관리)
- [x] 로그인/회원가입 페이지 연동

#### Task 2.3: OpenAI Realtime API 연동 ✅
- [x] 세션 토큰 API Route (/api/realtime/session)
- [x] useRealtime 훅 구현 (WebRTC 연결)
- [x] 음성 입력/출력 처리
- [x] 채팅 페이지 연동

#### Task 2.4: 보조 API 구현 ✅
- [x] 번역 API (/api/translate)
- [x] 대답 추천 API (/api/suggest)
- [x] 피드백은 Realtime API에서 처리

#### Task 2.5: 데이터 저장
- [ ] 대화 저장 기능
- [ ] localStorage 백업
- [ ] 학습 통계 조회

---

## 🎯 현재 작업 완료
프론트엔드 UI 모두 완성! 백엔드 연동이 다음 단계입니다.

---

## ✅ 완료된 작업
- [x] Next.js 프로젝트 초기화
- [x] Warm Educational Playground 테마 구현
- [x] 랜딩 페이지
- [x] 로그인 페이지
- [x] 회원가입 페이지 (3단계)
- [x] 수준 선택 페이지
- [x] 시나리오 선택 페이지 (18개 시나리오)
- [x] 대화 페이지 UI (Mock 데이터)
- [x] 대시보드 페이지

---

## 📝 구현된 디자인 요소
- **색상**: Coral (#FF8A65), Teal (#4DB6AC), Sunny (#FFD54F), Cream (#FFF8F0)
- **폰트**: Nunito (Display), Pretendard (Body)
- **애니메이션**: float, slide-up, slide-down, fade-in, scale-in, bounce-soft, voice-wave
- **컴포넌트**: 말풍선, 레벨 배지, 시나리오 카드, 음성 시각화, 주간 차트

---

## 🚀 다음 단계
1. Supabase 프로젝트 설정
2. 데이터베이스 스키마 생성
3. 인증 연동 (회원가입/로그인)
4. OpenAI Realtime API 연동
5. 실제 음성 대화 기능 구현
