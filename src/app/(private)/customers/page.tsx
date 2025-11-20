import { Metadata } from "next";
import { searchCustomers } from "@/apis/customerService";
import CustomerListContainer from "./_components/CustomerListContainer";

export const metadata: Metadata = {
  title: "고객 관리",
  description: "고객 정보 조회 및 관리",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    size?: string;
    tenant?: string;
    landlord?: string;
    buyer?: string;
    seller?: string;
    minPrice?: string;
    maxPrice?: string;
    minRent?: string;
    maxRent?: string;
    minDeposit?: string;
    maxDeposit?: string;
    labels?: string;
    telProvider?: string;
    region?: string;
    source?: string;
    noRole?: string;
  }>;
}

export default async function CustomerListPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q || "";
  const page = parseInt(params.page || "0");
  const size = parseInt(params.size || "10");

  const buildApiParams = (): Record<string, string | number | boolean> => {
    const apiParams: Record<string, string | number | boolean> = {
      page,
      size,
    };

    if (searchQuery) {
      apiParams.search = searchQuery;
    }

    if (params.tenant === "true") apiParams.tenant = true;
    if (params.landlord === "true") apiParams.landlord = true;
    if (params.buyer === "true") apiParams.buyer = true;
    if (params.seller === "true") apiParams.seller = true;
    if (params.minPrice) apiParams.minPrice = parseInt(params.minPrice);
    if (params.maxPrice) apiParams.maxPrice = parseInt(params.maxPrice);
    if (params.minRent) apiParams.minRent = parseInt(params.minRent);
    if (params.maxRent) apiParams.maxRent = parseInt(params.maxRent);
    if (params.minDeposit) apiParams.minDeposit = parseInt(params.minDeposit);
    if (params.maxDeposit) apiParams.maxDeposit = parseInt(params.maxDeposit);
    if (params.labels) apiParams.labelUids = params.labels;
    if (params.noRole === "true") apiParams.noRole = true;
    if (params.telProvider) apiParams.telProvider = params.telProvider;
    if (params.region) apiParams.regionCode = params.region;
    if (params.source) apiParams.trafficSource = params.source;

    return apiParams;
  };

  // 서버에서 데이터 페칭
  const apiParams = buildApiParams();
  const searchParamsObj = new URLSearchParams(
    apiParams as Record<string, string>
  );
  const { customers, totalCount } = await searchCustomers(searchParamsObj);

  return (
    <CustomerListContainer
      initialCustomers={customers}
      initialTotalCount={totalCount}
    />
  );
}
