import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "@components/PageHeader/PageHeader";
import Button from "@components/Button";
import { useUrlPagination } from "@hooks/useUrlPagination";
import dayjs from "dayjs";
import MessageDetailModal from "./MessageDetailModal";
import MessageHistoryCard from "./MessageHistoryCard";
import { MessageHistory } from "@ts/message";
import { fetchMessages } from "@apis/messageService";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

const MessageHistoryPage = () => {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { rowsPerPage } = useUrlPagination();

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

      <Box className="p-[20px]">
        <Box className="mb-[28px] flex justify-end items-center gap-2">
          <Button
            variant="outlined"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            새로고침
          </Button>
        </Box>

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