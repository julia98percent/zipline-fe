import { Metadata } from "next";
import DashboardContainer from "./_components/DashboardContainer";

export const metadata: Metadata = {
  title: "대시보드",
  description: "부동산 중개 업무 현황 대시보드",
};

export default function DashboardPage() {
  return <DashboardContainer />;
}
