import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "@components/PageHeader/PageHeader";
import Button from "@components/Button";
import MobilePagination from "@components/MobilePagination";
import { useUrlPagination } from "@hooks/useUrlPagination";
import dayjs from "dayjs";
import MessageDetailModal from "./MessageDetailModal";
import MessageHistoryCard from "./MessageHistoryCard";
import { translateMessageStatusToKorean } from "@utils/messageUtil";
import Status from "@components/Status";
import { MessageHistory } from "@ts/message";
import { fetchMessages } from "@apis/messageService";
import Table, { ColumnConfig } from "@components/Table";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

interface TableRowData {
  id: string;
  dateCreated: string;
  status: string;
  dateCompleted: string;
}

const MessageHistoryPage = () => {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { page, rowsPerPage, setPage, setRowsPerPage } = useUrlPagination();
  
  const [messages, setMessages] = useState<MessageHistory[]>([]);
  const [selectedMessageHistory, setSelectedMessageHistory] = useState<MessageHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const columns: ColumnConfig<TableRowData>[] = [
    {
      key: "dateCreated",
      label: "발송 요청일",
      align: "left",
    },
    {
      key: "status",
      label: "상태",
      align: "left",
      render: (_, row) => (
        <Status
          text={translateMessageStatusToKorean(row.status as string)}
          color={
            row.status === "COMPLETE"
              ? "GREEN"
              : row.status === "FAILED"
              ? "RED"
              : "GRAY"
          }
        />
      ),
    },
    {
      key: "dateCompleted",
      label: "발송 완료일",
      align: "left",
    },
  ];

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

  const handleModalClose = () => setDetailModalOpen(false);

  const fetchData = async () => {
    setIsLoading(true);
    const messageArray = await fetchMessages();
    setMessages(messageArray);
    setTotalElements(messageArray.length);
    setIsLoading(false);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box className="grow bg-gray-100 min-h-screen">
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
        <Box className="block lg:hidden">
          {messages.length === 0 ? (
            <Box className="text-center py-8 text-gray-500">
              문자 발송 내역이 없습니다.
            </Box>
          ) : (
            <>
              <Box className="space-y-4">
                {messages
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((message) => (
                    <MessageHistoryCard
                      key={message.groupId}
                      message={message}
                      onRowClick={handleCardClick}
                    />
                  ))}
              </Box>
              <MobilePagination
                page={page}
                totalElements={totalElements}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
              />
            </>
          )}
        </Box>
      </Box>
      <MessageDetailModal
        open={detailModalOpen}
        onClose={handleModalClose}
        messageHistory={selectedMessageHistory}
      />
    </Box>
  );
};

export default MessageHistoryPage;