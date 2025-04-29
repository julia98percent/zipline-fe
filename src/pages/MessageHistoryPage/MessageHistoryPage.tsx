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

interface MessageHistory {
  createdAt: string;
  type: "SMS" | "LMS";
  senderNumber: string;
  receiverNumber: string;
  statusCode: string;
  statusName: string;
  note: string;
  content: string;
}

interface MessageHistoryResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    content: MessageHistory[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

const MessageHistoryPage = () => {
  const [messages, setMessages] = useState<MessageHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data: response } = await apiClient.get<MessageHistoryResponse>(
        "/messages",
        {
          params: {
            limit: 50,
            startKey: page * 50,
            criteria: "type,statusCode",
            cond: "in,in",
            value:
              selectedFilters.length > 0
                ? selectedFilters.join(",")
                : undefined,
            dateType: "dateCreated",
            startDate: new Date(
              new Date().setDate(new Date().getDate() - 7)
            ).toISOString(), // 최근 7일
            endDate: new Date().toISOString(),
          },
        }
      );

      if (response.success && response.code === 200 && response.data) {
        setMessages(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
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

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
      }}
    >
      <PageHeader title="문자 발송 내역" userName="사용자 이름" />

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
          <Button
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
          </Button>
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
                  <TableCell>생성일</TableCell>
                  <TableCell>타입</TableCell>
                  <TableCell>발신번호</TableCell>
                  <TableCell>수신번호</TableCell>
                  <TableCell>상태코드</TableCell>
                  <TableCell>비고</TableCell>
                  <TableCell>내용</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages && messages.length > 0 ? (
                  messages.map((message, index) => (
                    <TableRow key={index}>
                      <TableCell>{message.createdAt}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              message.type === "SMS" ? "#4CAF50" : "#2196F3",
                            fontWeight: 500,
                          }}
                        >
                          {message.type}
                        </Typography>
                      </TableCell>
                      <TableCell>{message.senderNumber}</TableCell>
                      <TableCell>{message.receiverNumber}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1,
                            py: 0.5,
                            borderRadius: "4px",
                            backgroundColor:
                              message.statusCode === "4000"
                                ? "#E8F5E9"
                                : message.statusCode === "1070"
                                ? "#FFEBEE"
                                : "#FFF3E0",
                            color:
                              message.statusCode === "4000"
                                ? "#2E7D32"
                                : message.statusCode === "1070"
                                ? "#C62828"
                                : "#E65100",
                          }}
                        >
                          {message.statusName} ({message.statusCode})
                        </Box>
                      </TableCell>
                      <TableCell>{message.note}</TableCell>
                      <TableCell>
                        <Tooltip title={message.content}>
                          <Typography
                            sx={{
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {message.content}
                          </Typography>
                        </Tooltip>
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
                50
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
