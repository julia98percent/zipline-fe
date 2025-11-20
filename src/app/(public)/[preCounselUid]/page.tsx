import { Metadata } from "next";
import SubmitPreCounselContainer from "./_components/SubmitPreCounselContainer";

export const metadata: Metadata = {
  title: "사전 상담 신청",
  description: "부동산 사전 상담을 신청하세요",
};

export default function SubmitPreCounselPage() {
  return <SubmitPreCounselContainer />;
}
