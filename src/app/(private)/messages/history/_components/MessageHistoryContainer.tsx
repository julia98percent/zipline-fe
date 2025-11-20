"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@/components/Button";
import dayjs, { Dayjs } from "dayjs";
import MessageDetailModal from "./MessageDetailModal";
import { MessageHistory } from "@/types/message";
import { fetchMessages } from "@/apis/messageService";
import DatePicker from "@/components/DatePicker";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import MessageHistoryList from "./MessageHistoryList";
import { buildDateFilterParams } from "@/utils/dateFilter";
import CircularProgress from "@/components/CircularProgress";

export type MessageHistoryData = Pick<
  MessageHistory,
  "dateCreated" | "status" | "dateCompleted"
>;

interface MessageHistoryContainerProps {
  initialMessages: MessageHistory[];
  initialHasMore: boolean;
  initialCursorId: string | null;
}

const MessageHistoryContainer = ({
  initialMessages,
  initialHasMore,
  initialCursorId,
}: MessageHistoryContainerProps) => {
  const { getParam, setParam, clearAllFilters, searchParams } = useUrlFilters();

  const startDate = useMemo(() => {
    const dateStr = getParam("startDate");
    return dateStr ? dayjs(dateStr) : null;
  }, [getParam]);
  const endDate = useMemo(() => {
    const dateStr = getParam("endDate");
    return dateStr ? dayjs(dateStr) : null;
  }, [getParam]);

  const [messages, setMessages] = useState<MessageHistory[]>(initialMessages);
  const [selectedMessageHistory, setSelectedMessageHistory] =
    useState<MessageHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 서버에서 이미 로딩했으므로 false
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [cursorId, setCursorId] = useState<string | null>(initialCursorId);

  const prevSearchParamsRef = useRef<{
    startDate?: string | null;
    endDate?: string | null;
  } | null>(null);

  const handleStartDateChange = useCallback(
    (newStartDate: Dayjs | null) => {
      setParam(
        "startDate",
        newStartDate ? newStartDate.format("YYYY-MM-DD") : ""
      );
    },
    [setParam]
  );

  const handleEndDateChange = useCallback(
    (newEndDate: Dayjs | null) => {
      setParam("endDate", newEndDate ? newEndDate.format("YYYY-MM-DD") : "");
    },
    [setParam]
  );

  const handleModalClose = () => setDetailModalOpen(false);

  const handleRowClick = (rowData: MessageHistory) => {
    const originalMessage = messages.find(
      (msg) => msg.groupId === rowData.groupId
    );
    if (originalMessage) {
      setSelectedMessageHistory(originalMessage);
      setDetailModalOpen(true);
    }
  };

  const handleCardClick = (groupId: string) => {
    const originalMessage = messages.find((msg) => msg.groupId === groupId);
    if (originalMessage) {
      setSelectedMessageHistory(originalMessage);
      setDetailModalOpen(true);
    }
  };

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (isLoading && !isLoadMore) return;

      setIsLoading(true);

      if (!isLoadMore) {
        setMessages([]);
        setCursorId(null);
      }

      try {
        const dateFilter = buildDateFilterParams(startDate, endDate);

        const params = {
          ...dateFilter,
          startKey: isLoadMore ? cursorId : null,
        };

        const data = await fetchMessages(params);
        const content = Object.values(data.groupList);
        if (isLoadMore) {
          setMessages((prev) => [...prev, ...content]);
        } else {
          setMessages(content);
        }

        setCursorId(data.nextKey);
        setHasMore(data.nextKey !== null);
      } catch (error) {
        if (!isLoadMore) {
          setMessages([]);
          setHasMore(false);
        }
        console.error("Failed to fetch message history:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams, cursorId, isLoading, getParam]
  );

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      fetchData(true);
    }
  }, [hasMore, isLoading, fetchData]);

  useEffect(() => {
    const searchParamsObj = {
      startDate: getParam("startDate"),
      endDate: getParam("endDate"),
    };

    const hasSearchParamsChanged =
      !prevSearchParamsRef.current ||
      JSON.stringify(prevSearchParamsRef.current) !==
        JSON.stringify(searchParamsObj);

    if (hasSearchParamsChanged) {
      prevSearchParamsRef.current = searchParamsObj;

      const fetchData = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setMessages([]);
        setCursorId(null);

        try {
          const dateFilter = buildDateFilterParams(startDate, endDate);

          const params = {
            ...dateFilter,
            startKey: null,
          };

          const data = await fetchMessages(params);

          setMessages(Object.values(data.groupList));
          setCursorId(data.nextKey);
          setHasMore(data.nextKey !== null);
        } catch (error) {
          setMessages([]);
          setHasMore(false);
          console.error("Failed to fetch properties:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [searchParams, isLoading, getParam]);

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="flex flex-col gap-4 p-5 pt-0">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] p-3 card gap-2">
        <div className="flex flex-col xs:flex-row gap-2 xs:items-center">
          <h6 className="text-sm text-gray-700 font-medium whitespace-nowrap">
            문자 발송일
          </h6>
          <div className="flex items-center gap-2">
            <DatePicker
              value={startDate || null}
              onChange={handleStartDateChange}
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
            <span className="mx-1 text-gray-500">~</span>
            <DatePicker
              value={endDate || null}
              onChange={handleEndDateChange}
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
          </div>
        </div>
        <div className="flex ml-auto gap-2">
          <Button variant="text" color="info" onClick={clearAllFilters}>
            필터 초기화
          </Button>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            새로고침
          </Button>
        </div>
      </div>

      <div>
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh]">
            <CircularProgress />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            문자 발송 내역이 없습니다.
          </div>
        ) : (
          <MessageHistoryList
            messageList={messages}
            hasMore={hasMore}
            isLoading={isLoading}
            loadMore={handleLoadMore}
            handleRowClick={handleRowClick}
            handleCardClick={handleCardClick}
          />
        )}
      </div>

      <MessageDetailModal
        open={detailModalOpen}
        onClose={handleModalClose}
        messageHistory={selectedMessageHistory}
      />
    </div>
  );
};

export default MessageHistoryContainer;
