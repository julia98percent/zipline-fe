import { Metadata } from "next";
import MyPageContainer from "./_components/MyPageContainer";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "내 정보 및 설정 관리",
};

export const dynamic = "force-dynamic";

export default function MyPage() {
  return <MyPageContainer />;
}
