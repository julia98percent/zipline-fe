import { Metadata } from "next";
import SignInContainer from "./_components/SignInContainer";

export const metadata: Metadata = {
  title: "로그인",
  description: "Zipline 부동산 중개 관리 플랫폼에 로그인하세요",
};

export default function SignInPage() {
  return <SignInContainer />;
}
