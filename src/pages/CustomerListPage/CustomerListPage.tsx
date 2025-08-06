import { useState, useEffect, useCallback, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useUrlPagination } from "@hooks/useUrlPagination";
import { useUrlFilters } from "@hooks/useUrlFilters";
import { Customer, CustomerFilter } from "@ts/customer";
import { searchCustomers, updateCustomer } from "@apis/customerService";
import { showToast } from "@components/Toast";
import CustomerListPageView from "./CustomerListPageView";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

const CustomerListPage = () => {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { page, rowsPerPage, setPage, setRowsPerPage, resetToFirstPage } =
    useUrlPagination();
  const {
    getParam,
    getBooleanParam,
    getNumberParam,
    setParam,
    setParams,
    clearAllFilters,
    searchParams,
  } = useUrlFilters();

  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const searchQuery = getParam("q");

  const filters: CustomerFilter = useMemo(
    () => ({
      tenant: getBooleanParam("tenant"),
      landlord: getBooleanParam("landlord"),
      buyer: getBooleanParam("buyer"),
      seller: getBooleanParam("seller"),
      minPrice: getNumberParam("minPrice") || null,
      maxPrice: getNumberParam("maxPrice") || null,
      minRent: getNumberParam("minRent") || null,
      maxRent: getNumberParam("maxRent") || null,
      minDeposit: getNumberParam("minDeposit") || null,
      maxDeposit: getNumberParam("maxDeposit") || null,
      labelUids: getParam("labels")
        ? getParam("labels").split(",").map(Number)
        : [],
      telProvider: getParam("telProvider"),
      preferredRegion: getParam("region"),
      trafficSource: getParam("source"),
      noRole: getBooleanParam("noRole"),
    }),
    [searchParams]
  );

  const fetchCustomerList = useCallback(async () => {
    const buildApiParams = (): Record<string, string | number | boolean> => {
      const params: Record<string, string | number | boolean> = {
        page: page + 1,
        size: rowsPerPage,
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
      if (filters.preferredRegion) params.regionCode = filters.preferredRegion;
      if (filters.trafficSource) params.trafficSource = filters.trafficSource;

      return params;
    };

    try {
      setLoading(true);
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
  }, [page, rowsPerPage, searchQuery, filters]);

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

  const handleFiltersChange = useCallback(
    (newFilters: CustomerFilter) => {
      setParams({
        tenant: newFilters.tenant,
        landlord: newFilters.landlord,
        buyer: newFilters.buyer,
        seller: newFilters.seller,
        minPrice: newFilters.minPrice,
        maxPrice: newFilters.maxPrice,
        minRent: newFilters.minRent,
        maxRent: newFilters.maxRent,
        minDeposit: newFilters.minDeposit,
        maxDeposit: newFilters.maxDeposit,
        labels: newFilters.labelUids?.length
          ? newFilters.labelUids.join(",")
          : null,
        telProvider: newFilters.telProvider,
        region: newFilters.preferredRegion,
        source: newFilters.trafficSource,
        noRole: newFilters.noRole,
      });
    },
    [setParams]
  );

  const handleFilterApply = useCallback(
    (appliedFilters: CustomerFilter) => {
      handleFiltersChange(appliedFilters);
      setFilterModalOpen(false);
    },
    [handleFiltersChange]
  );

  const handleSearchSubmit = useCallback(() => {
    setParam("q", searchTerm);
  }, [searchTerm, setParam]);

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPage(newRowsPerPage);
    },
    [setRowsPerPage]
  );

  const handleFilterModalOpen = useCallback(() => setFilterModalOpen(true), []);
  const handleFilterModalClose = useCallback(
    () => setFilterModalOpen(false),
    []
  );

  const handleRefresh = useCallback(
    () => fetchCustomerList(),
    [fetchCustomerList]
  );
  const handleCustomerCreate = useCallback(() => {
    resetToFirstPage();
    fetchCustomerList();
  }, [fetchCustomerList, resetToFirstPage]);

  const handleFilterReset = useCallback(() => {
    clearAllFilters();
    setSearchTerm("");
  }, [clearAllFilters]);

  useEffect(() => {
    setSearchTerm(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomerList();
  }, [fetchCustomerList]);

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
      onSearchChange={handleSearchChange}
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
