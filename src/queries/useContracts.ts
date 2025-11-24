import { useQuery } from "@tanstack/react-query";
import { searchContracts } from "@/apis/contractService";
import { Contract } from "@/types/contract";

interface UseContractsParams {
  mappedCategory: string;
  searchQuery: string;
  selectedPeriod: string | null;
  selectedStatus: string;
  selectedSort: string;
  page: number;
  rowsPerPage: number;
  initialContracts?: Contract[];
  initialTotalElements?: number;
  onFilterModalClose?: () => void;
}

export const useContracts = ({
  mappedCategory,
  searchQuery,
  selectedPeriod,
  selectedStatus,
  selectedSort,
  page,
  rowsPerPage,
  initialContracts = [],
  initialTotalElements = 0,
  onFilterModalClose,
}: UseContractsParams) => {
  return useQuery({
    queryKey: [
      "contracts",
      mappedCategory,
      searchQuery,
      selectedPeriod,
      selectedStatus,
      selectedSort,
      page,
      rowsPerPage,
    ],
    queryFn: async () => {
      const result = await searchContracts({
        category: mappedCategory,
        customerName: searchQuery,
        address: searchQuery,
        period: selectedPeriod || "",
        status: selectedStatus,
        sort: selectedSort,
        page,
        size: rowsPerPage,
      });
      onFilterModalClose?.();
      return result;
    },
    initialData: {
      contracts: initialContracts,
      totalElements: initialTotalElements,
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
