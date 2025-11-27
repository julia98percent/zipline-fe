import { useMemo } from "react";
import { PublicPropertySearchParams } from "@/types/property";
import { useUrlPagination } from "./useUrlPagination";

export const usePublicPropertySearchParams = (
  urlSearchParams: URLSearchParams,
  searchAddressQuery: string
): PublicPropertySearchParams => {
  const { rowsPerPage } = useUrlPagination();

  return useMemo(
    () => ({
      size: rowsPerPage,
      sortField: urlSearchParams.get("sortField") || "id",
      isAscending: urlSearchParams.get("isAscending") !== "false",
      category: urlSearchParams.get("category") || undefined,
      buildingType: urlSearchParams.get("buildingType") || undefined,
      buildingName: urlSearchParams.get("buildingName") || undefined,
      address: searchAddressQuery || undefined,
      minPrice: urlSearchParams.get("minPrice")
        ? parseInt(urlSearchParams.get("minPrice")!)
        : undefined,
      maxPrice: urlSearchParams.get("maxPrice")
        ? parseInt(urlSearchParams.get("maxPrice")!)
        : undefined,
      minDeposit: urlSearchParams.get("minDeposit")
        ? parseInt(urlSearchParams.get("minDeposit")!)
        : undefined,
      maxDeposit: urlSearchParams.get("maxDeposit")
        ? parseInt(urlSearchParams.get("maxDeposit")!)
        : undefined,
      minMonthlyRent: urlSearchParams.get("minMonthlyRent")
        ? parseInt(urlSearchParams.get("minMonthlyRent")!)
        : undefined,
      maxMonthlyRent: urlSearchParams.get("maxMonthlyRent")
        ? parseInt(urlSearchParams.get("maxMonthlyRent")!)
        : undefined,
      minNetArea: urlSearchParams.get("minNetArea")
        ? parseInt(urlSearchParams.get("minNetArea")!)
        : undefined,
      maxNetArea: urlSearchParams.get("maxNetArea")
        ? parseInt(urlSearchParams.get("maxNetArea")!)
        : undefined,
      minTotalArea: urlSearchParams.get("minTotalArea")
        ? parseInt(urlSearchParams.get("minTotalArea")!)
        : undefined,
      maxTotalArea: urlSearchParams.get("maxTotalArea")
        ? parseInt(urlSearchParams.get("maxTotalArea")!)
        : undefined,
      regionCode: urlSearchParams.get("regionCode") || undefined,
    }),
    [rowsPerPage, urlSearchParams, searchAddressQuery]
  );
};
