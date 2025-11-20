import { Metadata } from "next";
import AppreciatePageContainer from "./_components/AppreciatePageContainer";

export const metadata: Metadata = {
  title: "신청 완료",
  description: "사전 상담 신청이 완료되었습니다",
};

export default function AppreciatePage() {
  return <AppreciatePageContainer />;
}
