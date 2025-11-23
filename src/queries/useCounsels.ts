import { useQuery } from "@tanstack/react-query";
import { fetchCounselList } from "@/apis/counselService";
import { Counsel } from "@/types/counsel";
import { Dayjs } from "dayjs";

interface UseCounselsParams {
  page: number;
  rowsPerPage: number;
  searchQuery?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  selectedType?: string | null;
  selectedCompleted?: boolean | null;
  initialCounsels?: Counsel[];
  initialTotalElements?: number;
}

export const useCounsels = ({
  page,
  rowsPerPage,
  searchQuery,
  startDate,
  endDate,
  selectedType,
  selectedCompleted,
  initialCounsels = [],
  initialTotalElements = 0,
}: UseCounselsParams) => {
  return useQuery({
    queryKey: ["counsels", page, rowsPerPage, searchQuery, startDate, endDate, selectedType, selectedCompleted],
    queryFn: () => fetchCounselList({
      page,
      size: rowsPerPage,
      search: searchQuery || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      type: selectedType || undefined,
      completed: selectedCompleted ?? undefined,
    }),
    initialData: { counsels: initialCounsels, totalElements: initialTotalElements },
  });
};
