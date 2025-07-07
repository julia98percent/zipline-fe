import { useState, useEffect, useCallback } from "react";
import { Customer, CustomerFilter } from "@ts/customer";
import { searchCustomers, updateCustomer } from "@apis/customerService";
import { showToast } from "@components/Toast/Toast";
import CustomerListPageView from "./CustomerListPageView";

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
  legalDistrictCode: "",
  trafficSource: "",
  noRole: false,
};
const CustomerListPage = () => {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<CustomerFilter>(INITIAL_FILTERS);

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
        if (filters.labelUids && filters.labelUids.length > 0)
          params.labelUids = filters.labelUids.join(",");
        if (filters.noRole) {
          params.noRole = true;
        }
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
        legalDistrictCode: updatedCustomer.legalDistrictCode,
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

  const handleFilterApply = (appliedFilters: CustomerFilter) => {
    setFilters(appliedFilters);
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

export default CustomerListPage;
