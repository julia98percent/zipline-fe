import { useState, useEffect, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "@components/PageHeader/PageHeader";
import Button from "@components/Button";
import { useUrlPagination } from "@hooks/useUrlPagination";
import dayjs, { Dayjs } from "dayjs";
import MessageDetailModal from "./MessageDetailModal";
import MessageHistoryCard from "./MessageHistoryCard";
import { MessageHistory } from "@ts/message";
import { fetchMessages } from "@apis/messageService";
import DatePicker from "@components/DatePicker";
import { useUrlFilters } from "@hooks/useUrlFilters";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

const MessageHistoryPage = () => {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { rowsPerPage } = useUrlPagination();
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

  const handleCardClick = (groupId: string) => {
    const originalMessage = messages.find((msg) => msg.groupId === groupId);
    if (originalMessage) {
      setSelectedMessageHistory(originalMessage);
      setDetailModalOpen(true);
    }
  };

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

  const fetchData = async () => {
    setIsLoading(true);
    const messageArray = await fetchMessages();
    setMessages(messageArray);
    setIsLoading(false);
  };

  const handleRefresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

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

        {/* Desktop view - 768px and above */}
        <Box className="hidden lg:block">
          <Paper className="w-full rounded-lg shadow-none">
            <Table
              isLoading={isLoading}
              columns={columns}
              bodyList={messages.map((message) => ({
                id: message.groupId,
                dateCreated: formatDate(message.dateCreated),
                status: message.status,
                dateCompleted: message.dateCompleted
                  ? formatDate(message.dateCompleted)
                  : "-",
              }))}
              handleRowClick={handleRowClick}
              totalElements={totalElements}
              page={page}
              handleChangePage={handleChangePage}
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>

        {/* Mobile view - below 768px */}
        <div className="block lg:hidden">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              문자 발송 내역이 없습니다.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageHistoryCard
                    key={message.groupId}
                    message={message}
                    onRowClick={handleCardClick}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <MessageDetailModal
        open={detailModalOpen}
        onClose={handleModalClose}
        messageHistory={selectedMessageHistory}
      />
    </div>
  );
};

export default MessageHistoryPage;