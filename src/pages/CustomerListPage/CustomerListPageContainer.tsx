import { useState, useEffect, useCallback } from "react";
import { Customer } from "@ts/customer";
import { searchCustomers } from "@apis/customerService";
import CustomerListPageView from "./CustomerListPageView";

interface Filters {
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  minRent: number | null;
  maxRent: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
  labelUids: number[];
  telProvider: string;
  legalDistrictCode: string;
  trafficSource: string;
}

const CustomerListPageContainer = () => {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
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
    legalDistrictCode: "",
    trafficSource: "",
  });

  const fetchCustomerList = useCallback(
    async (reset = true) => {
      const buildApiParams = (): Record<string, string | number | boolean> => {
        const params: Record<string, string | number | boolean> = {
          page: page + 1,
          pageSize: rowsPerPage,
        };

        if (searchTerm) {
          params.searchTerm = searchTerm;
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
        if (filters.labelUids.length > 0)
          params.labelUids = filters.labelUids.join(",");
        if (filters.telProvider) params.telProvider = filters.telProvider;
        if (filters.legalDistrictCode)
          params.legalDistrictCode = filters.legalDistrictCode;
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
    [page, rowsPerPage, searchTerm, filters]
  );

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCustomerList((prev) =>
      prev.map((customer) =>
        customer.uid === updatedCustomer.uid ? updatedCustomer : customer
      )
    );
  };

  const handleFilterApply = () => {
    setFilterModalOpen(false);
    fetchCustomerList(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  useEffect(() => {
    fetchCustomerList(false);
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
      onSearchChange={setSearchTerm}
      onFilterModalOpen={() => setFilterModalOpen(true)}
      onFilterModalClose={() => setFilterModalOpen(false)}
      onFiltersChange={setFilters}
      onFilterApply={handleFilterApply}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onCustomerUpdate={handleCustomerUpdate}
      onRefresh={() => fetchCustomerList(false)}
      onCustomerCreate={() => fetchCustomerList(true)}
    />
  );
};

export default CustomerListPageContainer;
