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
  Chip,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import "./DashboardPage.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import PageHeader from "@components/PageHeader/PageHeader";

interface Schedule {
  id: number;
  title: string;
  date: Date;
  time: string;
  type: "meeting" | "task" | "event";
  description?: string;
}

interface Contract {
  id: number;
  customerName: string;
  customerTypes: ("임대" | "임차" | "매도" | "매수")[];
  endDate: Date;
  category: string;
  status: "active" | "expiring" | "recent";
}

interface Consultation {
  id: number;
  customerName: string;
  title: string;
  consultationDate: Date;
  requestDate: Date;
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

  // 샘플 일정 데이터
  const schedules: Schedule[] = [
    // 월요일 일정
    {
      id: 1,
      title: "고객 미팅",
      date: dayjs().startOf("week").add(1, "day").toDate(),
      time: "10:00",
      type: "meeting",
      description: "신규 고객 상담",
    },
    {
      id: 2,
      title: "프로젝트 회의",
      date: dayjs().startOf("week").add(1, "day").toDate(),
      time: "14:00",
      type: "meeting",
      description: "주간 프로젝트 진행상황 점검",
    },
    // 화요일 일정
    {
      id: 3,
      title: "문서 작성",
      date: dayjs().startOf("week").add(2, "day").toDate(),
      time: "09:00",
      type: "task",
      description: "월간 보고서 작성",
    },
    {
      id: 4,
      title: "팀 워크샵",
      date: dayjs().startOf("week").add(2, "day").toDate(),
      time: "15:00",
      type: "event",
      description: "팀 빌딩 활동",
    },
    // 수요일 일정
    {
      id: 5,
      title: "코드 리뷰",
      date: dayjs().startOf("week").add(3, "day").toDate(),
      time: "11:00",
      type: "task",
      description: "신규 기능 코드 리뷰",
    },
    // 목요일 일정
    {
      id: 6,
      title: "고객 교육",
      date: dayjs().startOf("week").add(4, "day").toDate(),
      time: "13:00",
      type: "event",
      description: "신규 기능 사용법 교육",
    },
    // 금요일 일정
    {
      id: 7,
      title: "주간 정리",
      date: dayjs().startOf("week").add(5, "day").toDate(),
      time: "16:00",
      type: "task",
      description: "주간 업무 정리 및 보고",
    },
    // 토요일 일정
    {
      id: 8,
      title: "팀 미팅",
      date: dayjs().startOf("week").add(6, "day").toDate(),
      time: "10:00",
      type: "meeting",
      description: "주간 팀 미팅",
    },
  ];

  // 샘플 계약 데이터
  const contracts: Contract[] = [
    {
      id: 1,
      customerName: "김부동산",
      customerTypes: ["임대", "매도"],
      endDate: dayjs().add(7, "day").toDate(),
      category: "상가",
      status: "expiring",
    },
    {
      id: 2,
      customerName: "이건설",
      customerTypes: ["임차"],
      endDate: dayjs().add(30, "day").toDate(),
      category: "아파트",
      status: "active",
    },
    {
      id: 3,
      customerName: "박개발",
      customerTypes: ["매수"],
      endDate: dayjs().add(60, "day").toDate(),
      category: "토지",
      status: "active",
    },
    {
      id: 4,
      customerName: "최투자",
      customerTypes: ["임대", "임차", "매도"],
      endDate: dayjs().subtract(5, "day").toDate(),
      category: "오피스텔",
      status: "recent",
    },
    {
      id: 5,
      customerName: "정개발",
      customerTypes: ["매수", "임차"],
      endDate: dayjs().subtract(2, "day").toDate(),
      category: "빌딩",
      status: "recent",
    },
  ];

  // 샘플 상담 데이터
  const consultations: Consultation[] = [
    {
      id: 1,
      customerName: "김부동산",
      title: "상가 임대 문의",
      consultationDate: dayjs().add(2, "day").toDate(),
      requestDate: dayjs().subtract(1, "day").toDate(),
    },
    {
      id: 2,
      customerName: "이건설",
      title: "아파트 분양 상담",
      consultationDate: dayjs().add(5, "day").toDate(),
      requestDate: dayjs().subtract(3, "day").toDate(),
    },
    {
      id: 3,
      customerName: "박개발",
      title: "토지 매매 문의",
      consultationDate: dayjs().add(1, "day").toDate(),
      requestDate: dayjs().subtract(2, "day").toDate(),
    },
    {
      id: 4,
      customerName: "최투자",
      title: "오피스텔 임대 상담",
      consultationDate: dayjs().add(3, "day").toDate(),
      requestDate: dayjs().subtract(4, "day").toDate(),
    },
  ];

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

  // 임시 데이터 - 실제로는 API에서 받아와야 함
  const stats = {
    recentContracts: 12,
    ongoingContracts: 8,
    completedContracts: 24,
    newCustomers: 5,
  };

  const statCards = [
    {
      title: "최근 계약 건수",
      value: stats.recentContracts,
      icon: <AssignmentIcon sx={{ fontSize: 40, color: "#222222" }} />,
      unit: "건",
      isContract: true,
    },
    {
      title: "진행중인 계약 건수",
      value: stats.ongoingContracts,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#222222" }} />,
      unit: "건",
      isContract: true,
    },
    {
      title: "완료 계약 건수",
      value: stats.completedContracts,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#222222" }} />,
      unit: "건",
      isContract: true,
    },
    {
      title: "최근 유입 고객 수",
      value: stats.newCustomers,
      icon: <PersonAddIcon sx={{ fontSize: 40, color: "#222222" }} />,
      unit: "건",
      isContract: false,
    },
  ];

