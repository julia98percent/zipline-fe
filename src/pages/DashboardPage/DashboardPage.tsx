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
  Chip,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import "./DashboardPage.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useNavigate } from "react-router-dom";
import PageHeader from "@components/PageHeader/PageHeader";
import apiClient from "@apis/apiClient";
import ScheduleDetailModal from "@components/ScheduleDetailModal/ScheduleDetailModal";
import SurveyDetailModal from "@components/PreCounselDetailModal";
import { Schedule } from "../../interfaces/schedule";
import { formatDate } from "@utils/dateUtil";
import RecentCustomersModal from "./RecentCustomersModal";
import RecentContractsModal from "./RecentContractsModal";
import OngoingContractsModal from "./OngoingContractsModal";
import CompletedContractsModal from "./CompletedContractsModal";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Contract {
  uid: number;
  lessorOrSellerNames: string[];
  lesseeOrBuyerNames: string[];
  category: "SALE" | "DEPOSIT" | "MONTHLY" | null;
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status: string;
  address: string;
}

interface counsel {
  completed: boolean;
  counselDate: Date;
  counselUid: number;
  customerName: string;
  dueDate: string;
  propertyUid: number;
  title: string;
  type: string;
}

interface counselResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    counsels: counsel[];
  };
}

interface StatisticsResponse {
  success: boolean;
  code: number;
  message: string;
  data: number;
}

interface SurveyResponse {
  id: number;
  name: string;
  phoneNumber: string;
  submittedAt: string;
  surveyResponseUid: number;
}

interface SurveyDetail {
  surveyResponseUid: number;
  title: string;
  submittedAt: string;
  customerUid: number | null;
  answers: {
    questionUid: number;
    questionTitle: string;
    description: string;
    questionType: string;
    answer: string;
    choices: string[];
    required: boolean;
  }[];
}

const SURVEY_PAGE_SIZE = 10;

