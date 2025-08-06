import { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { searchContracts } from "@apis/contractService";
import { Contract, ContractCategory } from "@ts/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import ContractListPageView from "./ContractListPageView";
import { useUrlPagination } from "@hooks/useUrlPagination";
import { useUrlFilters } from "@hooks/useUrlFilters";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

function ContractListPage() {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { page, rowsPerPage, setPage, setRowsPerPage } = useUrlPagination();
  const { getParam, setParam, setParams, clearAllFilters } = useUrlFilters();

  const periodMapping: Record<string, string> = {
    "6개월 이내 만료 예정": "6개월 이내",
    "3개월 이내 만료 예정": "3개월 이내",
    "1개월 이내 만료 예정": "1개월 이내",
  };

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

  // State
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState("");
  const searchQuery = getParam("q") || "";

  const selectedPeriod = getParam("period") || null;
  const selectedStatus = getParam("status") || "";
  const selectedSort = getParam("sort") || "LATEST";

  const mappedCategory = categoryKeywordMap[searchQuery] || "";
  const navigate = useNavigate();

  const fetchContractData = useCallback(async () => {
    setLoading(true);
    try {
      const { contracts, totalElements } = await searchContracts({
        category: mappedCategory,
        customerName: searchQuery,
        address: searchQuery,
        period: selectedPeriod || "",
        status: selectedStatus,
        sort: selectedSort,
        page: page + 1,
        size: rowsPerPage,
      });

      setContractList(contracts);
      setTotalElements(totalElements);
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
      setContractList([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
      setFilterModalOpen(false);
    }
  }, [
    mappedCategory,
    searchQuery,
    selectedPeriod,
    selectedStatus,
    selectedSort,
    page,
    rowsPerPage,
  ]);

  // Event Handlers
  const handlePeriodClick = (label: string) => {
    const backendValue = periodMapping[label];
    const newValue = selectedPeriod === backendValue ? null : backendValue;
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
    navigate(`/contracts/${contract.uid}`);
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

  // Effects
  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  return (
    <ContractListPageView
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
      CONTRACT_STATUS_OPTION_LIST={CONTRACT_STATUS_OPTION_LIST}
      periodMapping={periodMapping}
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
      onMobileMenuToggle={onMobileMenuToggle}
      handleClearFilters={clearAllFilters}
    />
  );
}

export default ContractListPage;
