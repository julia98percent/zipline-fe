import { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { searchContracts } from "@apis/contractService";
import { Contract, ContractCategory } from "@ts/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import ContractListPageView from "./ContractListPageView";
import { DEFAULT_ROWS_PER_PAGE } from "@components/Table/Table";
import usePageFilters from "@hooks/usePageFilters";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

interface ContractFilters {
  selectedPeriod: string | null;
  selectedStatus: string;
  searchKeyword: string;
  selectedSort: string;
  page: number;
  rowsPerPage: number;
}

const CONTRACT_STORAGE_KEY = "contractFilters";

function ContractListPage() {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();

  const initialPageData: ContractFilters = {
    selectedPeriod: null,
    selectedStatus: "",
    searchKeyword: "",
    selectedSort: "LATEST",
    page: 0,
    rowsPerPage: DEFAULT_ROWS_PER_PAGE,
  };

  const { storedData, saveFilters } = usePageFilters<ContractFilters>(
    CONTRACT_STORAGE_KEY,
    initialPageData
  );

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
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(
    storedData.selectedPeriod
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    storedData.selectedStatus
  );
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>(
    storedData.searchKeyword
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    storedData.selectedSort
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(storedData.page);
  const [rowsPerPage, setRowsPerPage] = useState(storedData.rowsPerPage);
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

  useEffect(() => {
    const currentData = {
      selectedPeriod,
      selectedStatus,
      searchKeyword,
      selectedSort,
      page,
      rowsPerPage,
    };
    saveFilters(currentData);
  }, [
    selectedPeriod,
    selectedStatus,
    searchKeyword,
    selectedSort,
    page,
    rowsPerPage,
    saveFilters,
  ]);

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
    />
  );
}

export default ContractListPage;
