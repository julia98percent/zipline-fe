import { Metadata } from "next";
import { searchContracts } from "@/apis/contractService";
import { ContractCategory } from "@/types/contract";
import ContractListContainer from "./_components/ContractListContainer";

export const metadata: Metadata = {
  title: "계약 관리",
  description: "계약 목록 조회 및 관리",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    period?: string;
    status?: string;
    sort?: string;
    page?: string;
    size?: string;
  }>;
}

export default async function ContractListPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q || "";
  const selectedPeriod = params.period || "";
  const selectedStatus = params.status || "";
  const selectedSort = params.sort || "LATEST";
  const page = parseInt(params.page || "0");
  const size = parseInt(params.size || "10");

  const categoryKeywordMap: Record<string, string> = {
    매매: ContractCategory.SALE,
    전세: ContractCategory.DEPOSIT,
    월세: ContractCategory.MONTHLY,
  };
  const mappedCategory = categoryKeywordMap[searchQuery] || "";

  const { contracts, totalElements } = await searchContracts({
    category: mappedCategory,
    customerName: searchQuery,
    address: searchQuery,
    period: selectedPeriod,
    status: selectedStatus,
    sort: selectedSort,
    page,
    size,
  });

  return (
    <ContractListContainer
      initialContracts={contracts}
      initialTotalElements={totalElements}
    />
  );
}
