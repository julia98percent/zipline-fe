import { Metadata } from "next";
import {
  searchAgentProperties,
  AgentPropertySearchParams,
} from "@/apis/propertyService";
import { PropertyType, PropertyCategoryType } from "@/types/property";
import AgentPropertyListContainer from "./_components/AgentPropertyListContainer";

export const metadata: Metadata = {
  title: "개인 매물",
  description: "개인 매물 정보 조회 및 관리",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    category?: string;
    type?: string;
    legalDistrictCode?: string;
    minPrice?: string;
    maxPrice?: string;
    minDeposit?: string;
    maxDeposit?: string;
    minRent?: string;
    maxRent?: string;
    minNetArea?: string;
    maxNetArea?: string;
    minTotalArea?: string;
    maxTotalArea?: string;
    hasElevator?: string;
    petsAllowed?: string;
    sido?: string;
    gu?: string;
    dong?: string;
  }>;
}

export default async function AgentPropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || "0");
  const size = parseInt(params.size || "10");

  const apiParams: AgentPropertySearchParams = {
    page,
    size,
    sortFields: {},
    category: (params.category as PropertyCategoryType) || undefined,
    type: (params.type as PropertyType) || undefined,
    legalDistrictCode: params.legalDistrictCode || undefined,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    minDeposit: params.minDeposit ? parseInt(params.minDeposit) : undefined,
    maxDeposit: params.maxDeposit ? parseInt(params.maxDeposit) : undefined,
    minRent: params.minRent ? parseInt(params.minRent) : undefined,
    maxRent: params.maxRent ? parseInt(params.maxRent) : undefined,
    minNetArea: params.minNetArea ? parseInt(params.minNetArea) : undefined,
    maxNetArea: params.maxNetArea ? parseInt(params.maxNetArea) : undefined,
    minTotalArea: params.minTotalArea
      ? parseInt(params.minTotalArea)
      : undefined,
    maxTotalArea: params.maxTotalArea
      ? parseInt(params.maxTotalArea)
      : undefined,
    hasElevator:
      params.hasElevator !== undefined
        ? params.hasElevator === "true"
        : undefined,
    petsAllowed:
      params.petsAllowed !== undefined
        ? params.petsAllowed === "true"
        : undefined,
  };

  const response = await searchAgentProperties(apiParams);
  const propertyData = response.data?.agentProperty || [];
  const totalElements = response.data?.totalElements || 0;

  return (
    <AgentPropertyListContainer
      initialProperties={propertyData}
      initialTotalElements={totalElements}
    />
  );
}
