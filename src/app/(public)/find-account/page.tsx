import { Metadata } from "next";
import FindAccountContainer from "./_components/FindAccountContainer";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "계정 찾기",
  description: "아이디 찾기 및 비밀번호 재설정",
};

export default function FindAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          로딩 중...
        </div>
      }
    >
      <FindAccountContainer />
    </Suspense>
  );
}
