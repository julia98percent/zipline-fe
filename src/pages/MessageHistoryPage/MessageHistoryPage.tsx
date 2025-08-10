import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "@components/PageHeader/PageHeader";
import Button from "@components/Button";
import dayjs, { Dayjs } from "dayjs";
import MessageDetailModal from "./MessageDetailModal";
import { MessageHistory } from "@ts/message";
import { fetchMessages } from "@apis/messageService";
import DatePicker from "@components/DatePicker";
import { useUrlFilters } from "@hooks/useUrlFilters";
import MessageHistoryList from "./MessageHistoryList";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

interface TableRowData {
  id: string;
  dateCreated: string;
  status: string;
  dateCompleted: string;
}

export type MessageHistoryData = Pick<
  MessageHistory,
  "dateCreated" | "status" | "dateCompleted"
>;

const MessageHistoryPage = () => {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { getParam, setParam, clearAllFilters, searchParams } = useUrlFilters();

  const startDate = useMemo(() => {
    const dateStr = getParam("startDate");
    return dateStr ? dayjs(dateStr) : null;
  }, [searchParams]);
  const endDate = useMemo(() => {
    const dateStr = getParam("endDate");
    return dateStr ? dayjs(dateStr) : null;
  }, [searchParams]);

  const [messages, setMessages] = useState<MessageHistory[]>([]);
  const [selectedMessageHistory, setSelectedMessageHistory] =
    useState<MessageHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursorId, setCursorId] = useState<string | null>(null);

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

  const handleRowClick = (rowData: TableRowData) => {
    const originalMessage = messages.find((msg) => msg.groupId === rowData.id);
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
        const params = {
          startDate: getParam("startDate"),
          endDate: getParam("endDate"),
          startKey: isLoadMore ? cursorId : null,
        };
        console.log(params);
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
          const params = {
            startDate: getParam("startDate"),
            endDate: getParam("endDate"),
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
    <div className="grow bg-gray-100 min-h-screen">
      <PageHeader
        title="문자 발송 내역"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      <div className="p-[20px]">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] bg-white p-3 mb-7 rounded-lg shadow-sm gap-2">
          <div className="flex gap-2 items-center">
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
            <Button variant="text" onClick={clearAllFilters}>
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
          {messages.length === 0 ? (
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
    </div>
  );
};

export default MessageHistoryPage;
