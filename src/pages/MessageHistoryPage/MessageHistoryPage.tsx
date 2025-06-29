import { useState, useEffect } from "react";
import { Box, Paper, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "@components/PageHeader/PageHeader";
import dayjs from "dayjs";
import MessageDetailModal from "./MessageDetailModal";
import { translateMessageStatusToKorean } from "@utils/messageUtil";
import Status from "@components/Status";
import { MessageGroup } from "@ts/message";
import { fetchMessages } from "@apis/messageService";
import Table from "@components/Table";

const MessageHistoryPage = () => {
  const [messages, setMessages] = useState<MessageGroup[]>([]);
  const [selectedMessageHistory, setSelectedMessageHistory] =
    useState<MessageGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalElements, setTotalElements] = useState(0);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const handleRowClick = (rowData) => {
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
      <PageHeader title="문자 발송 내역" />

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
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              borderRadius: "4px",
              height: "36px",
              fontSize: "13px",
              padding: "0 16px",
              borderColor: "#164F9E",
              background: "white",
              color: "#164F9E",
              "&:hover": {
                borderColor: "#0D3B7A",
                color: "#0D3B7A",
                backgroundColor: "rgba(22, 79, 158, 0.04)",
              },
            }}
          >
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
            headerList={["발송 요청일", "상태", "발송 완료일"]}
            bodyList={messages.map((message) => ({
              id: message.groupId,
              dateCreated: formatDate(message.dateCreated),
              status: (
                <Status
                  text={translateMessageStatusToKorean(message.status)}
                  color={
                    message.status === "COMPLETE"
                      ? "GREEN"
                      : message.status === "FAILED"
                      ? "RED"
                      : "GRAY"
                  }
                />
              ),

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