const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [counselTab, setcounselTab] = useState<"request" | "latest">("request");
  const [contractTab, setContractTab] = useState<"expiring" | "recent">(
    "expiring"
  );
  const navigate = useNavigate();
  const [recentCustomers, setRecentCustomers] = useState<number>(0);
  const [recentContractsCount, setRecentContractsCount] = useState<number>(0);
  const [recentContracts, setRecentContracts] = useState<Contract[]>([]);
  const [recentContractsList, setRecentContractsList] = useState<Contract[]>(
    []
  );
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
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [expiringContracts, setExpiringContracts] = useState<Contract[]>([]);
  const [contractLoading, setContractLoading] = useState(true);
  const [counselListByDueDate, setCounselListByDueDate] = useState<counsel[]>(
    []
  );
  const [counselListByLatest, setCounselListByLatest] = useState<counsel[]>([]);
  const [counselLoading, setCounselLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyDetail | null>(
    null
  );
  const [isSurveyDetailModalOpen, setIsSurveyDetailModalOpen] = useState(false);
  const [surveyDetailLoading, setSurveyDetailLoading] = useState(false);
  const [isRecentCustomersModalOpen, setIsRecentCustomersModalOpen] =
    useState(false);
  const [recentContractsModalOpen, setRecentContractsModalOpen] =
    useState(false);
  const [recentContractsLoading, setRecentContractsLoading] = useState(false);
  const [recentContractsPage, setRecentContractsPage] = useState(0);
  const [recentContractsRowsPerPage, setRecentContractsRowsPerPage] =
    useState(10);
  const [ongoingContractsOpen, setOngoingContractsOpen] = useState(false);
  const [ongoingContractsList, setOngoingContractsList] = useState<Contract[]>(
    []
  );
  const [ongoingContractsPage, setOngoingContractsPage] = useState(0);
  const [ongoingContractsRowsPerPage, setOngoingContractsRowsPerPage] =
    useState(10);
  const [ongoingContractsLoading, setOngoingContractsLoading] = useState(false);
  const [ongoingContractsTotalCount, setOngoingContractsTotalCount] =
    useState(0);
  const [completedContractsOpen, setCompletedContractsOpen] = useState(false);
  const [completedContractsList, setCompletedContractsList] = useState<
    Contract[]
  >([]);
  const [completedContractsPage, setCompletedContractsPage] = useState(0);
  const [completedContractsRowsPerPage, setCompletedContractsRowsPerPage] =
    useState(10);
  const [completedContractsLoading, setCompletedContractsLoading] =
    useState(false);
  const [completedContractsTotalCount, setCompletedContractsTotalCount] =
    useState(0);

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
              recentContractsCountRes,
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
            if (recentContractsCountRes.data.success) {
              setRecentContractsCount(recentContractsCountRes.data.data);
            }
            if (ongoingContractsRes.data.success) {
              setOngoingContracts(ongoingContractsRes.data.data);
            }
            if (completedContractsRes.data.success) {
              setCompletedContracts(completedContractsRes.data.data);
            }

            // 최근 계약 목록 초기 데이터 로딩
            const recentContractsListRes = await apiClient.get("/contracts", {
              params: { recent: true, page: 1, size: 10 },
            });
            setRecentContracts(
              recentContractsListRes.data?.data?.contracts ?? []
            );
            setRecentContractsCount(
              recentContractsListRes.data?.data?.totalElements ?? 0
            );
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
  const fetchSurveyResponses = async (): Promise<void> => {
    try {
      const response = await apiClient.get("/surveys/responses", {
        params: {
          page: 0,
          size: SURVEY_PAGE_SIZE,
        },
      });

      const { surveyResponses } = response.data.data;
      setSurveyResponses(surveyResponses ?? []);
    } catch (error) {
      setSurveyResponses([]);
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
  const handlecounselTabChange = (
    event: React.SyntheticEvent,
    newValue: "request" | "latest"
  ) => {
    setcounselTab(newValue);
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
        const expiringContracts = expiringRes.data?.data?.contracts ?? [];
        const recentContracts = recentRes.data?.data?.contracts ?? [];
        setExpiringContracts(expiringContracts);
        setRecentContractsList(recentContracts);
        setRecentContractsCount(recentContracts.length);
      } catch {
        setExpiringContracts([]);
        setRecentContractsList([]);
        setRecentContractsCount(0);
      } finally {
        setContractLoading(false);
      }
    };
    fetchAllContracts();
  }, []);

  // 최근 계약 목록을 가져오는 함수
  const fetchRecentContracts = async (page: number) => {
    setRecentContractsLoading(true);
    try {
      const response = await apiClient.get("/contracts", {
        params: {
          recent: true,
          page: page + 1, // 0-based를 1-based로 변환
          size: recentContractsRowsPerPage,
        },
      });
      const contracts = response.data?.data?.contracts ?? [];
      const totalElements = response.data?.data?.totalElements ?? 0;
      setRecentContracts(contracts);
      setRecentContractsCount(totalElements);
    } catch (error) {
      console.error("Failed to fetch recent contracts:", error);
      setRecentContracts([]);
      setRecentContractsCount(0);
    } finally {
      setRecentContractsLoading(false);
    }
  };

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
      // customerName을 제거하여 API에 전달
      const { customerName, ...scheduleForApi } = updatedSchedule;
      void customerName;
      const response = await apiClient.patch(
        `/schedules/${updatedSchedule.uid}`,
        scheduleForApi
      );
      if (response.data.success) {
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.uid === updatedSchedule.uid ? updatedSchedule : schedule
          )
        );
        setIsDetailModalOpen(false);
        setSelectedSchedule(null);
        setToast({
          open: true,
          message: "일정이 성공적으로 수정되었습니다.",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Failed to update schedule:", error);
      setToast({
        open: true,
        message: "일정 수정에 실패했습니다.",
        severity: "error",
      });
    }
  };

  const fetchCounselLists = async () => {
    setCounselLoading(true);
    try {
      const [dueDateResponse, latestResponse] = await Promise.all([
        apiClient.get<counselResponse>(
          "/dashboard/counsels?sortType=DUE_DATE&page=0&size=5"
        ),
        apiClient.get<counselResponse>(
          "/dashboard/counsels?sortType=LATEST&page=0&size=5"
        ),
      ]);

      if (dueDateResponse.data.success) {
        setCounselListByDueDate(dueDateResponse.data.data?.counsels || []);
      }
      if (latestResponse.data.success) {
        setCounselListByLatest(latestResponse.data.data?.counsels || []);
      }
    } catch (error) {
      console.error("Error fetching counsel lists:", error);
      setCounselListByDueDate([]);
      setCounselListByLatest([]);
    } finally {
      setCounselLoading(false);
    }
  };

  // 컴포넌트 마운트 시 상담 목록 불러오기
  useEffect(() => {
    fetchCounselLists();
  }, []);

  // 현재 선택된 탭에 따라 보여줄 상담 목록 계산
  const currentCounselList = useMemo(() => {
    return counselTab === "request"
      ? counselListByDueDate
      : counselListByLatest;
  }, [counselTab, counselListByDueDate, counselListByLatest]);

  // 상담 상세 페이지로 이동하는 핸들러 추가
  const handleCounselClick = (counselId: number) => {
    console.log(counselId);
    navigate(`/counsels/${counselId}`);
  };

  const handleSurveyClick = async (surveyResponseUid: number) => {
    setSurveyDetailLoading(true);
    setIsSurveyDetailModalOpen(true);
    try {
      const response = await apiClient.get(
        `/surveys/responses/${surveyResponseUid}`
      );
      if (response.data.success) {
        setSelectedSurvey(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch survey detail:", error);
      setToast({
        open: true,
        message: "설문 상세 내용을 불러오는데 실패했습니다.",
        severity: "error",
      });
    } finally {
      setSurveyDetailLoading(false);
    }
  };

  const handleCloseSurveyDetailModal = () => {
    setIsSurveyDetailModalOpen(false);
    setSelectedSurvey(null);
  };

  // 최근 계약 건수 카드 클릭 핸들러
  const handleRecentContractsClick = () => {
    setRecentContractsPage(0); // 0-based로 초기화
    fetchRecentContracts(0);
    setRecentContractsModalOpen(true);
  };

  const fetchOngoingContracts = useCallback(async () => {
    try {
      setOngoingContractsLoading(true);
      const response = await apiClient.get("/contracts", {
        params: {
          progress: true,
          page: ongoingContractsPage + 1,
          size: ongoingContractsRowsPerPage,
        },
      });

      if (response.data.success) {
        setOngoingContractsList(response.data.data.contracts);
        setOngoingContractsTotalCount(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch ongoing contracts:", error);
    } finally {
      setOngoingContractsLoading(false);
    }
  }, [ongoingContractsPage, ongoingContractsRowsPerPage]);

  useEffect(() => {
    if (ongoingContractsOpen) {
      fetchOngoingContracts();
    }
  }, [ongoingContractsOpen, fetchOngoingContracts]);

  const fetchCompletedContracts = useCallback(async () => {
    try {
      setCompletedContractsLoading(true);
      const response = await apiClient.get("/contracts", {
        params: {
          progress: false,
          page: completedContractsPage + 1,
          size: completedContractsRowsPerPage,
        },
      });
      if (response.data.success) {
        setCompletedContractsList(response.data.data.contracts);
        setCompletedContractsTotalCount(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch completed contracts:", error);
    } finally {
      setCompletedContractsLoading(false);
    }
  }, [completedContractsPage, completedContractsRowsPerPage]);

  useEffect(() => {
    if (completedContractsOpen) {
      fetchCompletedContracts();
    }
  }, [completedContractsOpen]);

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
      <PageHeader title="대시보드" />

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
                md: "1 1 calc(50% - 12px)",
                lg: "1 1 calc(25% - 12px)",
              },
              height: "120px",
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                borderRadius: "6px",
                backgroundColor: "#fff",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            >
              <CardContent
                onClick={() => setIsRecentCustomersModalOpen(true)}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                  "&:hover": { cursor: "pointer" },
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
                      <CircularProgress />
                    ) : (
                      <>
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
                        >
                          {recentCustomers}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ ml: 1, color: "#222222" }}
                        >
                          명
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                md: "1 1 calc(50% - 12px)",
                lg: "1 1 calc(25% - 12px)",
              },
              height: "120px",
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                borderRadius: "6px",
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
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={handleRecentContractsClick}
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
                      <CircularProgress />
                    ) : (
                      <>
                        <Typography
                          variant="h5"
                          component="p"
                          sx={{
                            fontWeight: "bold",
                            color: "#164F9E",
                            ...(recentContractsCount > 0 && {
                              cursor: "pointer",
                              textDecoration: "underline",
                              "&:hover": {
                                color: "#0D3B7A",
                              },
                            }),
                          }}
                        >
                          {recentContractsCount}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ ml: 1, color: "#222222" }}
                        >
                          명
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                md: "1 1 calc(50% - 12px)",
                lg: "1 1 calc(25% - 12px)",
              },
              height: "120px",
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                borderRadius: "6px",
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
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() =>
                  ongoingContracts > 0 && setOngoingContractsOpen(true)
                }
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
                      <CircularProgress />
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
                md: "1 1 calc(50% - 12px)",
                lg: "1 1 calc(25% - 12px)",
              },
              height: "120px",
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                borderRadius: "6px",
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
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => setCompletedContractsOpen(true)}
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
                      <CircularProgress />
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
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
              borderRadius: "6px",
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
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
              borderRadius: "6px",
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
              <TableContainer sx={{ maxHeight: 480, overflow: "auto" }}>
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
                        <TableCell colSpan={3} align="center">
                          신규 설문이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      Array.isArray(surveyResponses) &&
                      surveyResponses.map((res) => (
                        <TableRow
                          key={res.id}
                          hover
                          onClick={() =>
                            handleSurveyClick(res.surveyResponseUid)
                          }
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "rgba(22, 79, 158, 0.04)",
                            },
                          }}
                        >
                          <TableCell>{res.name}</TableCell>
                          <TableCell>{res.phoneNumber}</TableCell>
                          <TableCell>{formatDate(res.submittedAt)}</TableCell>
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
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
              borderRadius: "6px",
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
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
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
                    <Tab
                      value="expiring"
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          만료 예정 계약
                          <Tooltip
                            title="6개월 이내 만료 예정인 계약이 표시됩니다."
                            arrow
                          >
                            <HelpOutlineIcon
                              sx={{ fontSize: 16, color: "#164F9E" }}
                            />
                          </Tooltip>
                        </Box>
                      }
                    />
                    <Tab value="recent" label="최근 계약" />
                  </Tabs>
                </Box>
              </Box>

              <TableContainer
                sx={{ flex: 1, overflow: "auto", paddingX: "16px" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>임대/매도자</TableCell>
                      <TableCell>임차/매수자</TableCell>
                      <TableCell>거래 타입</TableCell>
                      <TableCell>계약 종료일</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(() => {
                      const contractList =
                        contractTab === "expiring"
                          ? expiringContracts
                          : recentContractsList;
                      if (contractLoading) {
                        return (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              불러오는 중...
                            </TableCell>
                          </TableRow>
                        );
                      }
                      if (
                        Array.isArray(contractList) &&
                        contractList.length === 0
                      ) {
                        return (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              {contractTab === "expiring"
                                ? "6개월 이내 만료 예정인 계약이 없습니다."
                                : "계약이 없습니다."}
                            </TableCell>
                          </TableRow>
                        );
                      } else {
                        return (
                          Array.isArray(contractList) &&
                          contractList.map((contract: Contract) => (
                            <TableRow
                              key={contract.uid}
                              hover
                              sx={{ cursor: "pointer" }}
                              onClick={() =>
                                navigate(`/contracts/${contract.uid}`)
                              }
                            >
                              <TableCell>
                                {Array.isArray(contract.lessorOrSellerNames)
                                  ? contract.lessorOrSellerNames.length === 0
                                    ? "-"
                                    : contract.lessorOrSellerNames.length === 1
                                    ? contract.lessorOrSellerNames[0]
                                    : `${contract.lessorOrSellerNames[0]} 외 ${
                                        contract.lessorOrSellerNames.length - 1
                                      }명`
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {Array.isArray(contract.lesseeOrBuyerNames)
                                  ? contract.lesseeOrBuyerNames.length === 0
                                    ? "-"
                                    : contract.lesseeOrBuyerNames.length === 1
                                    ? contract.lesseeOrBuyerNames[0]
                                    : `${contract.lesseeOrBuyerNames[0]} 외 ${
                                        contract.lesseeOrBuyerNames.length - 1
                                      }명`
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {contract.category === "SALE" ? (
                                  <Chip
                                    label="매매"
                                    variant="outlined"
                                    sx={{
                                      color: "#388e3c",
                                      borderColor: "#388e3c",
                                      fontWeight: 500,
                                      height: 26,
                                      fontSize: 13,
                                    }}
                                  />
                                ) : contract.category === "DEPOSIT" ? (
                                  <Chip
                                    label="전세"
                                    variant="outlined"
                                    sx={{
                                      color: "#1976d2",
                                      borderColor: "#1976d2",
                                      fontWeight: 500,
                                      height: 26,
                                      fontSize: 13,
                                    }}
                                  />
                                ) : contract.category === "MONTHLY" ? (
                                  <Chip
                                    label="월세"
                                    variant="outlined"
                                    sx={{
                                      color: "#f57c00",
                                      borderColor: "#f57c00",
                                      fontWeight: 500,
                                      height: 26,
                                      fontSize: 13,
                                    }}
                                  />
                                ) : (
                                  "-"
                                )}
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
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
              borderRadius: "6px",
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
                  value={counselTab}
                  onChange={handlecounselTabChange}
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
                  <Tab
                    value="request"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        의뢰일 임박 순
                        <Tooltip
                          title="2주 이내 의뢰 마감 예정인 상담이 표시됩니다."
                          arrow
                        >
                          <HelpOutlineIcon
                            sx={{ fontSize: 16, color: "#164F9E" }}
                          />
                        </Tooltip>
                      </Box>
                    }
                  />
                  <Tab value="latest" label="최신순" />
                </Tabs>
              </Box>

              <TableContainer
                sx={{ flex: 1, overflow: "auto", paddingX: "16px" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>고객명</TableCell>
                      <TableCell>상담 제목</TableCell>
                      <TableCell>상담 일시</TableCell>
                      <TableCell>의뢰 마감일</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {counselLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          불러오는 중...
                        </TableCell>
                      </TableRow>
                    ) : !currentCounselList ||
                      currentCounselList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          상담이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentCounselList.map((counsel: counsel) => (
                        <TableRow
                          key={counsel.counselUid}
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleCounselClick(counsel.counselUid)}
                        >
                          <TableCell>{counsel.customerName}</TableCell>
                          <TableCell>{counsel.title}</TableCell>
                          <TableCell>
                            {dayjs(counsel.counselDate).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell>
                            {dayjs(counsel.dueDate).format("YYYY-MM-DD")}
                          </TableCell>
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
      {/* 설문 상세 모달 */}
      <SurveyDetailModal
        open={isSurveyDetailModalOpen}
        onClose={handleCloseSurveyDetailModal}
        surveyDetail={selectedSurvey}
        isLoading={surveyDetailLoading}
      />
      {/* 최근 유입 고객 모달 */}
      <RecentCustomersModal
        open={isRecentCustomersModalOpen}
        onClose={() => setIsRecentCustomersModalOpen(false)}
        surveyResponses={surveyResponses}
        onSurveyClick={handleSurveyClick}
      />
      {/* 최근 계약 목록 모달 */}
      <RecentContractsModal
        open={recentContractsModalOpen}
        onClose={() => {
          setRecentContractsModalOpen(false);
          setRecentContractsPage(0); // 0-based로 초기화
          setRecentContractsRowsPerPage(10);
        }}
        contracts={recentContracts}
        loading={recentContractsLoading}
        totalCount={recentContractsCount}
        page={recentContractsPage}
        rowsPerPage={recentContractsRowsPerPage}
        onPageChange={(newPage) => {
          setRecentContractsPage(newPage);
          fetchRecentContracts(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRecentContractsRowsPerPage(newRowsPerPage);
          setRecentContractsPage(0);
          fetchRecentContracts(0);
        }}
      />
      {/* Ongoing Contracts Modal */}
      <OngoingContractsModal
        open={ongoingContractsOpen}
        onClose={() => {
          setOngoingContractsOpen(false);
          setOngoingContractsPage(0);
          setOngoingContractsRowsPerPage(10);
        }}
        contracts={ongoingContractsList}
        loading={ongoingContractsLoading}
        totalCount={ongoingContractsTotalCount}
        page={ongoingContractsPage}
        rowsPerPage={ongoingContractsRowsPerPage}
        onPageChange={(newPage) => {
          setOngoingContractsPage(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setOngoingContractsRowsPerPage(newRowsPerPage);
          setOngoingContractsPage(0);
        }}
      />
      {/* Completed Contracts Modal */}
      <CompletedContractsModal
        open={completedContractsOpen}
        onClose={() => {
          setCompletedContractsOpen(false);
          setCompletedContractsPage(0);
          setCompletedContractsRowsPerPage(10);
        }}
        contracts={completedContractsList}
        loading={completedContractsLoading}
        totalCount={completedContractsTotalCount}
        page={completedContractsPage}
        rowsPerPage={completedContractsRowsPerPage}
        onPageChange={(newPage) => {
          setCompletedContractsPage(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setCompletedContractsRowsPerPage(newRowsPerPage);
          setCompletedContractsPage(0);
        }}
      />
    </Box>
  );
};

export default DashboardPage;
