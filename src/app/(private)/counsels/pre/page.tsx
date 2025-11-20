import { Metadata } from "next";
import { fetchCounsels } from "@/apis/counselService";
import PreCounselListContainer from "./_components/PreCounselListContainer";

export const metadata: Metadata = {
  title: "사전 상담",
  description: "사전 상담 신청 내역 조회 및 관리",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
  }>;
}

export default async function PreCounselPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || "0");
  const size = parseInt(params.size || "10");

  const data = await fetchCounsels(page, size);

  return (
    <PreCounselListContainer
      initialCounsels={data?.surveyResponses || []}
      initialTotalElements={data?.totalElements || 0}
    />
  );
}
