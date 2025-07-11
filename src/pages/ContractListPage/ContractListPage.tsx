import { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { searchContracts } from "@apis/contractService";
import { Contract, ContractCategory } from "@ts/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import ContractListPageView from "./ContractListPageView";
import { DEFAULT_ROWS_PER_PAGE } from "@components/Table/Table";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

function ContractListPage() {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const CONTRACT_STATUS_SEARCH_OPTIONS = [
    { value: "", label: "전체" },
    ...CONTRACT_STATUS_OPTION_LIST,
  ];

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
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("LATEST");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [totalElements, setTotalElements] = useState(0);

  const mappedCategory = categoryKeywordMap[searchKeyword] || "";
  const navigate = useNavigate();

  const fetchContractData = useCallback(async () => {
    setLoading(true);
    try {
      const { contracts, totalElements } = await searchContracts({
        category: mappedCategory,
        customerName: searchKeyword,
        address: searchKeyword,
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
    searchKeyword,
    selectedPeriod,
    selectedStatus,
    selectedSort,
    page,
    rowsPerPage,
  ]);

  // Event Handlers
  const handlePeriodClick = (label: string) => {
    const backendValue = periodMapping[label];
    setSelectedPeriod((prev) => (prev === backendValue ? null : backendValue));
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  const handleSearchKeywordChange = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleSearchSubmit = () => {
    fetchContractData();
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
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
    setSelectedPeriod(period || null);
    setSelectedStatus(status);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

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
      CONTRACT_STATUS_SEARCH_OPTIONS={CONTRACT_STATUS_SEARCH_OPTIONS}
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
    />
  );
}

export default ContractListPage;
