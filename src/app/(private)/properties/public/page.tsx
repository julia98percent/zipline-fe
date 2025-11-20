import { Metadata } from "next";
import { getPublicProperties } from "@/apis/propertyService";
import { PublicPropertySearchParams } from "@/types/property";
import PublicPropertyListContainer from "./_components/PublicPropertyListContainer";

export const metadata: Metadata = {
  title: "공개 매물",
  description: "공개 매물 정보 조회",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    size?: string;
    sortField?: string;
    isAscending?: string;
    category?: string;
    buildingType?: string;
    buildingName?: string;
    address?: string;
    minPrice?: string;
    maxPrice?: string;
    minDeposit?: string;
    maxDeposit?: string;
    minMonthlyRent?: string;
    maxMonthlyRent?: string;
    minNetArea?: string;
    maxNetArea?: string;
    minTotalArea?: string;
    maxTotalArea?: string;
    regionCode?: string;
    selectedSido?: string;
    selectedGu?: string;
    selectedDong?: string;
  }>;
}

export default async function PublicPropertyListPage({
  searchParams,
}: PageProps) {
  // searchParams를 await로 받기 (Next.js 15+)
  const params = await searchParams;

  const size = parseInt(params.size || "10");

  // API 파라미터 구성
  const apiParams: PublicPropertySearchParams = {
    size,
    sortField: params.sortField || "id",
    isAscending: params.isAscending !== "false",
    category: params.category || undefined,
    buildingType: params.buildingType || undefined,
    buildingName: params.buildingName || undefined,
    address: params.address || undefined,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    minDeposit: params.minDeposit ? parseInt(params.minDeposit) : undefined,
    maxDeposit: params.maxDeposit ? parseInt(params.maxDeposit) : undefined,
    minMonthlyRent: params.minMonthlyRent
      ? parseInt(params.minMonthlyRent)
      : undefined,
    maxMonthlyRent: params.maxMonthlyRent
      ? parseInt(params.maxMonthlyRent)
      : undefined,
    minNetArea: params.minNetArea ? parseInt(params.minNetArea) : undefined,
    maxNetArea: params.maxNetArea ? parseInt(params.maxNetArea) : undefined,
    minTotalArea: params.minTotalArea
      ? parseInt(params.minTotalArea)
      : undefined,
    maxTotalArea: params.maxTotalArea
      ? parseInt(params.maxTotalArea)
      : undefined,
    regionCode: params.regionCode || undefined,
  };

  const response = await getPublicProperties(apiParams);
  const contentArray = Array.isArray(response.content) ? response.content : [];

  return (
    <PublicPropertyListContainer
      initialProperties={contentArray}
      initialHasNext={response.hasNext}
      initialCursorId={response.nextCursorId || null}
    />
  );
}
