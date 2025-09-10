"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function GoHomeButton() {
  const router = useRouter();
  const handleGoHome = () => {
    router.push("/");
  };

  return <Button onClick={handleGoHome}>홈으로 돌아가기</Button>;
}