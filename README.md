<div align="center">
<img src="https://github.com/user-attachments/assets/50dbf11f-ae88-4281-8267-5d63039c6148"  width="60%"/>
</div>

# 🏁 Getting Started

**ZIPLINE** 프로젝트를 로컬 환경에서 실행하기 위한 기본적인 가이드입니다.

### 1️⃣ 환경 변수 설정 (.env 파일)

프로젝트 실행에 필요한 환경 변수 파일이 필요합니다.
.env 파일은 보안상 Git에 포함되지 않아요! <br/>
폭신폭신 팀에 `.env` 파일을 요청한 후, 프로젝트 루트 경로에 위치시켜 주세요.

### 2️⃣ 패키지 설치

아래 명령어를 실행하여 필요한 의존성을 설치합니다:

```bash
npm install
```

### 3️⃣ 개발 서버 실행

개발 환경에서 프로젝트를 실행하려면 다음 명령어를 사용하세요:

```bash
npm run dev
```

### 4️⃣ 로컬 서버 접속

정상적으로 실행되었다면, 브라우저에서 아래 주소로 접속해 프로젝트를 확인할 수 있어요!:

```bash
http://localhost:5173
```

## 🪾 브랜치 전략

본 프로젝트는 다음과 같은 브랜치 전략을 따릅니다:

- `main` : 실제 배포되는 안정적인 코드가 포함된 브랜치입니다.
- `dev` : 개발 기능이 통합되는 브랜치입니다. `main`에 병합되기 전 테스트가 완료된 상태여야 합니다.
- `feature/{issue-number}` : 새로운 기능 개발 시 사용하는 브랜치입니다. `dev`에서 분기하여 작업 후 다시 `dev`로 PR을 보냅니다.

## 🚀 main 브랜치에 배포하는 방법

아래는 `main` 브랜치로 배포를 준비하는 절차입니다:

### 1️⃣ dev 브랜치로 이동합니다:

```bash
git checkout dev
```

### 2️⃣ 최신 커밋을 가져옵니다:

```bash
git pull origin dev
```

### 3️⃣ main 브랜치를 생성합니다:

```bash
git checkout -b main
```

| ❗ 이미 로컬에 `main` 브랜치가 있는 경우:

```bash
git branch -D main
```

| 실행 후 3️⃣번 다시 실행

### 4️⃣ main 브랜치를 원격 저장소에 푸시합니다:

```bash
git push origin main
```

| ⚠️ 주의: `main` 브랜치에 푸시하기 전에 테스트가 완료되었는지, PR이나 리뷰 프로세스를 거쳤는지 반드시 확인해주세요.
