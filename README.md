# ZIPLINE - 고객/계약 데이터 통합 관리 CRM 서비스

<img width="1465" height="796" alt="Screenshot 2025-11-27 at 10 33 20 AM" src="https://github.com/user-attachments/assets/44eb1710-d1a4-41a3-9475-665e0d218eb9" />

<br/>

## ⚒️ 기술 스택

- **Framework**: Next.js 15 + React 19 + TypeScript
  - App Router를 활용한 서버/클라이언트 컴포넌트 분리
- **Data Fetching**: TanStack Query (React Query) v5
  - Prefetch를 활용한 데이터 로딩 최적화
- **State Management**: Zustand
  - Redux 대비 보일러플레이트를 줄이고 직관적인 전역 상태 관리
- **Styling**: Tailwind CSS v4.0 + Material-UI (MUI)
  - CSS Cascade Layers로 스타일 우선순위 관리
  - 중앙 집중식 디자인 토큰 시스템
- **Deploy**: Vercel, GitHub Actions

## 👩‍💻 기술적 성과

### Cursor 기반 무한 스크롤 페이지네이션

![무한 스크롤 페이지네이션 GIF](https://github.com/user-attachments/assets/4c349711-b3ed-4efb-b963-144c02f5363a)

- Challenge: 대량의 공개 매물 데이터를 오프셋(Offset) 방식으로 처리할 때 발생하는 성능 저하 및 데이터 중복/누락 발생
- Solution: 백엔드의 Cursor 기반 API와 Intersection Observer를 결합하여 무한 스크롤 구현
  - cursorId를 상태로 관리하며 다음 페이지 데이터를 순차적으로 로드
  - 필터 및 정렬 조건 변경 시 자동으로 cursorId 초기화하여 데이터 일관성 유지
  - URL 쿼리 파라미터와 필터/정렬 상태를 동기화하여 페이지 새로고침 시에도 사용자가 설정한 검색 조건 유지
  - 스크롤 끝에서 100px 전에 자동으로 다음 데이터를 미리 로드하여 매끄러운 사용자 경험 제공
- Result:
  - 페이지 전환 없이 연속적인 데이터 탐색 가능
  - 중복 로딩 방지 로직으로 불필요한 API 호출 제거
  - 검색 조건 유지로 사용자 편의성 향상

### Server-Sent Events (SSE) 기반 실시간 알림 시스템

- Challenge: 계약 만료, 상담 일정 등의 중요 알림을 실시간으로 사용자에게 전달해야 하는 요구사항
- Solution: SSE(Server-Sent Events)를 활용한 단방향 실시간 통신 구현
  - Microsoft의 `@microsoft/fetch-event-source` 라이브러리로 안정적인 연결 관리
  - React Context로 전역 알림 상태 관리 및 컴포넌트 간 공유
- Result:
  - 폴링 방식 대비 서버 부하 감소 및 실시간성 향상
  - 네트워크 불안정 환경에서도 안정적인 알림 수신
  - 사용자가 별도 새로고침 없이 최신 알림 확인 가능

### React Query Prefetch 전략으로 초기 로딩 최적화

- Challenge: 로그인 후 대시보드 페이지 진입 시 여러 API를 순차적으로 호출하면서 발생하는 로딩 지연
- Solution: 로그인 성공 직후 대시보드에 필요한 데이터를 미리 병렬로 로드
  ```typescript
  // 7개 API를 Promise.all로 병렬 호출
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ["dashboardStatistics"], ... }),
    queryClient.prefetchQuery({ queryKey: ["schedules"], ... }),
    queryClient.prefetchQuery({ queryKey: ["surveyResponses"], ... }),
    queryClient.prefetchQuery({ queryKey: ["counsels", "DUE_DATE"], ... }),
    queryClient.prefetchQuery({ queryKey: ["counsels", "LATEST"], ... }),
    queryClient.prefetchQuery({ queryKey: ["contracts", "expiring"], ... }),
    queryClient.prefetchQuery({ queryKey: ["contracts", "recent"], ... }),
  ]);
  ```
  - React Query의 캐싱 메커니즘으로 prefetch된 데이터를 즉시 사용
  - 캐싱 전략 적용 (staleTime: 1분)
  - Prefetch 실패 시에도 페이지 전환은 정상 진행 (UX 우선)
- Result:
  - 대시보드 진입 시 빈 화면 노출 시간 최소화
  - 사용자가 로그인 직후 바로 데이터를 확인 가능
  - 네트워크 요청 병렬화로 전체 로딩 시간 단축

### 미들웨어 기반 인증 및 보안 시스템

- Challenge: 비인증 사용자의 보호된 페이지 접근 방지 및 CSRF 공격 방어
- Solution: Next.js 미들웨어와 Axios Interceptor를 활용한 다층 보안 구조
  - **미들웨어 레벨**: Route Groups를 활용한 공개/비공개 라우트 자동 분리
    - `(public)`: 로그인, 회원가입 등 인증 불필요 페이지
    - `(private)`: 대시보드, 고객관리 등 인증 필요 페이지
    - 비인증 사용자가 private 라우트 접근 시 자동으로 로그인 페이지로 리다이렉트
  - **API 클라이언트 레벨**: 서버/클라이언트 환경 분기 처리
    - 서버 사이드: 쿠키를 명시적으로 헤더에 추가하여 인증 정보 전달
    - 클라이언트 사이드: CSRF 토큰 자동 관리 및 요청 시 헤더에 추가
  - **에러 처리**: 401/403 응답 시 자동으로 세션 만료 처리 및 로그인 페이지 이동
- Result:
  - 인증되지 않은 사용자의 민감한 데이터 접근 원천 차단
  - CSRF 공격 방어로 보안성 강화
  - 서버/클라이언트 환경에서 일관된 인증 동작 보장

## 🧱 폴더 구조

```
.
├── public/                 # 정적 리소스 (메인 로고, 아이콘, 소개용 이미지 등)
├── src/
│   ├── apis/              # 도메인별 API 서비스 레이어
│   │   ├── apiClient.ts   # Axios 인스턴스 (인터셉터, CSRF 관리)
│   │   ├── contractService.ts
│   │   ├── customerService.ts
│   │   └── ...            # 도메인별 API 함수
│   ├── app/               # Next.js App Router
│   │   ├── (public)/      # 인증 불필요 라우트
│   │   ├── (private)/     # 인증 필요 라우트
│   │   └── providers.tsx  # React Query, Theme 등 Provider
│   ├── components/        # 재사용 가능한 UI 컴포넌트
│   ├── constants/         # 상수 (colors.ts, 에러 메시지 등)
│   ├── context/           # React Context (SSEContext 등)
│   ├── hooks/             # 커스텀 훅 (20+개)
│   │   ├── useUrlPagination.ts
│   │   ├── useDebounce.ts
│   │   └── ...
│   ├── queries/           # React Query 훅 (useCustomers, useContracts 등)
│   ├── stores/            # Zustand 전역 상태 (useAuthStore 등)
│   ├── types/             # TypeScript 타입 정의 (도메인별)
│   └── utils/             # 유틸리티 함수
├── middleware.ts          # Next.js 미들웨어 (인증 체크)
└── config files           # next.config.ts, tsconfig.json 등
```

## 🙏 협업 전략

- Git Flow: Main(배포) <- Dev(개발) <- Feature(기능) 전략 사용
- Convention:
  - Commit Message: feat:, fix:, refactor: 등의 Conventional Commits 준수
  - ESLint & Prettier를 통한 코드 스타일 통일

---

# 🏁 Getting Started

**ZIPLINE** 프로젝트를 로컬 환경에서 실행하기 위한 기본적인 가이드입니다.

### 1️⃣ 환경 변수 설정

프로젝트 실행에 필요한 환경 변수 파일이 필요합니다.
`.env.example` 파일을 복사한 뒤 해당 파일의 이름을 `.env.local`로 바꿔주세요.<br/>

### 2️⃣ 패키지 설치

아래 명령어를 실행하여 필요한 의존성을 설치합니다:

```bash
yarn install
```

### 3️⃣ 개발 서버 실행

개발 환경에서 프로젝트를 실행하려면 다음 명령어를 사용하세요:

```bash
yarn run dev
```

### 4️⃣ 로컬 서버 접속

정상적으로 실행되었다면, 브라우저에서 아래 주소로 접속해 프로젝트를 확인할 수 있어요:

```bash
http://localhost:5173
```
