import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import usePageFilters from "@hooks/usePageFilters";
import { Customer, CustomerFilter } from "@ts/customer";
import { searchCustomers, updateCustomer } from "@apis/customerService";
import { showToast } from "@components/Toast/Toast";
import CustomerListPageView from "./CustomerListPageView";
import { DEFAULT_ROWS_PER_PAGE } from "@components/Table/Table";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

const INITIAL_FILTERS: CustomerFilter = {
  tenant: false,
  landlord: false,
  buyer: false,
  seller: false,
  minPrice: null,
  maxPrice: null,
  minRent: null,
  maxRent: null,
  minDeposit: null,
  maxDeposit: null,
  labelUids: [],
  telProvider: "",
  preferredRegion: "",
  trafficSource: "",
  noRole: false,
};

const CUSTOMER_STORAGE_KEY = "customerFilters";

const CustomerListPage = () => {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();

  const initialPageData = {
    page: 0,
    rowsPerPage: DEFAULT_ROWS_PER_PAGE,
    searchTerm: "",
    searchQuery: "",
    filters: INITIAL_FILTERS,
  };

  const { storedData, saveFilters } = usePageFilters(
    CUSTOMER_STORAGE_KEY,
    initialPageData
  );

  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(storedData.page);
  const [rowsPerPage, setRowsPerPage] = useState(storedData.rowsPerPage);
  const [searchTerm, setSearchTerm] = useState(storedData.searchTerm);
  const [searchQuery, setSearchQuery] = useState(storedData.searchQuery);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<CustomerFilter>(storedData.filters);

  const fetchCustomerList = useCallback(
    async (reset = true) => {
      const buildApiParams = (): Record<string, string | number | boolean> => {
        const params: Record<string, string | number | boolean> = {
          page: page + 1,
          pageSize: rowsPerPage,
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (filters.tenant) params.tenant = true;
        if (filters.landlord) params.landlord = true;
        if (filters.buyer) params.buyer = true;
        if (filters.seller) params.seller = true;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.minRent) params.minRent = filters.minRent;
        if (filters.maxRent) params.maxRent = filters.maxRent;
        if (filters.minDeposit) params.minDeposit = filters.minDeposit;
        if (filters.maxDeposit) params.maxDeposit = filters.maxDeposit;
        if (filters.labelUids && filters.labelUids.length > 0)
          params.labelUids = filters.labelUids.join(",");
        if (filters.noRole) {
          params.noRole = true;
        }
        if (filters.telProvider) params.telProvider = filters.telProvider;
        if (filters.preferredRegion)
          params.regionCode = filters.preferredRegion;
        if (filters.trafficSource) params.trafficSource = filters.trafficSource;

        return params;
      };

      try {
        setLoading(true);
        if (reset) {
          setPage(0);
        }

        const params = buildApiParams();
        const searchParams = new URLSearchParams(
          params as Record<string, string>
        );
        const response = await searchCustomers(searchParams);

        setCustomerList(response.customers);
        setTotalCount(response.totalCount);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, searchQuery, filters]
  );

  const handleCustomerUpdate = async (updatedCustomer: Customer) => {
    try {
      await updateCustomer(updatedCustomer.uid, {
        name: updatedCustomer.name,
        phoneNo: updatedCustomer.phoneNo,
        tenant: updatedCustomer.tenant,
        landlord: updatedCustomer.landlord,
        buyer: updatedCustomer.buyer,
        seller: updatedCustomer.seller,
        labelUids: (updatedCustomer.labels || []).map((label) => label.uid),
        trafficSource: updatedCustomer.trafficSource,
        birthday: updatedCustomer.birthday,
        preferredRegion: updatedCustomer.preferredRegion,
        minPrice: updatedCustomer.minPrice,
        maxPrice: updatedCustomer.maxPrice,
        minDeposit: updatedCustomer.minDeposit,
        maxDeposit: updatedCustomer.maxDeposit,
        minRent: updatedCustomer.minRent,
        maxRent: updatedCustomer.maxRent,
        telProvider: updatedCustomer.telProvider,
      });

      setCustomerList((prev) =>
        prev.map((customer) =>
          customer.uid === updatedCustomer.uid ? updatedCustomer : customer
        )
      );

      showToast({
        message: "고객 정보가 성공적으로 수정되었습니다.",
        type: "success",
      });
    } catch (error) {
      showToast({
        message: "고객 정보 수정에 실패했습니다.",
        type: "error",
      });
      throw error;
    }
  };

  const handleFiltersChange = useCallback((newFilters: CustomerFilter) => {
    setFilters(newFilters);
  }, []);

  const handleFilterApply = useCallback((appliedFilters: CustomerFilter) => {
    setFilters(appliedFilters);
    setFilterModalOpen(false);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setSearchQuery(searchTerm);
    setPage(0);
  }, [searchTerm]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  const handleFilterModalOpen = useCallback(() => setFilterModalOpen(true), []);
  const handleFilterModalClose = useCallback(
    () => setFilterModalOpen(false),
    []
  );
  const handleRefresh = useCallback(
    () => fetchCustomerList(false),
    [fetchCustomerList]
  );
  const handleCustomerCreate = useCallback(
    () => fetchCustomerList(true),
    [fetchCustomerList]
  );

  const handleFilterReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm("");
    setSearchQuery("");
    setPage(0);
  }, []);

  useEffect(() => {
    const currentData = {
      page,
      rowsPerPage,
      searchTerm,
      searchQuery,
      filters,
    };
    saveFilters(currentData);
  }, [page, rowsPerPage, searchTerm, searchQuery, filters, saveFilters]);

  // 컴포넌트 마운트 시 초기 로드, searchQuery 변경 시 검색
  useEffect(() => {
    fetchCustomerList(!!searchQuery && searchQuery.trim() !== "");
  }, [fetchCustomerList, searchQuery]);

  return (
    <CustomerListPageView
      loading={loading}
      customerList={customerList}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      searchTerm={searchTerm}
      filterModalOpen={filterModalOpen}
      filters={filters}
      onSearchChange={setSearchTerm}
      onFilterModalOpen={handleFilterModalOpen}
      onFilterModalClose={handleFilterModalClose}
      onFiltersChange={handleFiltersChange}
      onFilterApply={handleFilterApply}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onCustomerUpdate={handleCustomerUpdate}
      onRefresh={handleRefresh}
      onCustomerCreate={handleCustomerCreate}
      onSearchSubmit={handleSearchSubmit}
      onFilterReset={handleFilterReset}
      onMobileMenuToggle={onMobileMenuToggle}
    />
  );
};

export default CustomerListPage;
