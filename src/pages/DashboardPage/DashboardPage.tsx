import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "./DashboardPage.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useNavigate } from "react-router-dom";
import PageHeader from "@components/PageHeader/PageHeader";
import apiClient from "@apis/apiClient";
import ScheduleDetailModal from "@components/ScheduleDetailModal/ScheduleDetailModal";
import { Schedule } from "../../interfaces/schedule";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Contract {
  uid: number;
  lessorOrSellerName: string;
  lesseeOrBuyerName: string;
  category: string;
  contractDate: string;
  contractStartDate: string;
  contractEndDate: string;
  status: string;
  address: string;
}

interface Consultation {
  id: number;
  customerName: string;
  title: string;
  consultationDate: Date;
  requestDate: Date;
}

interface StatisticsResponse {
  success: boolean;
  code: number;
  message: string;
  data: number;
}

interface Inquiry {
  id: number;
  customerName: string;
  phoneNumber: string;
  submittedDate: string;
  isRead: boolean;
}

const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [consultationTab, setConsultationTab] = useState<"request" | "latest">(
    "request"
  );
  const [contractTab, setContractTab] = useState<"expiring" | "recent">(
    "expiring"
  );
  const navigate = useNavigate();
  const [recentCustomers, setRecentCustomers] = useState<number>(0);
  const [recentContracts, setRecentContracts] = useState<Contract[]>([]);
  const [ongoingContracts, setOngoingContracts] = useState<number>(0);
  const [completedContracts, setCompletedContracts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<Schedule[]>(
    []
  );
  const [selectedDayStr, setSelectedDayStr] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState<Inquiry[]>([]);
  const [expiringContracts, setExpiringContracts] = useState<Contract[]>([]);
  const [contractLoading, setContractLoading] = useState(true);
  const [counselList, setCounselList] = useState<Consultation[]>([]);
  const [counselLoading, setCounselLoading] = useState(false);

  const fetchWeeklySchedules = async () => {
    try {
      const startDate = dayjs(selectedDate).startOf("week").toISOString();
      const endDate = dayjs(selectedDate).endOf("week").toISOString();

      const response = await apiClient.get(
        `/schedules?startDate=${startDate}&endDate=${endDate}`
      );
      if (response.data.success) {
        setSchedules(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchWeeklySchedules(),
          (async () => {
            const [
              recentCustomersRes,
              recentContractsRes,
              ongoingContractsRes,
              completedContractsRes,
            ] = await Promise.all([
              apiClient.get<StatisticsResponse>("/statics/recent-customers"),
              apiClient.get<StatisticsResponse>("/statics/recent-contracts"),
              apiClient.get<StatisticsResponse>("/statics/ongoing-contracts"),
              apiClient.get<StatisticsResponse>("/statics/completed-contracts"),
            ]);

            if (recentCustomersRes.data.success) {
              setRecentCustomers(recentCustomersRes.data.data);
            }
            if (recentContractsRes.data.success) {
              setRecentContracts(recentContractsRes.data.data);
            }
            if (ongoingContractsRes.data.success) {
              setOngoingContracts(ongoingContractsRes.data.data);
            }
            if (completedContractsRes.data.success) {
              setCompletedContracts(completedContractsRes.data.data);
            }
          })(),
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 주간 이동 시 일정 다시 불러오기
  useEffect(() => {
    fetchWeeklySchedules();
  }, [selectedDate]);

  // 신규 설문 리스트 불러오기 함수
  const fetchSurveyResponses = async () => {
    try {
      const response = await apiClient.get("/surveys/responses", {
        params: {
          page: 0,
          size: 5,
        },
      });
      // 배열 데이터 추출
      const items =
        (response.data &&
          Array.isArray(response.data.data) &&
          response.data.data) ||
        (response.data &&
          Array.isArray(response.data.content) &&
          response.data.content) ||
        (Array.isArray(response.data) && response.data) ||
        [];
      setSurveyResponses(items);
      return items;
    } catch (error) {
      console.error("Failed to fetch survey responses:", error);
      setSurveyResponses([]); // 에러 시에도 빈 배열로
      return [];
    }
  };

  useEffect(() => {
    fetchSurveyResponses();
  }, []);

  // 이전 주로 이동
  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  // 다음 주로 이동
  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  // 현재 주의 날짜 범위 표시
  const currentWeekRange = () => {
    const start = dayjs(selectedDate).startOf("week");
    const end = dayjs(selectedDate).endOf("week");
    return `${start.format("YYYY.MM.DD")} ~ ${end.format("YYYY.MM.DD")}`;
  };

  // 현재 주의 날짜들 가져오기
  const getWeekDates = () => {
    const start = dayjs(selectedDate).startOf("week");
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(start.add(i, "day"));
    }
    return dates;
  };

  // 요일 이름 가져오기
  const getDayName = (date: dayjs.Dayjs) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.day()];
  };

  // 일정 타입별 색상 반환 (고객 ID 기반)
  const getScheduleColor = (customerUid: number | null) => {
    const colors = [
      "#cce7fc", // 파랑
      "#e3f1db", // 초록
      "#ffe4c4", // 주황
      "#f8d7e3", // 분홍
    ];
    return colors[(customerUid || 0) % colors.length];
  };

  // 상담 탭 변경 핸들러
  const handleConsultationTabChange = (
    event: React.SyntheticEvent,
    newValue: "request" | "latest"
  ) => {
    setConsultationTab(newValue);
  };

  // 계약 탭 변경 핸들러
  const handleContractTabChange = (
    event: React.SyntheticEvent,
    newValue: "expiring" | "recent"
  ) => {
    setContractTab(newValue);
  };

  // 계약 목록 리스트를 가져오는 함수 (탭에 따라 쿼리 파라미터 다르게)
  useEffect(() => {
    const fetchAllContracts = async () => {
      setContractLoading(true);
      try {
        const [expiringRes, recentRes] = await Promise.all([
          apiClient.get("/contracts", {
            params: {
              page: 0,
              size: 5,
              sortFields: JSON.stringify({ contractEndDate: "DESC" }),
              period: "6개월 이내",
            },
          }),
          apiClient.get("/contracts", {
            params: {
              page: 0,
              size: 5,
              sortFields: JSON.stringify({ createdAt: "DESC" }),
            },
          }),
        ]);
        setExpiringContracts(expiringRes.data?.data?.contracts ?? []);
        setRecentContracts(recentRes.data?.data?.contracts ?? []);
      } catch (e) {
        setExpiringContracts([]);
        setRecentContracts([]);
      } finally {
        setContractLoading(false);
      }
    };
    fetchAllContracts();
  }, []);

  // 더보기 클릭 핸들러
  const handleMoreClick = (daySchedules: Schedule[], dayStr: string) => {
    setSelectedDaySchedules(daySchedules);
    setSelectedDayStr(dayStr);
    setMoreModalOpen(true);
  };

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleSaveSchedule = async (updatedSchedule: Schedule) => {
    try {
      const response = await apiClient.patch(
        `/schedules/${updatedSchedule.uid}`,
        updatedSchedule
      );
      if (response.data.success) {
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.uid === updatedSchedule.uid ? updatedSchedule : schedule
          )
        );
        setIsDetailModalOpen(false);
        setSelectedSchedule(null);
      }
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  // 상담 리스트를 가져오는 함수 추가
  const fetchCounselList = async (customerUid: number) => {
    setCounselLoading(true);
    try {
      const response = await apiClient.get(
        `/customers/${customerUid}/counsels?page=0&size=5`,
        {
          params: {
            page: 0,
            size: 5,
          },
        }
      );
      // 실제 데이터 구조에 따라 data/content/루트 배열 등에서 추출
      const items =
        (response.data &&
          Array.isArray(response.data.data) &&
          response.data.data) ||
        (response.data &&
          Array.isArray(response.data.content) &&
          response.data.content) ||
        (Array.isArray(response.data) && response.data) ||
        [];
      setCounselList(items);
      return items;
    } catch (error) {
      console.error("Failed to fetch counsel list:", error);
      setCounselList([]);
      return [];
    } finally {
      setCounselLoading(false);
    }
  };

  // 컴포넌트 마운트 시 상담 리스트 불러오기 (예시: customerUid=1)
  useEffect(() => {
    fetchCounselList(1);
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#f5f5f5",
        p: 0,
      }}
    >
      <PageHeader title="대시보드" userName="사용자 이름" />

      <Box sx={{ p: 3, pt: 0 }}>
        {/* 통계 카드 영역 */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 2,
            mt: 2,
          }}
        >
          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                md: "1 1 calc(25% - 12px)",
              },
              height: "120px",
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",
                borderRadius: "16px",
                backgroundColor: "#fff",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PersonAddIcon sx={{ fontSize: 32, color: "#222222" }} />
                  <Typography
                    variant="subtitle1"
                    component="h2"
                    sx={{ ml: 2, color: "#222222", fontWeight: "bold" }}
                  >
                    최근 유입 고객 수
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "baseline" }}>
                    {isLoading ? (
                      <Typography
                        variant="h5"
                        component="p"
                        sx={{ fontWeight: "bold", color: "#164F9E" }}
                      >
                        -
                      </Typography>
                    ) : (
                      <Typography
                        variant="h5"
                        component="p"
                        sx={{
                          fontWeight: "bold",
                          color: "#164F9E",
                          ...(recentCustomers > 0 && {
                            cursor: "pointer",
                            textDecoration: "underline",
                            "&:hover": {
                              color: "#0D3B7A",
                            },
                          }),
                        }}
                        onClick={() =>
                          recentCustomers > 0 && navigate("/customers")
                        }
                      >
                        {recentCustomers}
                      </Typography>
                    )}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ ml: 1, color: "#222222" }}
                    >
                      명
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                md: "1 1 calc(25% - 12px)",
              },
              height: "120px",
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",
                borderRadius: "16px",
                backgroundColor: "#fff",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AssignmentIcon sx={{ fontSize: 32, color: "#222222" }} />
                  <Typography
                    variant="subtitle1"
                    component="h2"
                    sx={{ ml: 2, color: "#222222", fontWeight: "bold" }}
                  >
                    최근 계약 건수
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "baseline" }}>
                    {isLoading ? (
                      <Typography
                        variant="h5"
                        component="p"
                        sx={{ fontWeight: "bold", color: "#164F9E" }}
                      >
                        -
                      </Typography>
                    ) : (
                      <Typography
                        variant="h5"
                        component="p"
                        sx={{
                          fontWeight: "bold",
                          color: "#164F9E",
                          ...(recentContracts.length > 0 && {
                            cursor: "pointer",
                            textDecoration: "underline",
                            "&:hover": {
                              color: "#0D3B7A",
                            },
                          }),
                        }}
                        onClick={() =>
                          recentContracts.length > 0 && navigate("/contracts")
                        }
                      >
                        {recentContracts.length}
                      </Typography>
                    )}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ ml: 1, color: "#222222" }}
                    >
                      건
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                md: "1 1 calc(25% - 12px)",
              },
              height: "120px",
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",
                borderRadius: "16px",
                backgroundColor: "#fff",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <DonutLargeIcon sx={{ fontSize: 32, color: "#222222" }} />
                  <Typography
                    variant="subtitle1"
                    component="h2"
                    sx={{ ml: 2, color: "#222222", fontWeight: "bold" }}
                  >
                    진행중인 계약 건수
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "baseline" }}>
                    {isLoading ? (
                      <Typography
                        variant="h5"
                        component="p"
                        sx={{ fontWeight: "bold", color: "#164F9E" }}
                      >
                        -
                      </Typography>
                    ) : (
                      <Typography
                        variant="h5"
                        component="p"
                        sx={{
                          fontWeight: "bold",
                          color: "#164F9E",
                          ...(ongoingContracts > 0 && {
                            cursor: "pointer",
                            textDecoration: "underline",
                            "&:hover": {
                              color: "#0D3B7A",
                            },
                          }),
                        }}
                        onClick={() =>
                          ongoingContracts > 0 && navigate("/contracts")
                        }
                      >
                        {ongoingContracts}
                      </Typography>
                    )}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ ml: 1, color: "#222222" }}
                    >
                      건
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                md: "1 1 calc(25% - 12px)",
              },
              height: "120px",
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",
                borderRadius: "16px",
                backgroundColor: "#fff",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 32, color: "#222222" }} />
                  <Typography
                    variant="subtitle1"
                    component="h2"
                    sx={{ ml: 2, color: "#222222", fontWeight: "bold" }}
                  >
                    완료된 계약 건수
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "baseline" }}>
                    {isLoading ? (
                      <Typography
                        variant="h5"
                        component="p"
                        sx={{ fontWeight: "bold", color: "#164F9E" }}
                      >
                        -
                      </Typography>
                    ) : (
                      <Typography
                        variant="h5"
                        component="p"
                        sx={{
                          fontWeight: "bold",
                          color: "#164F9E",
                          ...(completedContracts > 0 && {
                            cursor: "pointer",
                            textDecoration: "underline",
                            "&:hover": {
                              color: "#0D3B7A",
                            },
                          }),
                        }}
                        onClick={() =>
                          completedContracts > 0 && navigate("/contracts")
                        }
                      >
                        {completedContracts}
                      </Typography>
                    )}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ ml: 1, color: "#222222" }}
                    >
                      건
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* 캘린더와 문의 리스트 영역 */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", lg: "row" },
            minWidth: 0,
          }}
        >
          {/* 캘린더 */}
          <Card
            sx={{
              width: { xs: "100%", lg: "60%" },
              boxShadow: "none",
              borderRadius: "16px",
              backgroundColor: "#fff",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#164F9E", fontWeight: "bold" }}
                  >
                    주간 일정
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {currentWeekRange()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    onClick={() => navigate("/schedules")}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 0.5,
                      border: "1px solid #164F9E",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "#164F9E",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#164F9E",
                        color: "#fff",
                      },
                    }}
                  >
                    <Typography variant="body2">전체 일정 보기</Typography>
                  </Box>
                  <IconButton
                    onClick={handlePrevWeek}
                    size="small"
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "rgba(22, 79, 158, 0.04)",
                      },
                    }}
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </IconButton>
                  <Box
                    onClick={() => setSelectedDate(new Date())}
                    sx={{
                      px: 2,
                      py: 0.5,
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(22, 79, 158, 0.04)",
                      },
                    }}
                  >
                    <Typography variant="body2">오늘</Typography>
                  </Box>
                  <IconButton
                    onClick={handleNextWeek}
                    size="small"
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "rgba(22, 79, 158, 0.04)",
                      },
                    }}
                  >
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* 일정 표시 */}
              <TableContainer
                component={Paper}
                sx={{
                  mt: 2,
                  boxShadow: "none",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      {getWeekDates().map((date) => (
                        <TableCell
                          key={date.format("YYYY-MM-DD")}
                          align="center"
                          sx={{
                            fontWeight: "bold",
                            color:
                              date.day() === 0
                                ? "#d10000"
                                : date.day() === 6
                                ? "#164f9e"
                                : "#333",
                            borderBottom: "1px solid #e0e0e0",
                            width: `${100 / 7}%`,
                            py: 1,
                          }}
                        >
                          {getDayName(date)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ height: "400px" }}>
                      {getWeekDates().map((date) => (
                        <TableCell
                          key={date.format("YYYY-MM-DD")}
                          sx={{
                            verticalAlign: "top",
                            p: 1,
                            position: "relative",
                            borderRight: "1px solid #e0e0e0",
                            "&:last-child": {
                              borderRight: "none",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#666",
                              mb: 1,
                              textAlign: "center",
                            }}
                          >
                            {date.format("DD")}
                          </Typography>
                          {(() => {
                            const daySchedules = schedules.filter(
                              (schedule) =>
                                dayjs(schedule.startDate).format(
                                  "YYYY-MM-DD"
                                ) === date.format("YYYY-MM-DD")
                            );

                            if (daySchedules.length === 0) return null;

                            return (
                              <>
                                {daySchedules.slice(0, 3).map((schedule) => (
                                  <Box
                                    key={schedule.uid}
                                    onClick={() =>
                                      handleScheduleClick(schedule)
                                    }
                                    sx={{
                                      p: 1,
                                      mb: 1,
                                      borderRadius: 1,
                                      backgroundColor: getScheduleColor(
                                        schedule.customerUid
                                      ),
                                      cursor: "pointer",
                                      "&:hover": {
                                        filter: "brightness(0.95)",
                                      },
                                      fontSize: "0.875rem",
                                      border: "1px solid rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: "bold",
                                        fontSize: "0.75rem",
                                        color: "#666",
                                      }}
                                    >
                                      {dayjs(schedule.startDate).format(
                                        "HH:mm"
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "#333",
                                      }}
                                    >
                                      {schedule.title}
                                      {schedule.customerName &&
                                        ` - ${schedule.customerName}`}
                                    </Typography>
                                  </Box>
                                ))}
                                {daySchedules.length > 3 && (
                                  <Box
                                    onClick={() =>
                                      handleMoreClick(
                                        daySchedules,
                                        date.format("YYYY-MM-DD")
                                      )
                                    }
                                    sx={{
                                      p: 1,
                                      borderRadius: 1,
                                      backgroundColor: "#f5f5f5",
                                      cursor: "pointer",
                                      textAlign: "center",
                                      "&:hover": {
                                        backgroundColor: "#e0e0e0",
                                      },
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: "#666",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      +{daySchedules.length - 3}개 더보기
                                    </Typography>
                                  </Box>
                                )}
                              </>
                            );
                          })()}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* 문의 리스트 */}
          <Card
            sx={{
              width: { xs: "100%", lg: "40%" },
              boxShadow: "none",
              borderRadius: "16px",
              backgroundColor: "#fff",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
              >
                신규 설문
              </Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>고객명</TableCell>
                      <TableCell>연락처</TableCell>
                      <TableCell>제출일</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(surveyResponses) &&
                    surveyResponses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          신규 설문이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      Array.isArray(surveyResponses) &&
                      surveyResponses.map((inquiry) => (
                        <TableRow
                          key={inquiry.id}
                          hover
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "rgba(22, 79, 158, 0.04)",
                            },
                          }}
                        >
                          <TableCell>{inquiry.customerName}</TableCell>
                          <TableCell>{inquiry.phoneNumber}</TableCell>
                          <TableCell>{inquiry.submittedDate}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* 계약 및 상담 영역 */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* 계약 현황 */}
          <Card
            sx={{
              flex: { xs: "1 1 100%", lg: 1 },
              display: "flex",
              flexDirection: "column",
              maxHeight: { xs: "500px", lg: "600px" },
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "16px",
              backgroundColor: "#fff",
            }}
          >
            <CardContent
              sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0 }}
            >
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ color: "#164F9E", fontWeight: "bold", mb: 2 }}
                >
                  계약
                </Typography>
                <Tabs
                  value={contractTab}
                  onChange={handleContractTabChange}
                  sx={{
                    minHeight: 36,
                    "& .MuiTab-root": {
                      minHeight: 36,
                      textTransform: "none",
                      fontSize: "0.875rem",
                      fontWeight: "medium",
                      color: "#666",
                      "&.Mui-selected": {
                        color: "#164F9E",
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#164F9E",
                    },
                  }}
                >
                  <Tab value="expiring" label="만료 예정 계약" />
                  <Tab value="recent" label="최근 계약" />
                </Tabs>
              </Box>

              <TableContainer sx={{ flex: 1, overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>고객명</TableCell>
                      <TableCell>거래 타입</TableCell>
                      <TableCell>계약 종료일</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(() => {
                      const contractList =
                        contractTab === "expiring"
                          ? expiringContracts
                          : recentContracts;
                      if (contractLoading) {
                        return (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              불러오는 중...
                            </TableCell>
                          </TableRow>
                        );
                      } else if (
                        Array.isArray(contractList) &&
                        contractList.length === 0
                      ) {
                        return (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              계약이 없습니다.
                            </TableCell>
                          </TableRow>
                        );
                      } else {
                        return (
                          Array.isArray(contractList) &&
                          contractList.map((contract: Contract) => (
                            <TableRow key={contract.uid} hover>
                              <TableCell>
                                {contract.lessorOrSellerName}
                                {contract.lesseeOrBuyerName &&
                                contract.lesseeOrBuyerName !==
                                  contract.lessorOrSellerName
                                  ? ` / ${contract.lesseeOrBuyerName}`
                                  : ""}
                              </TableCell>
                              <TableCell>
                                {contract.category === "SALE"
                                  ? "매매"
                                  : contract.category === "LEASE"
                                  ? "임대"
                                  : contract.category}
                              </TableCell>
                              <TableCell>{contract.contractEndDate}</TableCell>
                            </TableRow>
                          ))
                        );
                      }
                    })()}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* 상담 현황 */}
          <Card
            sx={{
              flex: { xs: "1 1 100%", lg: 1 },
              display: "flex",
              flexDirection: "column",
              maxHeight: { xs: "500px", lg: "600px" },
              boxShadow: "none",
              borderRadius: "16px",
              backgroundColor: "#fff",
            }}
          >
            <CardContent
              sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0 }}
            >
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ color: "#164F9E", fontWeight: "bold", mb: 2 }}
                >
                  상담
                </Typography>
                <Tabs
                  value={consultationTab}
                  onChange={handleConsultationTabChange}
                  sx={{
                    minHeight: 36,
                    "& .MuiTab-root": {
                      minHeight: 36,
                      textTransform: "none",
                      fontSize: "0.875rem",
                      fontWeight: "medium",
                      color: "#666",
                      "&.Mui-selected": {
                        color: "#164F9E",
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#164F9E",
                    },
                  }}
                >
                  <Tab value="request" label="의뢰일 임박순" />
                  <Tab value="latest" label="최신순" />
                </Tabs>
              </Box>

              <TableContainer sx={{ flex: 1, overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>상담 일시</TableCell>
                      <TableCell>고객명</TableCell>
                      <TableCell>상담 제목</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {counselLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          불러오는 중...
                        </TableCell>
                      </TableRow>
                    ) : Array.isArray(counselList) &&
                      counselList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          상담이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      Array.isArray(counselList) &&
                      counselList.map((consultation: Consultation) => (
                        <TableRow
                          key={consultation.id}
                          hover
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>
                            {dayjs(consultation.consultationDate).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </TableCell>
                          <TableCell>{consultation.customerName}</TableCell>
                          <TableCell>{consultation.title}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 더보기 모달 */}
      <Dialog
        open={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#164F9E" }}
          >
            {selectedDayStr} 일정 목록
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          {selectedDaySchedules.map((schedule) => (
            <Box
              key={schedule.uid}
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 1,
                backgroundColor: getScheduleColor(schedule.customerUid),
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {schedule.title}
                </Typography>
                {schedule.customerName && (
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      color: "#666",
                    }}
                  >
                    - {schedule.customerName}
                  </Typography>
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                }}
              >
                {dayjs(schedule.startDate).format("HH:mm")} ~{" "}
                {dayjs(schedule.endDate).format("HH:mm")}
              </Typography>
              {schedule.description && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: "#666",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {schedule.description}
                </Typography>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setMoreModalOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: "#164F9E",
              "&:hover": {
                backgroundColor: "#0D3B7A",
              },
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 일정 상세보기 모달 */}
      <ScheduleDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        schedule={selectedSchedule}
        onSave={handleSaveSchedule}
      />
    </Box>
  );
};

export default DashboardPage;
