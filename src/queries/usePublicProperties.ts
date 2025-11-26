import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getPublicProperties } from "@/apis/propertyService";
import { PublicPropertySearchParams, PublicPropertySearchResponse } from "@/types/property";

export const usePublicProperties = (
  searchParams: PublicPropertySearchParams
) => {
  return useInfiniteQuery<
    PublicPropertySearchResponse,
    Error,
    InfiniteData<PublicPropertySearchResponse>,
    [string, PublicPropertySearchParams],
    string | null
  >({
    queryKey: ["publicProperties", searchParams],
    queryFn: ({ pageParam }) =>
      getPublicProperties({
        ...searchParams,
        cursorId: pageParam ?? undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursorId : undefined,
    initialPageParam: null,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
  });
};
