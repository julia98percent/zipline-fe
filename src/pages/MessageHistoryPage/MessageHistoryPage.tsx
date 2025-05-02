import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "@components/PageHeader/PageHeader";
import apiClient from "@apis/apiClient";
import useUserStore from "@stores/useUserStore";
import dayjs from "dayjs";

interface MessageCount {
  total: number;
  sentTotal: number;
  sentFailed: number;
  sentSuccess: number;
  sentPending: number;
  sentReplacement: number;
  refund: number;
  registeredFailed: number;
  registeredSuccess: number;
}

interface MessageGroup {
  groupId: string;
  from: string | null;
  type: string | null;
  subject: string | null;
  dateCreated: string;
  dateUpdated: string;
  dateCompleted?: string;
  statusCode: string | null;
  status: string;
  to: string | null;
  text: string | null;
  messageId: string | null;
  count?: MessageCount;
  messageTypeCount?: Record<string, number> | null;
}

interface MessageHistoryResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    startKey: string | null;
    nextKey: string | null;
    limit: number;
    groupList: Record<string, MessageGroup>;
  };
}

const MessageHistoryPage = () => {
  const [messages, setMessages] = useState<MessageGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const { user } = useUserStore();

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data: response } = await apiClient.get<MessageHistoryResponse>(
        "/messages"
      );

      console.log("API Response:", response);
      console.log("GroupList:", response.data?.groupList);

      if (
        response.success &&
        response.code === 200 &&
        response.data?.groupList
      ) {
        const messageArray = Object.values(response.data.groupList || {});
        setMessages(messageArray);
        setTotalElements(messageArray.length);
      } else {
        setMessages([]);
        setTotalElements(0);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const handleRefresh = () => {
    fetchMessages();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETE":
        return {
          bg: "#E8F5E9",
          text: "#2E7D32",
        };
      case "FAILED":
        return {
          bg: "#FFEBEE",
          text: "#C62828",
        };
      default:
        return {
          bg: "#FFF3E0",
          text: "#E65100",
        };
    }
  };

  const displayedMessages = messages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <PageHeader title="문자 발송 내역" userName={user?.name || "-"} />

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={handleRefresh}
            sx={{
              color: "#666666",
              backgroundColor: "transparent",
              "&:hover": {
                color: "#333333",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            boxShadow: "none",
            border: "1px solid #E0E0E0",
            minHeight: "400px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>발송 요청일</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>발송 완료일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages && messages.length > 0 ? (
                displayedMessages.map((message) => (
                  <TableRow key={message.groupId}>
                    <TableCell>{formatDate(message.dateCreated)}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1,
                          py: 0.5,
                          borderRadius: "4px",
                          backgroundColor: getStatusColor(message.status).bg,
                          color: getStatusColor(message.status).text,
                        }}
                      >
                        {message.status}
                      </Box>
                    </TableCell>

                    <TableCell>
                      {message.dateCompleted
                        ? formatDate(message.dateCompleted)
                        : formatDate(message.dateUpdated)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "#666666", fontWeight: 500 }}
                    >
                      발송 내역이 없습니다
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={40} sx={{ color: "#164F9E" }} />
          </Box>
        )}

        {messages && messages.length > 0 && (
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="페이지당 행"
            labelDisplayedRows={({ from, to, count }) =>
              `${count}개 중 ${from}-${to}개`
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default MessageHistoryPage;
