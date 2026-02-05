# FamilyEnglish - AI 기반 가족 영어 회화 학습 플랫폼
## Product Requirements Document (PRD) - Final Version

**문서 버전**: 1.0  
**작성일**: 2025-02-04  
**대상**: 개발팀 (Claude Code)  
**프로젝트 목표**: OpenAI Realtime API를 활용한 실시간 음성 기반 영어 학습 웹 애플리케이션

---

## 📋 목차
1. [프로젝트 개요](#1-프로젝트-개요)
2. [핵심 결정사항](#2-핵심-결정사항)
3. [기술 스택](#3-기술-스택)
4. [사용자 스토리](#4-사용자-스토리)
5. [기능 요구사항](#5-기능-요구사항)
6. [데이터베이스 설계](#6-데이터베이스-설계)
7. [시스템 아키텍처](#7-시스템-아키텍처)
8. [보안 및 인증](#8-보안-및-인증)
9. [비용 관리](#9-비용-관리)
10. [위험 요소 및 대응](#10-위험-요소-및-대응)
11. [개발 우선순위](#11-개발-우선순위)
12. [성공 지표](#12-성공-지표)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목적
가족 구성원 4명이 각자의 수준에 맞춰 AI 영어 선생님과 실시간 음성 대화를 통해 자연스럽게 영어를 학습할 수 있는 웹 애플리케이션 개발

### 1.2 핵심 가치 제안
- **실시간 음성 대화**: 사람과 대화하듯 자연스러운 영어 학습
- **개인 맞춤형**: 각자의 수준에 맞는 대화 난이도 자동 조절
- **시나리오 기반 학습**: 실생활 상황 역할극으로 실전 회화 연습
- **즉각적인 피드백**: 중요한 실수는 즉시 교정, 칭찬 중심 피드백
- **학습 기록 관리**: 대화 내용 저장 및 진도 추적

### 1.3 타겟 사용자
- **Primary**: 가족 구성원 4명 (각각 다른 영어 수준)
- **연령대**: 초등학교 저학년 ~ 성인
- **영어 수준**: 초급(초등 저학년) ~ 고급(중학생)

---

## 2. 핵심 결정사항

### 2.1 아키텍처 결정
| 결정 사항 | 선택 | 이유 |
|-----------|------|------|
| **Realtime API 연결** | Next.js 서버를 WebSocket 프록시로 사용 | 클라이언트에 API 키 노출 방지, 보안 강화 |
| **인증 방식** | Supabase Auth | RLS(Row Level Security) 활용, 보안 관리 용이 |
| **로그인 방식** | 이름(Username) + 4자리 비밀번호 | 가족용 간편 로그인, 이메일 불필요 |
| **모바일 대응** | 반응형 웹 + PWA | 앱 스토어 없이 앱처럼 사용 가능 |
| **배포** | Vercel (GitHub 연동) | 자동 배포, 무료 Hobby 플랜 |

### 2.2 주요 기능 결정
| 기능 | 결정 | 상세 |
|------|------|------|
| **수준 설정** | 자동 레벨링 + 수동 선택 | 첫 대화로 수준 자동 판정, 대화 중 조정 가능 |
| **피드백 타이밍** | 중요한 실수만 즉시 교정 | 대화 흐름 유지, 칭찬 먼저 제공 |
| **시나리오 모드** | Phase 1 필수 포함 (핵심 기능) | 패스트푸드 주문, 길 묻기 등 역할극 |
| **번역 기능** | 버튼 클릭 시 즉시 번역 | OpenAI GPT-4o-mini 사용 |
| **대답 추천** | 맥락 기반 3개 예시 제공 | 답변 막힐 때 도움 |
| **부모 모니터링** | 자녀 학습 현황 조회만 | 시간 제한 설정은 Phase 2 |

### 2.3 비용 관리 결정
- **월 예산 한도**: $50
- **알림 설정**: $50, $75, $100 도달 시 알림
- **일일 사용량 제한**: 1인당 하루 15분 권장 (선택사항)
- **비용 초과 시**: 알림 표시, 관리자에게 이메일 발송

---

## 3. 기술 스택

### 3.1 Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + React Query (캐싱)
- **Audio Handling**: Web Audio API, MediaRecorder API

### 3.2 Backend
- **API Routes**: Next.js API Routes (서버리스)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: WebSocket (Next.js ↔ OpenAI)

### 3.3 AI Services
- **음성 대화**: OpenAI Realtime API (gpt-realtime)
- **번역**: OpenAI GPT-4o-mini
- **피드백 생성**: OpenAI GPT-4o-mini
- **대답 추천**: OpenAI GPT-4o-mini

### 3.4 Deployment & Infrastructure
- **Hosting**: Vercel
- **Version Control**: GitHub
- **Environment**: Production (Vercel), Local Development

### 3.5 필수 라이브러리
```
next, react, react-dom, typescript
@supabase/supabase-js, @supabase/auth-helpers-nextjs
openai
tailwindcss, autoprefixer, postcss
recharts (차트), date-fns (날짜 처리)
zod (유효성 검사)
```

---

## 4. 사용자 스토리

### 4.1 Core User Stories

#### US-001: 로그인
**As a** 가족 구성원  
**I want to** 이름과 4자리 비밀번호로 간편하게 로그인  
**So that** 번거로운 이메일 인증 없이 빠르게 학습 시작

**Acceptance Criteria**:
- 이름(영문/한글 5-20자) 입력
- 비밀번호(숫자 4자리) 입력
- 잘못된 정보 시 "이름 또는 비밀번호가 틀렸습니다" 에러 표시
- 로그인 성공 시 수준 선택 페이지로 이동

---

#### US-002: 수준 선택 및 자동 레벨링
**As a** 학습자  
**I want to** 내 영어 수준을 선택하거나 자동으로 판정받기  
**So that** 나에게 딱 맞는 난이도로 학습 가능

**Acceptance Criteria**:
- 첫 로그인 시: "자동 레벨 테스트" 또는 "수동 선택(초급/중급/고급)" 선택
- 자동 테스트: AI가 3-5개 간단한 질문으로 수준 판정
- 대화 중 "너무 어려워요/쉬워요" 버튼으로 즉시 조정
- 선택한 수준은 프로필에 저장, 다음 로그인 시 자동 적용

---

#### US-003: 시나리오 선택 및 대화 시작
**As a** 학습자  
**I want to** 실생활 상황(패스트푸드 주문, 길 묻기 등)을 선택  
**So that** 실전에서 바로 쓸 수 있는 영어 학습

**Acceptance Criteria**:
- 시나리오 목록 표시:
  - 자기소개하기, 학교생활 이야기하기
  - 패스트푸드 주문하기, 카페에서 주문하기
  - 길 묻고 답하기, 쇼핑하기
  - 전화 걸기, 약속 잡기
- 선택 시 AI가 해당 시나리오로 대화 시작
- 시나리오 목표 달성 시 뱃지 획득 (Phase 1.5)

---

#### US-004: 실시간 음성 대화
**As a** 학습자  
**I want to** AI 선생님과 실시간으로 음성 대화  
**So that** 사람과 대화하듯 자연스럽게 영어 연습

**Acceptance Criteria**:
- 🎤 버튼 클릭 또는 자동 음성 감지(VAD)로 대화 시작
- 내가 말하면 AI가 듣고, AI가 말할 때 언제든 끼어들기 가능
- 음성 볼륨 시각화 (말하는 중임을 표시)
- 말한 내용이 텍스트로 실시간 표시
- AI 응답도 텍스트로 실시간 표시
- 네트워크 끊김 시 "연결이 끊겼습니다" 알림 + 자동 재연결 시도

---

#### US-005: 번역 기능
**As a** 학습자  
**I want to** AI가 말한 문장 중 모르는 것을 즉시 번역  
**So that** 의미를 이해하고 대화 계속 진행

**Acceptance Criteria**:
- AI 메시지 옆에 "🌐 번역" 버튼 표시
- 클릭 시 해당 문장의 한국어 번역 표시
- 번역 결과는 말풍선 아래에 작은 글씨로 표시
- 번역 로딩 중 "번역 중..." 표시

---

#### US-006: 대답 추천
**As a** 학습자  
**I want to** 대답을 모를 때 추천 문장을 받기  
**So that** 막히지 않고 대화 이어가기

**Acceptance Criteria**:
- "💡 대답 추천받기" 버튼 표시
- 클릭 시 현재 대화 맥락에 맞는 3개 응답 예시 제공
- 예시 클릭 시 해당 문장이 내 대답으로 전송
- 추천 문장은 내 수준에 맞게 생성

---

#### US-007: 피드백 및 더 나은 표현 제안
**As a** 학습자  
**I want to** 내가 한 말에 대한 피드백을 받기  
**So that** 실수를 고치고 더 나은 표현 배우기

**Acceptance Criteria**:
- **즉시 교정**: 의미 전달이 안 되는 심각한 실수만 즉시 알림
- **칭찬 먼저**: "Good job!" 같은 긍정 피드백 먼저 제공
- **더 나은 표현**: 문법적으로 맞지만 더 자연스러운 표현이 있으면 제안
- 피드백 형식:
  - ✨ 더 나은 표현: "교정된 문장" (간단한 설명)
  - 💡 원어민 표현: "더 자연스러운 문장" (왜 더 좋은지 설명)

---

#### US-008: 대화 내용 저장
**As a** 학습자  
**I want to** 대화가 끝나면 자동으로 저장  
**So that** 나중에 복습하고 진도 확인

**Acceptance Criteria**:
- 대화 종료 시 Supabase에 자동 저장:
  - 대화 세션 정보 (시작/종료 시간, 총 시간, 수준, 시나리오)
  - 모든 메시지 (타임스탬프 포함)
  - 피드백 내용
- 네트워크 끊김 시 localStorage에 임시 저장 → 복구 시 자동 업로드
- 저장 완료 시 "대화가 저장되었습니다" 알림

---

#### US-009: 학습 기록 조회
**As a** 학습자  
**I want to** 내 학습 통계와 과거 대화를 보기  
**So that** 내 진도를 확인하고 복습

**Acceptance Criteria**:
- 대시보드 표시:
  - 총 학습 시간, 대화 세션 수, 이번 주 학습 횟수
  - 주간 학습 추세 차트
  - 수준별 학습 분포 (초급/중급/고급 비율)
- 대화 기록 목록:
  - 날짜별 그룹화
  - 각 대화의 수준, 시간, 메시지 수 표시
  - 클릭하면 대화 상세 내용 보기
- 대화 상세 보기:
  - 전체 대화 내용 (타임스탬프 포함)
  - 받았던 피드백도 함께 표시

---

#### US-010: 부모 모니터링 (선택사항)
**As a** 부모  
**I want to** 자녀의 학습 현황을 확인  
**So that** 학습을 격려하고 관리

**Acceptance Criteria**:
- 부모 계정 플래그 설정 (DB에 is_parent 필드)
- 부모 로그인 시 "자녀 관리" 메뉴 표시
- 자녀별 학습 통계 조회:
  - 총 학습 시간, 최근 7일 활동
  - 주로 사용하는 수준
- 개별 대화 내용은 조회 불가 (프라이버시 보호)

---

## 5. 기능 요구사항

### 5.1 인증 및 사용자 관리

#### 5.1.1 회원가입
- Supabase Auth 사용
- 이름(username): 영문/한글 5-20자, 중복 불가
- 비밀번호: 숫자 4자리 (해싱 저장)
- 생성 시 기본 수준: "미설정"

#### 5.1.2 로그인
- 이름 + 비밀번호 입력
- Supabase Auth 세션 생성
- JWT 토큰을 httpOnly 쿠키에 저장 (7일 유효)
- 로그인 성공 시:
  - 첫 로그인: 수준 설정 페이지로
  - 재로그인: 메인 페이지로

#### 5.1.3 로그아웃
- 세션 종료
- 로그인 페이지로 리다이렉트

---

### 5.2 수준 설정 및 자동 레벨링

#### 5.2.1 수준 정의
| 수준 | 대상 | 특징 |
|------|------|------|
| **초급 (Beginner)** | 초등 1-3학년 | 단순 단어, 매우 느린 속도, 많은 반복, 5단어 이하 문장 |
| **중급 (Intermediate)** | 초등 4-6학년 | 일상 표현, 보통 속도, 관용구/숙어 도입 |
| **고급 (Advanced)** | 중학생 | 복잡한 문장, 자연스러운 속도, 의견/주장 대화 |

#### 5.2.2 자동 레벨 테스트
**프로세스**:
1. "자동 레벨 테스트" 선택
2. AI가 3-5개 질문:
   - "What's your name?"
   - "How old are you?"
   - "What do you like to do?"
   - (답변에 따라 난이도 조절)
3. 답변 분석:
   - 어휘 수준, 문장 복잡도, 문법 정확도
   - GPT-4o-mini로 수준 판정
4. 결과 저장 및 대화 시작

#### 5.2.3 대화 중 수준 조정
- UI에 "😰 너무 어려워요" / "😊 너무 쉬워요" 버튼
- 클릭 시 즉시 AI에게 전달 → 다음 응답부터 난이도 조절
- 조정 내역은 DB에 기록 (학습 패턴 분석용)

---

### 5.3 시나리오 기반 대화 (핵심 기능!)

#### 5.3.1 시나리오 목록
**카테고리별 시나리오**:

**일상 (Daily Life)**:
- 자기소개하기
- 가족 소개하기
- 하루 일과 말하기
- 취미 이야기하기

**학교 (School)**:
- 학교생활 이야기하기
- 친구 사귀기
- 수업 시간 대화

**음식 (Food)**:
- 패스트푸드 주문하기 🍔
- 카페에서 음료 주문하기 ☕
- 레스토랑 예약하기
- 음식 맛 표현하기

**외출 (Going Out)**:
- 길 묻고 답하기 🗺️
- 버스/지하철 타기
- 쇼핑하기
- 티켓 구매하기

**소통 (Communication)**:
- 전화로 약속 잡기 📞
- 문자 메시지 보내기
- 이메일 쓰기

#### 5.3.2 시나리오 실행 방식
**예시: "패스트푸드 주문하기"**

1. **시나리오 시작**:
   - AI가 먼저 역할극 시작
   - "Welcome to Burger King! What can I get for you?"

2. **대화 진행**:
   - 사용자: "I want a burger."
   - AI: "Which burger would you like? We have a Whopper, a Cheeseburger..."
   - (수준에 따라 난이도 조절)

3. **목표 달성**:
   - 주문 완료, 가격 확인, 지불 방법 선택 등
   - 목표 달성 시: "Great job! You successfully ordered!" + 뱃지 획득 (Phase 1.5)

4. **피드백 제공**:
   - 대화 종료 후 핵심 표현 정리
   - 실수했던 부분 복습

#### 5.3.3 시나리오 System Prompt
각 시나리오별로 AI 역할 명확히 정의:
```
시나리오: 패스트푸드 주문하기
역할: 패스트푸드 점원
목표: 학습자가 음식 주문, 사이드 선택, 가격 확인, 지불까지 완료
진행 방식:
- 메뉴 설명, 추천 제공
- 학습자가 막히면 힌트 제공
- 주문 완료 후 칭찬 및 핵심 표현 정리
```

---

### 5.4 실시간 음성 대화

#### 5.4.1 WebSocket 프록시 아키텍처
**흐름**:
```
[브라우저] <--WebSocket--> [Next.js API Route] <--WebSocket--> [OpenAI Realtime API]
```

**이유**:
- 클라이언트에서 OpenAI API 키 직접 노출 방지
- 사용자 인증 검증
- 사용량 추적 및 제한

#### 5.4.2 음성 녹음 및 전송
- **브라우저 MediaRecorder API** 사용
- 마이크 권한 요청
- 오디오 포맷: PCM 16-bit, 24kHz (OpenAI 권장)
- 청크 단위 전송: 100ms마다 전송
- 음성 활동 감지(VAD): 서버 측에서 자동 처리

#### 5.4.3 AI 응답 수신 및 재생
- OpenAI에서 오디오 스트림 수신
- Web Audio API로 실시간 재생
- 버퍼링 최소화 (200ms 이하)

#### 5.4.4 대화 제어
- **일시정지**: 음성 전송 중단, 연결 유지
- **재개**: 다시 음성 전송
- **종료**: WebSocket 연결 종료 → 대화 저장

#### 5.4.5 텍스트 실시간 표시
- OpenAI Realtime API는 음성과 함께 텍스트(transcript)도 반환
- 사용자 말: `conversation.item.input_audio_transcription.completed` 이벤트
- AI 응답: `conversation.item.created` 이벤트
- 화면에 말풍선 형태로 실시간 추가

#### 5.4.6 네트워크 끊김 처리
**감지**:
- WebSocket `error`, `close` 이벤트
- 3초 동안 응답 없으면 타임아웃

**대응**:
1. "연결이 끊겼습니다. 재연결 중..." 알림 표시
2. localStorage에 현재까지 대화 내용 저장
3. 자동 재연결 시도 (3회, 지수 백오프)
4. 재연결 성공 시:
   - 대화 이어가기 또는 새로 시작 선택
   - localStorage 데이터를 Supabase에 업로드
5. 3회 실패 시: "네트워크를 확인해주세요" 에러 표시

---

### 5.5 번역 기능

#### 5.5.1 동작 방식
- AI 메시지 옆 "🌐 번역" 버튼
- 클릭 시 Next.js API Route 호출
- GPT-4o-mini로 영어 → 한국어 번역
- 결과를 말풍선 아래 작은 글씨로 표시

#### 5.5.2 최적화
- 같은 문장은 재번역 안 함 (컴포넌트 state에 캐싱)
- 번역 로딩 중 "번역 중..." 표시
- 에러 시 "번역에 실패했습니다. 다시 시도해주세요."

---

### 5.6 대답 추천 기능

#### 5.6.1 동작 방식
- "💡 대답 추천받기" 버튼
- 클릭 시 API Route 호출
- GPT-4o-mini에게 현재 대화 히스토리 + 학습자 수준 전달
- 3개의 적절한 응답 예시 생성
- 예시 클릭 시 해당 문장을 사용자 입력으로 전송

#### 5.6.2 생성 원칙
- 학습자 수준에 맞는 난이도
- 대화 맥락에 자연스럽게 이어지는 응답
- 다양한 표현 (3개 모두 다른 스타일)

---

### 5.7 피드백 및 더 나은 표현 제안

#### 5.7.1 피드백 타이밍
**즉시 교정 (Critical Errors)**:
- 의미 전달이 완전히 안 되는 경우
- 예: "I go school yesterday" → 즉시 "Did you mean 'I went to school yesterday'?"

**대화 중 제안 (Suggestions)**:
- 문법적으로는 맞지만 더 자연스러운 표현이 있는 경우
- 사용자 메시지 아래 작게 표시:
  - ✨ 더 나은 표현: "I went to school"
  - 💡 원어민 표현: "I headed to school"

**대화 종료 후 정리 (Summary)**:
- 전체 대화에서 자주 틀린 패턴 분석
- 복습 포인트 3-5개 제시

#### 5.7.2 피드백 생성 방식
- 사용자 메시지를 GPT-4o-mini로 분석
- JSON 형식 응답:
```json
{
  "hasCriticalError": false,
  "correctedText": null,
  "betterExpression": "I went to school",
  "betterExplanation": "과거형을 사용하면 더 정확해요",
  "nativeExpression": "I headed to school",
  "nativeExplanation": "원어민들이 더 자주 쓰는 표현이에요"
}
```

#### 5.7.3 칭찬 우선 원칙
- 피드백 전에 항상 긍정 요소 먼저:
  - "Great pronunciation!" (발음 좋음)
  - "Good try!" (시도 칭찬)
  - "I understood you perfectly!" (의미 전달 성공)
- 피드백은 부드럽게:
  - "You can also say..." (명령 X)
  - "Native speakers often say..." (정보 전달)

---

### 5.8 대화 저장 (Supabase)

#### 5.8.1 저장 타이밍
- 대화 종료 버튼 클릭 시
- 브라우저 창 닫기 전 (`beforeunload` 이벤트)
- 네트워크 복구 시 (localStorage 백업 데이터)

#### 5.8.2 저장 내용
**conversations 테이블**:
- user_id, level, scenario_id (선택한 시나리오)
- started_at, ended_at, duration_seconds
- message_count

**messages 테이블**:
- conversation_id, role (user/assistant), content
- timestamp

**feedbacks 테이블** (선택사항):
- message_id, feedback_type, content

#### 5.8.3 localStorage 백업
**저장 키**: `pending_conversation_${sessionId}`

**저장 내용**:
```json
{
  "conversationId": "uuid",
  "userId": "uuid",
  "level": "intermediate",
  "scenarioId": "fast_food_order",
  "startedAt": "2025-02-04T10:00:00Z",
  "messages": [
    { "role": "assistant", "content": "Welcome!", "timestamp": "..." },
    { "role": "user", "content": "Hi!", "timestamp": "..." }
  ]
}
```

**동기화**:
- 네트워크 복구 시 localStorage 확인
- Supabase에 업로드 시도
- 성공하면 localStorage 삭제

---

### 5.9 학습 기록 대시보드

#### 5.9.1 통계 표시
**주요 지표**:
- 총 학습 시간 (HH:MM 형식)
- 총 대화 세션 수
- 이번 주 학습 횟수
- 평균 대화 시간

**차트**:
- 최근 7일 일별 학습 시간 (막대 차트)
- 수준별 학습 분포 (도넛 차트)

**주간 스트릭** (Phase 1.5):
- 연속 학습 일수
- GitHub 잔디밭 스타일 캘린더

#### 5.9.2 대화 기록 목록
**정렬**:
- 최신순 (기본)
- 날짜별 그룹화

**각 항목 표시**:
- 날짜/시간
- 수준 배지
- 시나리오 이름
- 대화 시간
- 메시지 수
- 썸네일 (첫 메시지 미리보기)

**필터링** (Phase 1.5):
- 수준별
- 시나리오별
- 날짜 범위

#### 5.9.3 대화 상세 보기
**표시 내용**:
- 전체 메시지 (타임스탬프 포함)
- 받았던 피드백 (접혀있다가 펼치기)
- 학습한 핵심 표현 목록

**추가 기능** (Phase 1.5):
- 특정 메시지 북마크
- 대화 다시 듣기 (오디오 재생)
- PDF로 다운로드

---

### 5.10 부모 모니터링

#### 5.10.1 부모 계정 설정
- 회원가입 시 "부모 계정" 체크박스
- DB에 `is_parent: boolean` 필드
- 부모는 자신의 학습 + 자녀 모니터링 가능

#### 5.10.2 자녀 연결
**방법 1**: 회원가입 시 부모 아이디 입력
**방법 2**: 부모가 초대 코드 생성 → 자녀가 입력

**DB 구조**:
```sql
-- family_members 테이블
parent_id UUID REFERENCES users(id)
child_id UUID REFERENCES users(id)
```

#### 5.10.3 모니터링 화면
**볼 수 있는 것**:
- 자녀별 학습 통계 (총 시간, 세션 수, 최근 활동)
- 주로 사용하는 수준
- 시나리오별 학습 분포

**볼 수 없는 것**:
- 개별 대화 내용 (프라이버시 보호)
- 구체적인 실수나 피드백

**알림** (Phase 2):
- 자녀가 목표 달성 시 부모에게 알림
- 일주일 동안 학습 안 하면 알림

---

## 6. 데이터베이스 설계

### 6.1 Supabase 테이블 스키마

#### 6.1.1 users (Supabase Auth 확장)
```sql
CREATE TABLE public.users (
  -- Supabase Auth 기본 필드
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 커스텀 필드
  username VARCHAR(20) UNIQUE NOT NULL,
  display_name VARCHAR(50),
  level VARCHAR(20) DEFAULT 'not_set', -- 'beginner', 'intermediate', 'advanced', 'not_set'
  is_parent BOOLEAN DEFAULT false,
  
  -- 메타데이터
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_users_username ON public.users(username);
```

#### 6.1.2 family_members (부모-자녀 관계)
```sql
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- 유니크 제약
  UNIQUE(parent_id, child_id)
);

CREATE INDEX idx_family_parent ON family_members(parent_id);
CREATE INDEX idx_family_child ON family_members(child_id);
```

#### 6.1.3 scenarios (시나리오 마스터)
```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  name_en VARCHAR(100) NOT NULL, -- "Fast Food Ordering"
  name_ko VARCHAR(100) NOT NULL, -- "패스트푸드 주문하기"
  category VARCHAR(50) NOT NULL, -- 'daily', 'school', 'food', 'going_out', 'communication'
  
  description TEXT,
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced', 'all'
  
  system_prompt TEXT NOT NULL, -- AI 역할 정의
  goals TEXT[], -- 달성 목표 리스트
  
  icon VARCHAR(10), -- 이모지
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0, -- 정렬 순서
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 기본 데이터 INSERT
INSERT INTO scenarios (name_en, name_ko, category, difficulty_level, icon, system_prompt, goals) VALUES
('Self Introduction', '자기소개하기', 'daily', 'beginner', '👋', 
  'You are a friendly English teacher. Help the student introduce themselves...', 
  ARRAY['name', 'age', 'hobby']),
('Fast Food Ordering', '패스트푸드 주문하기', 'food', 'intermediate', '🍔',
  'You are a fast food restaurant cashier. Help the student order food...',
  ARRAY['choose_item', 'size_drink', 'payment']),
('Asking Directions', '길 묻기', 'going_out', 'intermediate', '🗺️',
  'You are a friendly local person. The student will ask you for directions...',
  ARRAY['ask_location', 'understand_directions', 'say_thanks']);
```

#### 6.1.4 conversations (대화 세션)
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE SET NULL,
  
  level VARCHAR(20) NOT NULL, -- 대화 시작 시 수준
  
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  duration_seconds INTEGER, -- ended_at - started_at 계산
  
  message_count INTEGER DEFAULT 0,
  
  -- 목표 달성 여부 (Phase 1.5)
  goals_achieved TEXT[], -- 달성한 목표 ID 리스트
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_started ON conversations(started_at DESC);
```

#### 6.1.5 messages (대화 메시지)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  
  timestamp TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
```

#### 6.1.6 feedbacks (피드백 기록)
```sql
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  
  feedback_type VARCHAR(20) NOT NULL, -- 'correction', 'better_expression', 'native_expression'
  
  original_text TEXT,
  suggested_text TEXT NOT NULL,
  explanation TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedbacks_message ON feedbacks(message_id);
```

#### 6.1.7 user_stats (통계 캐시, 선택사항)
```sql
-- 빠른 조회를 위한 통계 캐시 테이블
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  
  total_conversations INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  
  last_conversation_at TIMESTAMP,
  current_streak_days INTEGER DEFAULT 0, -- 연속 학습 일수
  
  -- 수준별 분포
  beginner_count INTEGER DEFAULT 0,
  intermediate_count INTEGER DEFAULT 0,
  advanced_count INTEGER DEFAULT 0,
  
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6.2 Row Level Security (RLS) 정책

#### 6.2.1 users 테이블
```sql
-- 자기 자신만 조회 가능
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- 자기 자신만 수정 가능
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);
```

#### 6.2.2 conversations 테이블
```sql
-- 자신의 대화만 조회
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

-- 자신의 대화만 생성
CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 부모는 자녀 대화 통계 조회 가능 (상세 내용 X)
CREATE POLICY "Parents can view children stats"
  ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE parent_id = auth.uid() AND child_id = conversations.user_id
    )
  );
```

#### 6.2.3 messages 테이블
```sql
-- 자신의 대화 메시지만 조회
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );
```

### 6.3 데이터베이스 함수

#### 6.3.1 대화 종료 시 통계 업데이트
```sql
CREATE OR REPLACE FUNCTION update_conversation_end()
RETURNS TRIGGER AS $$
BEGIN
  -- duration_seconds 계산
  IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
    
    -- user_stats 업데이트 (있으면 UPDATE, 없으면 INSERT)
    INSERT INTO user_stats (user_id, total_conversations, total_duration_seconds, last_conversation_at)
    VALUES (NEW.user_id, 1, NEW.duration_seconds, NEW.ended_at)
    ON CONFLICT (user_id) DO UPDATE SET
      total_conversations = user_stats.total_conversations + 1,
      total_duration_seconds = user_stats.total_duration_seconds + NEW.duration_seconds,
      last_conversation_at = NEW.ended_at,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_end
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_end();
```

---

## 7. 시스템 아키텍처

### 7.1 전체 구조도
```
┌─────────────────────────────────────────────────────────────────┐
│                          사용자 (브라우저)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React 컴포넌트 (Next.js 14 App Router)                  │  │
│  │  - 음성 녹음 (MediaRecorder)                             │  │
│  │  - 음성 재생 (Web Audio API)                             │  │
│  │  - UI 렌더링 (Tailwind CSS)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                          │                            │
│         │ WebSocket                │ HTTPS                      │
│         ▼                          ▼                            │
└─────────────────────────────────────────────────────────────────┘
         │                          │
         │                          │
┌────────┴──────────────────────────┴─────────────────────────────┐
│              Next.js 서버 (Vercel)                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Routes (서버리스 함수)                               │  │
│  │  - /api/realtime (WebSocket 프록시)                       │  │
│  │  - /api/translate (번역)                                  │  │
│  │  - /api/suggest-response (대답 추천)                      │  │
│  │  - /api/feedback (피드백 생성)                            │  │
│  │  - /api/auth/* (인증)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                          │                            │
│         │ WebSocket                │ HTTPS                      │
│         ▼                          ▼                            │
└─────────────────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
┌──────────────────┐      ┌──────────────────────┐
│  OpenAI API      │      │  Supabase            │
│  - Realtime API  │      │  - PostgreSQL        │
│  - GPT-4o-mini   │      │  - Auth              │
│  - Whisper       │      │  - Storage (미래)    │
└──────────────────┘      └──────────────────────┘
```

### 7.2 WebSocket 프록시 상세

#### 7.2.1 연결 흐름
```
1. 클라이언트: /api/realtime?level=intermediate&scenario=fast_food 요청
2. Next.js: 사용자 인증 확인 (JWT 쿠키)
3. Next.js: OpenAI Realtime API에 WebSocket 연결
4. Next.js: 세션 설정 (System Prompt, 수준, 시나리오)
5. Next.js: 클라이언트 ↔ OpenAI 간 양방향 프록시 시작
6. 클라이언트: 오디오 청크 전송 → Next.js → OpenAI
7. OpenAI: 응답 오디오 + 텍스트 → Next.js → 클라이언트
8. 종료: 클라이언트가 연결 종료 → Next.js가 OpenAI 연결도 종료
```

#### 7.2.2 보안 검증
- 모든 WebSocket 요청에 JWT 토큰 필요
- 토큰 검증 실패 시 연결 거부
- 사용자별 동시 연결 제한 (1개)
- Rate Limiting: 1시간당 최대 10회 세션

#### 7.2.3 사용량 추적
- 각 세션의 오디오 입력/출력 토큰 수 기록
- DB에 저장 (비용 분석용)
- 일일 사용량이 한도 초과 시 알림

---

### 7.3 클라이언트 ↔ 서버 통신

#### 7.3.1 WebSocket (실시간 음성)
**용도**: 음성 대화만
**엔드포인트**: `wss://yourdomain.com/api/realtime`
**메시지 형식**: Binary (오디오 청크) + JSON (메타데이터)

#### 7.3.2 HTTPS (일반 API)
**용도**: 번역, 피드백, 데이터 조회 등
**엔드포인트**: `/api/*`
**메시지 형식**: JSON

---

### 7.4 환경 변수 관리

#### 7.4.1 필수 환경 변수
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # 서버 전용

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx # 서버 전용

# JWT Secret (Supabase Auth)
JWT_SECRET=your-jwt-secret # 서버 전용

# 비용 알림 (선택사항)
COST_ALERT_EMAIL=parent@example.com
COST_ALERT_THRESHOLD=50 # 달러
```

#### 7.4.2 Vercel 환경 변수 설정
- Vercel 대시보드 → Settings → Environment Variables
- Production, Preview, Development 각각 설정
- `NEXT_PUBLIC_*`는 클라이언트에 노출되므로 민감 정보 금지

---

## 8. 보안 및 인증

### 8.1 Supabase Auth 설정

#### 8.1.1 인증 흐름
```
1. 회원가입: Supabase Auth에 username + hashed password 저장
2. 로그인: Supabase Auth 세션 생성 → JWT 토큰 발급
3. 토큰 저장: httpOnly 쿠키에 저장 (XSS 방어)
4. 요청 시: 쿠키의 JWT를 자동으로 서버에 전송
5. 검증: Next.js 서버가 JWT 검증 → user_id 추출
6. 로그아웃: 세션 삭제 + 쿠키 삭제
```

#### 8.1.2 비밀번호 해싱
- Supabase Auth가 자동으로 bcrypt 해싱
- 4자리 숫자라도 안전하게 저장됨
- Rainbow table 공격 방어

#### 8.1.3 세션 관리
- JWT 유효기간: 7일
- Refresh token: 30일
- 자동 갱신: Access token 만료 시 자동으로 refresh

### 8.2 API 보안

#### 8.2.1 인증 미들웨어
모든 보호된 API Route에서 사용:
```typescript
// lib/auth-middleware.ts
async function requireAuth(req) {
  const token = req.cookies.get('sb-access-token');
  if (!token) throw new Error('Unauthorized');
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) throw new Error('Invalid token');
  
  return user;
}
```

#### 8.2.2 Rate Limiting
- WebSocket: 1시간당 10회 연결
- 번역 API: 1분당 30회
- 대답 추천 API: 1분당 20회
- 피드백 API: 1분당 30회

#### 8.2.3 CORS 설정
- Vercel에서 자동 처리
- 필요 시 `next.config.js`에서 설정

### 8.3 데이터 보안

#### 8.3.1 Supabase RLS (Row Level Security)
- 모든 테이블에 RLS 활성화
- 사용자는 자신의 데이터만 조회/수정 가능
- 부모는 자녀 통계만 조회 가능 (상세 내용 X)

#### 8.3.2 민감 정보 처리
- API 키는 절대 클라이언트에 노출 금지
- 환경 변수는 `.env.local` (gitignore)
- Vercel 환경 변수로 관리

---

## 9. 비용 관리

### 9.1 예상 비용 (월간)

#### 9.1.1 OpenAI Realtime API
**가정**: 가족 4명, 하루 평균 10분씩 사용

| 항목 | 계산 | 비용 |
|------|------|------|
| **오디오 입력** | 4명 × 30일 × 10분 × $0.007/분 | $8.40 |
| **오디오 출력** | 4명 × 30일 × 10분 × $0.029/분 | $34.80 |
| **합계** | | **$43.20** |

**변수**:
- 실제 대화 시간은 연결 시간보다 짧음 (침묵, 생각 시간)
- VAD(Voice Activity Detection)로 최적화 가능
- 예상: **$35-45/월**

#### 9.1.2 OpenAI GPT-4o-mini (번역, 피드백)
**가정**: 월 1,000회 호출, 평균 500 토큰/회

| 항목 | 계산 | 비용 |
|------|------|------|
| **입력** | 1,000회 × 300토큰 × $0.15/1M | $0.045 |
| **출력** | 1,000회 × 200토큰 × $0.60/1M | $0.120 |
| **합계** | | **$0.17** |

#### 9.1.3 Supabase
- **Free tier**: 500MB 데이터, 2GB 전송/월
- **예상 사용량**: 월 50MB (텍스트만)
- **비용**: **$0 (무료)**

#### 9.1.4 Vercel
- **Hobby plan**: 무료
- **제한**: 월 100GB 대역폭, 1,000회 서버리스 함수 실행/일
- **예상**: 문제없이 무료 사용 가능
- **비용**: **$0**

#### 9.1.5 총 예상 비용
**월 $43.37** ≈ **$45**

---

### 9.2 비용 모니터링 및 알림

#### 9.2.1 OpenAI 사용량 추적
**방법 1: OpenAI 대시보드**
- https://platform.openai.com/usage
- 사용량 알림 설정:
  - $50 도달 시 이메일
  - $75 도달 시 이메일
  - $100 도달 시 이메일 + SMS (선택)

**방법 2: 코드로 추적**
- 각 API 호출 시 토큰 수 기록
- DB에 저장 (`api_usage` 테이블)
- 일일 집계 후 알림 전송

#### 9.2.2 알림 시스템
**트리거**:
- 월 누적 비용이 $50 초과 시
- 일일 비용이 $5 초과 시 (비정상 사용 감지)

**알림 방법**:
- 앱 내 알림 (로그인 시 팝업)
- 이메일 (Supabase Edge Functions + Resend)
- 부모 계정에만 알림

**알림 내용**:
```
⚠️ 비용 알림

이번 달 OpenAI 사용 비용이 $50를 초과했습니다.

현재 사용량: $52.30
예상 월말 비용: $70.00

사용량을 확인하고 필요시 일일 한도를 설정해주세요.
```

#### 9.2.3 비용 절감 방법
1. **VAD 최적화**: 침묵 구간은 전송 안 함
2. **캐싱**: 같은 번역 요청은 재사용
3. **모델 선택**:
   - 번역/피드백: GPT-4o-mini (저렴)
   - 음성: Realtime API (필수)
4. **일일 한도**: 1인당 15분/일 권장

---

### 9.3 사용량 제한 (선택사항)

#### 9.3.1 하드 리밋
- 사용자별 일일 최대 시간: 20분
- 초과 시: "오늘 학습 시간을 모두 사용했습니다. 내일 다시 만나요!" 메시지

#### 9.3.2 소프트 리밋
- 10분 사용 시: "5분 남았어요"
- 15분 사용 시: "곧 오늘 학습이 종료됩니다"

#### 9.3.3 관리자 설정
- 부모가 자녀별 일일 한도 설정 가능 (Phase 2)

---

## 10. 위험 요소 및 대응

### 10.1 기술적 위험

#### 10.1.1 음성 인식 정확도
**위험**: 한국인 발음을 잘못 인식

**대응**:
- ✅ 텍스트로 실시간 표시 (확인 가능)
- ✅ "다시 말하기" 버튼
- ✅ 타이핑 입력 대체 옵션
- ✅ System Prompt에 "Korean student" 명시

**테스트 계획**:
- 가족 4명 각자 10분씩 테스트
- 인식 오류율 측정
- 오류 패턴 분석 후 프롬프트 개선

---

#### 10.1.2 네트워크 불안정
**위험**: 대화 중 인터넷 끊김 → 데이터 손실

**대응**:
- ✅ localStorage에 실시간 백업
- ✅ 자동 재연결 (3회 시도, 지수 백오프)
- ✅ 재연결 실패 시 "저장된 대화를 Supabase에 업로드할까요?" 확인

**테스트 계획**:
- 대화 중 WiFi 끄기
- 1분 후 다시 켜기
- 데이터 손실 없이 복구되는지 확인

---

#### 10.1.3 WebSocket 프록시 안정성
**위험**: Next.js 서버리스 함수는 WebSocket 장시간 유지 어려움

**대응**:
- ✅ Vercel의 WebSocket 지원 확인 (현재 베타)
- ✅ 타임아웃 설정: 20분 (충분히 긴 시간)
- ✅ 20분 초과 시 자동 종료 + 재시작 안내

**대안** (필요 시):
- AWS Lambda + API Gateway WebSocket
- Cloudflare Workers (Durable Objects)

---

#### 10.1.4 비용 폭증
**위험**: 버그나 남용으로 비용 급증

**대응**:
- ✅ OpenAI 하드 리밋 설정: $100/월
- ✅ 사용자별 일일 한도
- ✅ Rate Limiting
- ✅ 알림 시스템 ($50, $75, $100)

**모니터링**:
- 매일 오전 9시 비용 체크
- 이상 패턴 감지 시 즉시 알림

---

### 10.2 사용성 위험

#### 10.2.1 AI가 너무 빠르게 말함
**위험**: 초급 학습자가 알아듣기 어려움

**대응**:
- ✅ System Prompt에 수준별 속도 명시:
  - 초급: "Speak VERY slowly, pause between words"
  - 중급: "Speak at a moderate, clear pace"
  - 고급: "Speak naturally at normal speed"
- ✅ 음성 속도 조절 버튼 (0.7x, 1.0x, 1.3x) - Phase 1.5

---

#### 10.2.2 피드백 과다
**위험**: 실수마다 교정하면 대화 흐름 끊김

**대응**:
- ✅ 중요한 실수만 즉시 교정
- ✅ 칭찬 먼저 제공
- ✅ 사소한 실수는 대화 종료 후 정리
- ✅ "피드백 모드" 설정 (Phase 1.5):
  - "실시간 교정"
  - "자연스러운 대화"

---

#### 10.2.3 시나리오가 지루함
**위험**: 같은 시나리오 반복 → 흥미 저하

**대응**:
- ✅ 다양한 시나리오 제공 (최소 10개)
- ✅ 같은 시나리오도 매번 다른 대화 흐름
- ✅ 목표 달성 시 뱃지 (게이미피케이션)
- ✅ 새 시나리오 정기 추가

---

### 10.3 제품 위험

#### 10.3.1 사용자 이탈
**위험**: 처음엔 사용하다가 며칠 후 안 씀

**대응**:
- ✅ 게이미피케이션 (스트릭, 뱃지) - Phase 1.5
- ✅ 일일 알림: "오늘 영어 연습 안 하세요?" (선택 가입)
- ✅ 부모 모니터링으로 자녀 격려
- ✅ 짧은 세션 권장 (10-15분)

---

#### 10.3.2 경쟁 제품
**위험**: 스픽, 링글 같은 앱이 더 좋음

**차별화**:
- ✅ 가족 전용 (4인 공유)
- ✅ 부모 모니터링
- ✅ 시나리오 기반 학습
- ✅ 맞춤형 AI 선생님
- ✅ 저렴한 비용 ($45 vs $100+)

---

## 11. 개발 우선순위

### 11.1 Phase 0: 프로젝트 설정 (Day 1-2)
**목표**: 개발 환경 구축

**작업**:
- [ ] Next.js 프로젝트 초기화
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 생성
- [ ] GitHub 리포지토리 설정
- [ ] Vercel 연결 및 환경 변수 설정
- [ ] 기본 UI 컴포넌트 라이브러리 설정 (Tailwind)

---

### 11.2 MVP (Minimum Viable Product) - Week 1-2
**목표**: 핵심 기능만으로 동작하는 제품

#### Week 1
**Day 1-2: 인증**
- [ ] Supabase Auth 설정
- [ ] 회원가입 페이지 (이름 + 4자리 비번)
- [ ] 로그인 페이지
- [ ] 로그아웃 기능

**Day 3-4: 기본 대화 UI**
- [ ] 수준 선택 페이지 (초/중/고)
- [ ] 대화 페이지 레이아웃
- [ ] 음성 녹음 버튼 (마이크 권한 요청)
- [ ] 메시지 표시 (말풍선)

**Day 5-7: OpenAI Realtime API 연동**
- [ ] WebSocket 프록시 API Route 생성
- [ ] 클라이언트 WebSocket 연결
- [ ] 오디오 녹음 → 전송
- [ ] AI 응답 수신 → 재생
- [ ] 텍스트 실시간 표시

#### Week 2
**Day 8-10: 대화 저장**
- [ ] 대화 종료 시 Supabase 저장
- [ ] localStorage 백업
- [ ] 네트워크 끊김 처리

**Day 11-12: 기본 대시보드**
- [ ] 학습 통계 표시 (총 시간, 세션 수)
- [ ] 대화 기록 목록
- [ ] 대화 상세 보기

**Day 13-14: 테스트 및 버그 수정**
- [ ] 가족 4명 실제 사용 테스트
- [ ] 주요 버그 수정
- [ ] UI/UX 개선

**MVP 완료**: 기본 음성 대화 + 저장 + 조회 가능

---

### 11.3 Phase 1: 핵심 차별화 기능 - Week 3-4
**목표**: 경쟁 제품과 차별화

#### Week 3
**Day 15-16: 시나리오 시스템** ⭐ 최우선
- [ ] scenarios 테이블 데이터 입력 (10개 시나리오)
- [ ] 시나리오 선택 UI
- [ ] 시나리오별 System Prompt 적용
- [ ] AI가 시나리오에 맞게 대화 시작

**Day 17-18: 번역 & 대답 추천**
- [ ] 번역 API Route 생성
- [ ] "🌐 번역" 버튼 및 결과 표시
- [ ] 대답 추천 API Route
- [ ] "💡 추천" 버튼 및 예시 선택

**Day 19-21: 피드백 시스템**
- [ ] 피드백 생성 API Route
- [ ] 중요한 실수만 즉시 알림 로직
- [ ] 더 나은 표현 제안 UI
- [ ] 칭찬 우선 로직

#### Week 4
**Day 22-23: 자동 레벨링**
- [ ] 레벨 테스트 대화 시퀀스
- [ ] GPT-4o-mini로 수준 판정
- [ ] 대화 중 수준 조정 버튼

**Day 24-25: 부모 모니터링**
- [ ] family_members 테이블 설정
- [ ] 부모 계정 플래그
- [ ] 자녀 학습 통계 조회 페이지

**Day 26-28: 통합 테스트 및 개선**
- [ ] 전체 플로우 테스트
- [ ] 성능 최적화
- [ ] UI/UX 세부 조정

**Phase 1 완료**: 완성도 높은 학습 플랫폼

---

### 11.4 Phase 1.5: 사용성 개선 - Week 5-6
**목표**: 지속 사용 유도

**Week 5**
- [ ] 게이미피케이션:
  - [ ] 연속 학습 일수 (스트릭)
  - [ ] 뱃지 시스템 (첫 대화, 10회 달성 등)
  - [ ] 경험치 및 레벨업
- [ ] 음성 속도 조절 (0.7x / 1.0x / 1.3x)
- [ ] 대화 목표 설정 ("오늘은 과거형 연습")

**Week 6**
- [ ] PWA 설정 (앱처럼 설치)
- [ ] 알림 기능 (웹 푸시)
- [ ] 다크 모드
- [ ] 성능 모니터링 (Vercel Analytics)

---

### 11.5 Phase 2: 고급 기능 (미래)
- [ ] 발음 정확도 평가 (음성 분석)
- [ ] 자녀별 시간 제한 (부모 설정)
- [ ] 대화 오디오 다시 듣기
- [ ] PDF로 대화 내용 다운로드
- [ ] 친구 추가 및 경쟁
- [ ] 커스텀 시나리오 생성 (사용자 요청)

---

## 12. 성공 지표

### 12.1 정량적 지표

#### 12.1.1 사용 지표 (KPI)
| 지표 | 목표 (3개월 후) | 측정 방법 |
|------|-----------------|-----------|
| **주당 활성 사용자** | 4명 전원 | Supabase 로그인 기록 |
| **주당 평균 세션 수** | 1인당 5회 이상 | conversations 테이블 |
| **평균 세션 시간** | 10분 이상 | duration_seconds |
| **재방문율 (D7)** | 80% 이상 | 7일 후 재로그인 비율 |
| **월간 총 학습 시간** | 20시간 이상 | 전체 duration 합계 |

#### 12.1.2 학습 지표
| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| **수준 향상** | 3개월 내 1단계 ↑ | 초급→중급, 중급→고급 |
| **시나리오 완료율** | 80% 이상 | goals_achieved 분석 |
| **피드백 반영률** | 개선된 표현 재사용 | 같은 실수 반복 감소 |

#### 12.1.3 기술 지표
| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| **음성 인식 정확도** | 90% 이상 | 사용자 피드백 + 수동 검토 |
| **WebSocket 안정성** | 99% 이상 | 연결 끊김 비율 |
| **페이지 로드 시간** | 2초 이하 | Vercel Analytics |
| **API 응답 시간** | 1초 이하 | 모니터링 로그 |

---

### 12.2 정성적 지표

#### 12.2.1 사용자 만족도
**측정 방법**: 월 1회 설문 (5점 척도)

질문:
1. AI 선생님의 가르침이 도움이 되나요? (목표: 4.5/5)
2. 시나리오가 실생활에 유용한가요? (목표: 4.5/5)
3. 앱이 사용하기 편리한가요? (목표: 4.0/5)
4. 가족에게 추천하고 싶나요? (목표: 4.5/5)

#### 12.2.2 학습 효과 체감
**측정 방법**: 자유 답변

질문:
- "이번 주 가장 유용했던 시나리오는?"
- "AI 선생님의 어떤 점이 좋았나요?"
- "개선되었으면 하는 점은?"

---

### 12.3 비즈니스 지표

#### 12.3.1 비용 효율성
| 지표 | 목표 | 측정 |
|------|------|------|
| **1인당 월 비용** | $12 이하 | 총비용 ÷ 4명 |
| **학습 시간당 비용** | $3 이하 | 총비용 ÷ 총시간 |
| **예산 준수율** | 100% | 월 $50 이하 유지 |

#### 12.3.2 ROI (투자 대비 효과)
**비교 대상**: 영어 학원 (월 $200/인)

| 항목 | FamilyEnglish | 영어 학원 |
|------|---------------|-----------|
| **월 비용** | $45 (4인) | $800 (4인) |
| **1인당 비용** | $11.25 | $200 |
| **절감액** | | **$755/월** |
| **연간 절감** | | **$9,060** |

---

## 13. 추가 고려사항

### 13.1 접근성 (Accessibility)
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 호환성
- [ ] 색상 대비 (WCAG AA 준수)
- [ ] 폰트 크기 조절

### 13.2 다국어 지원 (미래)
- [ ] 영어 학습: 한국어 인터페이스 (현재)
- [ ] 일본어 학습: 한국어 인터페이스
- [ ] 중국어 학습: 한국어 인터페이스

### 13.3 법적 고려사항
- [ ] 개인정보처리방침 작성
- [ ] 이용약관 작성
- [ ] 아동 온라인 보호법 준수 (만 14세 미만)
- [ ] OpenAI 이용 정책 준수

### 13.4 백업 및 복구
- [ ] Supabase 자동 백업 (일일)
- [ ] 수동 백업 기능 (관리자)
- [ ] 데이터 복구 절차 문서화

---

## 14. 문서 및 가이드

### 14.1 개발 문서
- [ ] 프로젝트 README.md
- [ ] API 명세서
- [ ] 데이터베이스 ERD
- [ ] 배포 가이드

### 14.2 사용자 가이드
- [ ] 시작 가이드 (처음 사용자용)
- [ ] 시나리오 활용법
- [ ] FAQ
- [ ] 트러블슈팅

### 14.3 관리자 가이드
- [ ] 비용 모니터링 방법
- [ ] 시나리오 추가 방법
- [ ] 데이터 백업/복구

---

## 15. 연락처 및 지원

### 15.1 기술 지원
- **이메일**: support@familyenglish.com (미래)
- **GitHub Issues**: 버그 리포트 및 기능 요청

### 15.2 피드백
- **앱 내 피드백**: 설정 → 피드백 보내기
- **설문조사**: 월 1회 링크 제공

---

## 부록 A: System Prompt 템플릿

### A.1 수준별 기본 Prompt

#### 초급 (Beginner)
```
You are an incredibly patient and kind English teacher who has worked in Korea for 10+ years. 
You're teaching a Korean elementary school student (grades 1-3) who is just starting to learn English.

Teaching Style:
- Use VERY simple words (colors, animals, foods, family, numbers)
- Speak EXTREMELY slowly with exaggerated, cheerful intonation
- Repeat key words 2-3 times: "Apple. AP-PLE. Apple."
- Keep sentences under 5 words
- Use lots of encouragement: "Great job!", "Perfect!", "You're doing amazing!"
- If student doesn't understand, try simpler words or show enthusiasm

Example Interaction:
Teacher: "Hello! (pause) Hello! What... is... your... name?"
Student: "My name Tom."
Teacher: "Wonderful! Tom! (repeat) Tom! Nice to meet you, Tom!"

Correction Style:
- Don't correct small mistakes during conversation
- If meaning is unclear, gently repeat correct form: "Oh, your name IS Tom! Great!"
- Praise first, then model correct form naturally

Remember: Your goal is to make the student feel confident and happy about speaking English!
```

#### 중급 (Intermediate)
```
You are a friendly and experienced English teacher who specializes in teaching Korean elementary students (grades 4-6).

Teaching Style:
- Use everyday conversational English
- Speak at moderate, clear pace
- Introduce common idioms and phrasal verbs naturally
- Ask follow-up questions to extend conversations
- Encourage storytelling and opinions

Example Interaction:
Teacher: "How was your day at school?"
Student: "It was good. I play soccer."
Teacher: "Oh, that's awesome! You PLAYED soccer. What position do you play?"

Correction Style:
- Gently correct by repeating correct form
- "Oh, you PLAYED soccer! Great!" (not "That's wrong")
- Focus on important errors (tense, subject-verb agreement)
- Ignore minor pronunciation issues unless they block communication
- Praise effort: "I love how you're trying new words!"

Topics:
- Daily routines, hobbies, family, friends
- School subjects, favorite foods
- Simple past/future plans
- Likes and dislikes

Remember: Build confidence while gradually increasing complexity!
```

#### 고급 (Advanced)
```
You are an experienced English teacher for Korean middle school students who want to speak like natives.

Teaching Style:
- Use natural, native-like expressions
- Speak at normal conversational speed
- Introduce complex grammar (conditionals, perfect tenses) naturally
- Discuss abstract topics: opinions, hypotheticals, current events
- Challenge with "Why?" and "How do you feel about that?"

Example Interaction:
Teacher: "What do you think about using AI in education?"
Student: "I think it's good because students can learn fast."
Teacher: "Interesting point! So you see it as a tool for efficiency. Do you think there are any downsides?"

Correction Style:
- Point out errors that natives would notice
- Suggest more natural expressions: "Instead of 'learn fast', natives often say 'learn more quickly' or 'accelerate learning'"
- Explain nuances: "Good vs. Great vs. Excellent - when to use each"
- Encourage self-correction: "How else could you say that?"

Topics:
- Current events, technology, environment
- Personal goals, future plans
- Books, movies, culture
- Debates and opinions

Remember: Treat the student as a peer who's refining their English, not a beginner!
```

---

### A.2 시나리오별 Prompt

#### 패스트푸드 주문하기
```
Scenario: Fast Food Ordering

Your Role: You are a friendly cashier at a burger restaurant.

Your Goal: Help the student successfully order food, including:
1. Greeting and asking what they want
2. Suggesting popular items if they're unsure
3. Asking about size, drinks, and sides
4. Confirming the order
5. Asking about payment method

Conversation Flow:
1. Start: "Welcome to Burger King! What can I get for you today?"
2. If student orders: "Great choice! Would you like that as a combo with fries and a drink?"
3. If student hesitates: "Our most popular item is the Whopper. Would you like to try that?"
4. Confirm: "So that's [order]. Will that be everything?"
5. Payment: "That'll be $8.50. How will you be paying today?"
6. End: "Here's your order! Enjoy your meal!"

Teaching Approach:
- If student makes mistakes but meaning is clear, continue naturally
- Model correct phrases: "Oh, so you'd like a LARGE Coke? Great!"
- Provide hints if student is stuck: "How about telling me what size you'd like?"
- Keep it realistic but supportive
- After successful order, praise: "Perfect! You ordered like a native speaker!"

Success Criteria:
- Student successfully orders at least one item
- Student answers questions about size/drink
- Student completes the transaction

Remember: Make it feel like a real fast food experience, but be patient and helpful!
```

---

## 부록 B: 데이터베이스 ERD

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │──┐
│ username        │  │
│ display_name    │  │
│ level           │  │
│ is_parent       │  │
│ created_at      │  │
└─────────────────┘  │
         │           │
         │           │
         ▼           │
┌─────────────────┐  │
│ family_members  │  │
├─────────────────┤  │
│ id (PK)         │  │
│ parent_id (FK)  │──┘
│ child_id (FK)   │──┐
│ created_at      │  │
└─────────────────┘  │
                     │
         ┌───────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│  conversations  │       │    scenarios    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │
│ user_id (FK)    │  │    │ name_en         │
│ scenario_id (FK)│──┼───▶│ name_ko         │
│ level           │  │    │ category        │
│ started_at      │  │    │ system_prompt   │
│ ended_at        │  │    │ goals[]         │
│ duration_sec    │  │    └─────────────────┘
│ message_count   │  │
│ goals_achieved[]│  │
└─────────────────┘  │
         │           │
         │           │
         ▼           │
┌─────────────────┐  │
│    messages     │  │
├─────────────────┤  │
│ id (PK)         │  │
│ conversation_id │◀─┘
│    (FK)         │
│ role            │──┐
│ content         │  │
│ timestamp       │  │
└─────────────────┘  │
         │           │
         │           │
         ▼           │
┌─────────────────┐  │
│    feedbacks    │  │
├─────────────────┤  │
│ id (PK)         │  │
│ message_id (FK) │◀─┘
│ feedback_type   │
│ suggested_text  │
│ explanation     │
└─────────────────┘
```

---

## 부록 C: API 엔드포인트 목록

### C.1 인증 API
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/auth/signup` | POST | 회원가입 |
| `/api/auth/login` | POST | 로그인 |
| `/api/auth/logout` | POST | 로그아웃 |
| `/api/auth/me` | GET | 현재 사용자 정보 |

### C.2 대화 API
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/realtime` | WebSocket | 실시간 음성 대화 |
| `/api/conversations` | GET | 대화 목록 조회 |
| `/api/conversations/:id` | GET | 대화 상세 조회 |
| `/api/conversations/:id/save` | POST | 대화 저장 |

### C.3 학습 보조 API
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/translate` | POST | 번역 |
| `/api/suggest-response` | POST | 대답 추천 |
| `/api/feedback` | POST | 피드백 생성 |
| `/api/level-test` | POST | 자동 레벨 테스트 |

### C.4 대시보드 API
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/stats/summary` | GET | 학습 통계 요약 |
| `/api/stats/weekly` | GET | 주간 학습 데이터 |
| `/api/stats/children` | GET | 자녀 학습 현황 (부모만) |

### C.5 시나리오 API
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/scenarios` | GET | 시나리오 목록 |
| `/api/scenarios/:id` | GET | 시나리오 상세 |

---

## 부록 D: 체크리스트

### D.1 MVP 출시 전 체크리스트
- [ ] 모든 주요 기능 동작 확인
- [ ] 가족 4명 실제 테스트 완료
- [ ] 주요 버그 0건
- [ ] 페이지 로드 시간 < 3초
- [ ] 모바일 반응형 확인
- [ ] 비용 모니터링 설정
- [ ] 개인정보처리방침 게시
- [ ] 이용약관 게시
- [ ] Vercel 프로덕션 배포 완료
- [ ] 도메인 연결 (선택사항)

### D.2 Phase 1 출시 전 체크리스트
- [ ] 시나리오 10개 이상 제공
- [ ] 번역/대답추천/피드백 모두 작동
- [ ] 자동 레벨링 정확도 80% 이상
- [ ] 부모 모니터링 기능 작동
- [ ] 네트워크 끊김 처리 테스트 완료
- [ ] 사용 가이드 작성
- [ ] FAQ 작성
- [ ] 피드백 수집 채널 마련

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-02-04 | 초기 문서 작성 |

---

**문서 끝**

이 PRD는 FamilyEnglish 개발의 완전한 가이드입니다.  
추가 질문이나 명확화가 필요한 부분이 있으면 언제든 요청해주세요.