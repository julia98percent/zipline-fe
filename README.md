# ZIPLINE - 고객/계약 데이터 통합 관리 CRM 서비스

| 기존 분산되어 있던 데이터를 한곳에 모아 관리 효율성을 높인 공인중개사용 백오피스 서비스입니다.
| 프론트엔드 주도로 성능 최적화 및 사용자 경험 개선을 이뤄냈습니다.

## ⚒️ 기술 스택

- Framework: React, TypeScript
- Build Tool: Vite
  - CRA 대비 빌드 속도 최적화를 위해 도입
- State Management: Zustand
  - Redux 대비 보일러플레이트를 줄이고 직관적인 전역 상태 관리를 위해 선택
- Styling: Tailwind CSS
  - 빠른 UI 구현 및 디자인 시스템 일관성 유지
- Deploy: Vercel, GitHub Actions

## 👩‍💻 기술적 성과

### Cursor 기반 무한 스크롤 페이지네이션

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

## 🎨 색상 시스템

프로젝트의 모든 색상은 중앙에서 관리됩니다:

- **색상 정의**: `/src/constants/colors.ts` - TypeScript 상수로 정의
- **Tailwind 설정**: `/src/app/globals.css` - CSS 변수로 정의
- **사용 가이드**: `/COLOR_GUIDE.md` - 자세한 사용법 참조

### 색상 사용 예시

```tsx
// TypeScript 상수 사용
import { PRIMARY, CONTRACT_TYPES } from "@/constants/colors";
<Box sx={{ backgroundColor: PRIMARY.main }}>

// Tailwind CSS 클래스 사용
<div className="bg-primary text-white">

// CSS 변수 사용
<Box sx={{ color: "var(--color-primary)" }}>
```

자세한 내용은 [COLOR_GUIDE.md](./COLOR_GUIDE.md)를 참조하세요.

## 🧱 폴더 구조

```
.
├── public/                 # 정적 리소스 (메인 로고, 아이콘, 소개용 이미지 등)
├── src/
│   ├── apis/              # 도메인별 API 클라이언트
│   ├── app/               # Next.js App Router (페이지 & 레이아웃)
│   ├── components/        # 공용 UI 컴포넌트 & 레이아웃
│   ├── constants/         # 도메인별 상수/메시지 (colors.ts 포함)
│   ├── context/           # 전역 Context (SSE 등)
│   ├── hooks/             # 재사용 가능한 커스텀 훅
│   ├── stores/            # 전역 상태(Zustand 등)
│   ├── types/             # 도메인 타입 정의
│   └── utils/             # 비즈니스 무관 유틸 함수
└── config/ts/postcss/...  # 설정 파일들
```

## 🙏 협업 전략

- Git Flow: Main(배포) <- Dev(개발) <- Feature(기능) 전략 사용
- Convention:
  - Commit Message: feat:, fix:, refactor: 등의 Conventional Commits 준수
  - ESLint & Prettier를 통한 코드 스타일 통일
