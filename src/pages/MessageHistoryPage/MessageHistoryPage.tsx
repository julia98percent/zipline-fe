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
  Button,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
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
  dateCompleted: string;
  statusCode: string | null;
  status: string;
  to: string | null;
  text: string | null;
  messageId: string | null;
  count: MessageCount;
  messageTypeCount: any | null;
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
  const [totalPages, setTotalPages] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { user } = useUserStore();

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data: response } = await apiClient.get<MessageHistoryResponse>(
        "/messages"
      );

      if (
        response.success &&
        response.code === 200 &&
        response.data?.groupList
      ) {
        // Convert groupList object to array
        const messageArray = Object.values(response.data.groupList || {});
        setMessages(messageArray);
        // Calculate total pages based on limit
        setTotalPages(
          Math.ceil(messageArray.length / (response.data.limit || 20))
        );
      } else {
        setMessages([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, selectedFilters]);

  const handleFilterClick = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setPage(0);
  };

  const handleRefresh = () => {
    fetchMessages();
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

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
      }}
    >
      <PageHeader title="문자 발송 내역" userName={user?.name || ""} />

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
          {/* <Button
            variant={
              selectedFilters.includes("success") ? "contained" : "outlined"
            }
            onClick={() => handleFilterClick("success")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "none",
              borderColor: "#4CAF50",
              color: selectedFilters.includes("success")
                ? "#FFFFFF"
                : "#4CAF50",
              backgroundColor: selectedFilters.includes("success")
                ? "#4CAF50"
                : "transparent",
              "&:hover": {
                boxShadow: "none",
                borderColor: "#2E7D32",
                backgroundColor: selectedFilters.includes("success")
                  ? "#2E7D32"
                  : "rgba(76, 175, 80, 0.04)",
              },
            }}
          >
            발송 성공건
          </Button>
          <Button
            variant={
              selectedFilters.includes("fail") ? "contained" : "outlined"
            }
            onClick={() => handleFilterClick("fail")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "none",
              borderColor: "#F44336",
              color: selectedFilters.includes("fail") ? "#FFFFFF" : "#F44336",
              backgroundColor: selectedFilters.includes("fail")
                ? "#F44336"
                : "transparent",
              "&:hover": {
                boxShadow: "none",
                borderColor: "#C62828",
                backgroundColor: selectedFilters.includes("fail")
                  ? "#C62828"
                  : "rgba(244, 67, 54, 0.04)",
              },
            }}
          >
            발송 실패건
          </Button>     */}
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={40} sx={{ color: "#164F9E" }} />
          </Box>
        ) : (
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
                  <TableCell align="center">전체</TableCell>
                  <TableCell align="center">성공</TableCell>
                  <TableCell align="center">실패</TableCell>
                  <TableCell align="center">대기</TableCell>
                  <TableCell>발송 완료일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages && messages.length > 0 ? (
                  messages.map((message) => (
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
                      <TableCell align="center">
                        {message.count.total}
                      </TableCell>
                      <TableCell align="center">
                        {message.count.sentSuccess}
                      </TableCell>
                      <TableCell align="center">
                        {message.count.sentFailed}
                      </TableCell>
                      <TableCell align="center">
                        {message.count.sentPending}
                      </TableCell>
                      <TableCell>{formatDate(message.dateCompleted)}</TableCell>
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
        )}

        {messages && messages.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                {messages.length}
              </Typography>
              <Box
                component="span"
                sx={{
                  width: "1px",
                  height: "12px",
                  backgroundColor: "#E0E0E0",
                }}
              />
              <Typography variant="body2" color="textSecondary">
                {page + 1} / {totalPages}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                disabled={page === 0}
                size="small"
                sx={{
                  padding: "4px",
                  color: "#666666",
                  "&:hover": { color: "#333333" },
                  "&.Mui-disabled": { color: "#E0E0E0" },
                }}
              >
                <NavigateBeforeIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() =>
                  setPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={page === totalPages - 1}
                size="small"
                sx={{
                  padding: "4px",
                  color: "#666666",
                  "&:hover": { color: "#333333" },
                  "&.Mui-disabled": { color: "#E0E0E0" },
                }}
              >
                <NavigateNextIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessageHistoryPage;
