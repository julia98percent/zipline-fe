"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Contract, ContractCategory } from "@/types/contract";
import ContractListView from "./ContractListView";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { useContracts } from "@/queries/useContracts";

export const EXPIRED_PERIOD = ["6개월 이내", "3개월 이내", "1개월 이내"];

interface ContractListContainerProps {
  initialContracts: Contract[];
  initialTotalElements: number;
}

function ContractListContainer({
  initialContracts,
  initialTotalElements,
}: ContractListContainerProps) {
  const { page, rowsPerPage, setPage, setRowsPerPage } = useUrlPagination();
  const { getParam, setParam, setParams, clearAllFilters } = useUrlFilters();

  const categoryKeywordMap: Record<string, string> = {
    매매: ContractCategory.SALE,
    전세: ContractCategory.DEPOSIT,
    월세: ContractCategory.MONTHLY,
  };

  const sortOptions = [
    { value: "LATEST", label: "최신순" },
    { value: "OLDEST", label: "오래된순" },
    { value: "EXPIRING", label: "만료임박순" },
  ];

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchQuery = getParam("q") || "";

  const selectedPeriod = getParam("period") || null;
  const selectedStatus = getParam("status") || "";
  const selectedSort = getParam("sort") || "LATEST";

  const mappedCategory = categoryKeywordMap[searchQuery] || "";
  const router = useRouter();

  const { data, isLoading: loading, refetch: fetchContractData } = useContracts({
    mappedCategory,
    searchQuery,
    selectedPeriod,
    selectedStatus,
    selectedSort,
    page,
    rowsPerPage,
    initialContracts,
    initialTotalElements,
    onFilterModalClose: () => setFilterModalOpen(false),
  });

  const contractList = data?.contracts || [];
  const totalElements = data?.totalElements || 0;

  const handlePeriodClick = (label: string) => {
    const newValue = selectedPeriod === label ? null : label;
    setParam("period", newValue || "");
  };

  const handleSortChange = (value: string) => {
    setParam("sort", value);
  };

  const handleSearchKeywordChange = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleSearchSubmit = () => {
    setParam("q", searchKeyword);
  };

  const handleStatusChange = (status: string) => {
    setParam("status", status);
  };

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  const handleRowClick = (contract: Contract) => {
    router.push(`/contracts/${contract.uid}`);
  };

  const handleFilterModalClose = () => {
    setFilterModalOpen(false);
  };

  const handleFilterApply = ({
    period,
    status,
  }: {
    period: string;
    status: string;
  }) => {
    setParams({
      period: period || null,
      status: status || null,
    });
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  useEffect(() => {
    setSearchKeyword(searchQuery);
  }, [searchQuery]);

  return (
    <ContractListView
      loading={loading}
      contractList={contractList}
      selectedPeriod={selectedPeriod}
      selectedStatus={selectedStatus}
      filterModalOpen={filterModalOpen}
      searchKeyword={searchKeyword}
      selectedSort={selectedSort}
      isAddModalOpen={isAddModalOpen}
      page={page}
      rowsPerPage={rowsPerPage}
      totalElements={totalElements}
      EXPIRED_PERIOD={EXPIRED_PERIOD}
      sortOptions={sortOptions}
      onSortChange={handleSortChange}
      onSearchKeywordChange={handleSearchKeywordChange}
      onSearchSubmit={handleSearchSubmit}
      onStatusChange={handleStatusChange}
      onPeriodClick={handlePeriodClick}
      onAddModalOpen={handleAddModalOpen}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onRowClick={handleRowClick}
      onFilterModalClose={handleFilterModalClose}
      onFilterApply={handleFilterApply}
      onAddModalClose={handleAddModalClose}
      onRefreshData={fetchContractData}
      handleClearFilters={clearAllFilters}
    />
  );
}

export default ContractListContainer;
