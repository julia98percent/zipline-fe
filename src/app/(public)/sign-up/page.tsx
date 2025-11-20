import { Metadata } from "next";
import SignUpContainer from "./_components/SignUpContainer";

export const metadata: Metadata = {
  title: "회원가입",
  description: "Zipline 부동산 중개 관리 플랫폼 회원가입",
};

export default function SignUpPage() {
  return <SignUpContainer />;
}
