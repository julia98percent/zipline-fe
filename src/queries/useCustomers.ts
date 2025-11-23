import { useQuery } from "@tanstack/react-query";
import { searchCustomers } from "@/apis/customerService";
import { Customer, CustomerFilter } from "@/types/customer";

interface UseCustomersParams {
  page: number;
  rowsPerPage: number;
  searchQuery?: string;
  filters: CustomerFilter;
  initialCustomers?: Customer[];
  initialTotalCount?: number;
}

export const useCustomers = ({
  page,
  rowsPerPage,
  searchQuery,
  filters,
  initialCustomers = [],
  initialTotalCount = 0,
}: UseCustomersParams) => {
  const buildApiParams = (): Record<string, string | number | boolean> => {
    const params: Record<string, string | number | boolean> = {
      page,
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

  return useQuery({
    queryKey: ["customers", page, rowsPerPage, searchQuery, filters],
    queryFn: async () => {
      const params = buildApiParams();
      const searchParams = new URLSearchParams(
        params as Record<string, string>
      );
      return searchCustomers(searchParams);
    },
    initialData: { customers: initialCustomers, totalCount: initialTotalCount },
  });
};
