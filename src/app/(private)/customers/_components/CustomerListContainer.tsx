"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Customer, CustomerFilter } from "@/types/customer";
import { updateCustomer } from "@/apis/customerService";
import { showToast } from "@/components/Toast";
import CustomerListView from "./CustomerListView";
import { useCustomers } from "@/queries/useCustomers";

interface CustomerListContainerProps {
  initialCustomers: Customer[];
  initialTotalCount: number;
}

const CustomerListContainer = ({
  initialCustomers,
  initialTotalCount,
}: CustomerListContainerProps) => {
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

  const { data, isLoading: loading, refetch: fetchCustomerList } = useCustomers({
    page,
    rowsPerPage,
    searchQuery,
    filters,
    initialCustomers,
    initialTotalCount,
  });

  const customerList = data?.customers || [];
  const totalCount = data?.totalCount || 0;

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

      fetchCustomerList();

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

  return (
    <CustomerListView
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
    />
  );
};

export default CustomerListContainer;
