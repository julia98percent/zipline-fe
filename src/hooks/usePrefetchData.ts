import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchMessageTemplates } from "@/apis/messageService";
import { fetchCounselList } from "@/apis/counselService";

/**
 * 주요 데이터를 미리 로드하는 훅
 * 사용자가 페이지를 방문하기 전에 데이터를 캐시에 저장
 */
export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 메시지 템플릿 prefetch
    queryClient.prefetchQuery({
      queryKey: ["messageTemplates"],
      queryFn: fetchMessageTemplates,
    });

    // 상담 목록 첫 페이지 prefetch (옵션)
    queryClient.prefetchQuery({
      queryKey: ["counsels", 0, 10, "", null, null, null, null],
      queryFn: () =>
        fetchCounselList({
          page: 0,
          size: 10,
        }),
    });
  }, [queryClient]);
};
