import { Metadata } from "next";
import dayjs from "dayjs";
import { fetchCounselList } from "@/apis/counselService";
import CounselListContainer from "./_components/CounselListContainer";

export const metadata: Metadata = {
  title: "일반 상담",
  description: "일반 상담 내역 조회 및 관리",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    size?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    completed?: string;
  }>;
}

export default async function GeneralCounselsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q || "";
  const page = parseInt(params.page || "0");
  const size = parseInt(params.size || "10");
  const startDate = params.startDate ? dayjs(params.startDate) : undefined;
  const endDate = params.endDate ? dayjs(params.endDate) : undefined;
  const selectedType = params.type || undefined;
  const selectedCompleted =
    params.completed !== undefined ? params.completed === "true" : undefined;

  const { counsels, totalElements } = await fetchCounselList({
    page,
    size,
    search: searchQuery || undefined,
    startDate,
    endDate,
    type: selectedType,
    completed: selectedCompleted,
  });

  return (
    <CounselListContainer
      initialCounsels={counsels}
      initialTotalElements={totalElements}
    />
  );
}
