import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "@components/PageHeader/PageHeader";
import Button from "@components/Button";
import dayjs from "dayjs";
import MessageDetailModal from "./MessageDetailModal";
import { translateMessageStatusToKorean } from "@utils/messageUtil";
import Status from "@components/Status";
import { MessageHistory } from "@ts/message";
import { fetchMessages } from "@apis/messageService";
import Table, { ColumnConfig } from "@components/Table";
import { DEFAULT_ROWS_PER_PAGE } from "@components/Table/Table";

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
  const [messages, setMessages] = useState<MessageHistory[]>([]);
  const [selectedMessageHistory, setSelectedMessageHistory] =
    useState<MessageHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <PageHeader
        title="문자 발송 내역"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      <Box sx={{ p: "20px" }}>
        <Box
          sx={{
            mb: "28px",
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleRefresh}
            className="rounded border-[#164F9E] bg-white text-[#164F9E] h-9 text-xs px-4 hover:border-[#0D3B7A] hover:text-[#0D3B7A] hover:bg-[rgba(22,79,158,0.04)] flex items-center gap-2"
          >
            <RefreshIcon fontSize="small" />
            새로고침
          </Button>
        </Box>

        <Paper
          sx={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "none",
          }}
        >
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
      <MessageDetailModal
        open={detailModalOpen}
        onClose={handleModalClose}
        messageHistory={selectedMessageHistory}
      />
    </Box>
  );
};

export default MessageHistoryPage;
