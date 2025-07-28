import { useEffect, useRef, useCallback } from "react";
import { PublicPropertyItem } from "@ts/property";
import PublicPropertyTableView from "./PublicPropertyTableView";
import { Box, CircularProgress, Typography } from "@mui/material";

interface Props {
  propertyList: PublicPropertyItem[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  onSort: (field: string) => void;
  sortField?: string;
  isAscending?: boolean;
  useMetric: boolean;
}

const PublicPropertyTable = ({
  propertyList,
  hasMore,
  isLoading,
  loadMore,
  onSort,
  sortField,
  isAscending,
  useMetric,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Intersection Observer를 사용한 무한 스크롤
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px", // 스크롤 끝에서 100px 전에 미리 로드
      threshold: 0.1,
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [handleIntersection]);

  return (
    <Box ref={scrollRef} className="w-full">
      <PublicPropertyTableView
        propertyList={propertyList}
        onSort={onSort}
        sortField={sortField}
        isAscending={isAscending}
        useMetric={useMetric}
      />

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <Box className="flex items-center justify-center p-[20px]">
          <CircularProgress size={24} />
          <Typography variant="body2" className="ml-4">
            매물을 불러오는 중...
          </Typography>
        </Box>
      )}

      {/* 감지용 요소 (Sentinel) */}
      {hasMore && !isLoading && (
        <div
          ref={sentinelRef}
          style={{
            height: "20px",
            width: "100%",
            backgroundColor: "transparent",
          }}
        />
      )}

      {/* 모든 데이터 로드 완료 메시지 */}
      {!hasMore && propertyList.length > 0 && (
        <Box className="flex justify-center p-4 text-primary">
          <Typography variant="body2">모든 매물을 불러왔습니다.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default PublicPropertyTable;