  // 임시 문의 데이터
  const inquiries = [
    {
      id: 1,
      customerName: "김철수",
      phoneNumber: "010-1234-5678",
      submittedDate: "2024-03-20",
      isRead: true,
    },
    {
      id: 2,
      customerName: "이영희",
      phoneNumber: "010-2345-6789",
      submittedDate: "2024-03-19",
      isRead: false,
    },
    {
      id: 3,
      customerName: "박지민",
      phoneNumber: "010-3456-7890",
      submittedDate: "2024-03-19",
      isRead: false,
    },
    {
      id: 4,
      customerName: "최유진",
      phoneNumber: "010-4567-8901",
      submittedDate: "2024-03-18",
      isRead: true,
    },
  ];

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

  // 일정 타입별 색상 반환
  const getScheduleColor = (type: Schedule["type"]) => {
    switch (type) {
      case "meeting":
        return "#e3f2fd";
      case "task":
        return "#f1f8e9";
      case "event":
        return "#fff3e0";
      default:
        return "#f5f5f5";
    }
  };

  // 계약 타입별 색상
  const getContractTypeColor = (type: string) => {
    switch (type) {
      case "임대":
        return "#e3f2fd";
      case "임차":
        return "#f1f8e9";
      case "매도":
        return "#fff3e0";
      case "매수":
        return "#fce4ec";
      default:
        return "#f5f5f5";
    }
  };

  // 상담 탭 변경 핸들러
  const handleConsultationTabChange = (
    event: React.SyntheticEvent,
    newValue: "request" | "latest"
  ) => {
    setConsultationTab(newValue);
  };

  // 정렬된 상담 데이터 반환
  const getSortedConsultations = () => {
    return [...consultations].sort((a, b) => {
      if (consultationTab === "request") {
        return dayjs(a.requestDate).diff(dayjs(b.requestDate));
      } else {
        return dayjs(b.consultationDate).diff(dayjs(a.consultationDate));
      }
    });
  };

  // 계약 탭 변경 핸들러
  const handleContractTabChange = (
    event: React.SyntheticEvent,
    newValue: "expiring" | "recent"
  ) => {
    setContractTab(newValue);
  };

  // 계약 필터링 함수
  const getFilteredContracts = () => {
    return contracts.filter((contract) => contract.status === contractTab);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        width: "calc(100% - 240px)",
        ml: "240px",
        backgroundColor: "#f5f5f5",
        p: 0,
      }}
    >
      <PageHeader title="대시보드" userName="사용자 이름" />

      {/* 통계 카드 영역 */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2,
          mt: 2,
          px: 3,
        }}
      >
        {statCards.map((card, index) => (
          <Box
            key={index}
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
                  {card.icon}
                  <Typography
                    variant="subtitle1"
                    component="h2"
                    sx={{ ml: 2, color: "#222222", fontWeight: "bold" }}
                  >
                    {card.title}
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "baseline" }}>
                    <Typography
                      variant="h5"
                      component="p"
                      sx={{
                        fontWeight: "bold",
                        color: "#164F9E",
                        ...(card.isContract &&
                          card.value > 0 && {
                            cursor: "pointer",
                            textDecoration: "underline",
                            "&:hover": {
                              color: "#0D3B7A",
                            },
                          }),
                      }}
                      onClick={() => {
                        if (card.isContract && card.value > 0) {
                          navigate("/contracts");
                        }
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ ml: 1, color: "#222222" }}
                    >
                      {card.unit}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
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
                        {schedules
                          .filter(
                            (schedule) =>
                              dayjs(schedule.date).format("YYYY-MM-DD") ===
                              date.format("YYYY-MM-DD")
                          )
                          .map((schedule) => (
                            <Box
                              key={schedule.id}
                              sx={{
                                p: 1,
                                mb: 1,
                                borderRadius: 1,
                                backgroundColor: getScheduleColor(
                                  schedule.type
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
                                {schedule.time}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: "bold",
                                  color: "#333",
                                }}
                              >
                                {schedule.title}
                              </Typography>
                            </Box>
                          ))}
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
                    <TableCell>상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inquiries.map((inquiry) => (
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
                      <TableCell>
                        <Chip
                          label={inquiry.isRead ? "읽음" : "미읽음"}
                          color={inquiry.isRead ? "default" : "primary"}
                          size="small"
                          sx={{
                            backgroundColor: inquiry.isRead
                              ? "#e0e0e0"
                              : "#164F9E",
                            color: inquiry.isRead ? "#666" : "white",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableCell>고객 타입</TableCell>
                    <TableCell>계약 종료일</TableCell>
                    <TableCell>카테고리</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredContracts().map((contract) => (
                    <TableRow
                      key={contract.id}
                      hover
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{contract.customerName}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {contract.customerTypes.map((type, index) => (
                            <Chip
                              key={index}
                              label={type}
                              size="small"
                              sx={{
                                backgroundColor: getContractTypeColor(type),
                                color: "#333",
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {dayjs(contract.endDate).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>{contract.category}</TableCell>
                    </TableRow>
                  ))}
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
                  {getSortedConsultations().map((consultation) => (
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;
