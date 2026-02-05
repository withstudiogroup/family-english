# Claude Code Rules

## 🎯 작업 프로세스

### Tasks 기반 작업 관리
**간단한 수정 외 모든 작업은 tasks.md 작성 → 사용자 확인 → 진행**

1. **Tasks 작성**: 복잡한 작업은 `tasks.md`에 단계별로 정리
2. **사용자 확인**: Tasks 내용 확인 후 진행 여부 결정
3. **서브에이전트 활용**: `/frontend`, `/backend` 등 상황에 맞는 서브에이전트 적극 활용
4. **중앙 관리**: 중앙 에이전트는 관리/감독 역할만 수행
5. **진행 업데이트**: Tasks 작업 중 중간 진행사항 지속 업데이트

**예시**:
```
사용자: "쿠폰 발행 기능 추가해줘"
Claude: tasks.md 작성 → 사용자 확인 요청 → 승인 후 서브에이전트로 단계별 진행
```

## ⚠️ 최우선 규칙

### 1. Claude Code 세션 유지
**절대 Claude Code를 종료하지 말 것!**
- KillShell 도구 사용 금지
- "서버를 종료하고" 같은 말 후 작업 중단 금지
- 작업 중간에 세션 종료 금지
- 문제 발생 시 사용자에게 수동 조치 요청

### 2. SQLite 작업
**모든 DB 작업 전 실제 스키마/데이터 확인 필수 - 추측 금지!**
```bash
sqlite3 nol-report.db ".schema 테이블명"
sqlite3 nol-report.db "SELECT * FROM 테이블명 LIMIT 5;"
```
- 실제 필드명 그대로 사용 (한글 필드명 주의)
- 데이터 타입 확인 후 처리

## 핵심 원칙
- **한국어 사용** (모든 커밋/문서/대화)
- **정확성 > 속도** (검증 후 작업)
- **즉시 커밋, 즉시 삭제** (사용 안 하는 코드는 바로 제거)
- **주석 없는 깔끔한 코드** (변수명으로 의도 표현)

### 3. 근본적인 해결 원칙
**증상만 가리는 임시 해결 금지!**
- 에러 발생 시 방어 코드로 증상만 숨기지 말 것
- 데이터가 undefined인 원인을 추적하여 근본 원인 해결
- 예시 (금지):
  ```typescript
  // ❌ 나쁜 예: 증상만 가리는 방어 코드
  const validStatus = status && STATUS_CONFIG[status] ? status : 'neutral';
  ```
- 예시 (권장):
  ```typescript
  // ✅ 좋은 예: 서버에서 올바른 데이터를 반환하도록 수정
  // 서버: status 필드를 비즈니스 로직으로 계산하여 반환
  // 클라이언트: 타입을 실제 데이터 구조에 맞게 수정
  ```
- **원칙**: 당장의 해결보다 장기적인 유지보수를 고려

## 현재 프로젝트 상태
- Redash → Databricks 전환 완료
- JSON → SQLite 마이그레이션 진행 중
- 서버 재시작: `C:\nolreport_v1\start-dev-3005.bat`

## Git 커밋 규칙
```
feat: 새 기능
fix: 버그 수정
refactor: 코드 개선
remove: 파일 삭제
```
기능 완료 즉시 커밋 (주석 처리나 백업 폴더 생성 금지)

## 프로젝트 구조
```
src/
├── components/   # 재사용 컴포넌트
├── pages/       # 페이지
├── services/    # API 통신
└── utils/       # 유틸리티
```

## 코딩 규칙
- TypeScript: `any` 금지, 명시적 타입
- React: 함수형 컴포넌트 + Hooks
- 네이밍: 컴포넌트(PascalCase), 훅(useXxx), 상수(UPPER_CASE)
- 한국 시간: `toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})`

## Node 프로세스 관리
**Kill Bash 사용 금지** (Claude Code 종료됨)
- 포트 확인: `netstat -ano | findstr :3000`
- 안전 종료: 터미널에서 Ctrl+C

## AI 활용
- 10분 이상 막히면 즉시 슈퍼클로드 활용
- 반복 작업은 서브에이전트 위임