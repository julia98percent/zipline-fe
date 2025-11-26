import { Metadata } from "next";
import PublicPropertyListContainer from "./_components/PublicPropertyListContainer";

export const metadata: Metadata = {
  title: "공개 매물",
  description: "공개 매물 정보 조회",
};

export default function PublicPropertyListPage() {
  return <PublicPropertyListContainer />;
}
