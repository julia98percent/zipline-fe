import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import CreateModal, { FormData } from "@components/CreateModal/CreateModal";

interface Schedule {
  uid: number;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  customerUid: number | null;
  customerName: string | null;
}

interface ScheduleResponse {
  success: boolean;
  code: number;
  message: string;
  data: Schedule[];
}

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [createTab, setCreateTab] = useState(3); // 일정 등록 탭이 기본 선택
  const [formData, setFormData] = useState<FormData>({
    property: {
      title: "",
      type: "",
      price: "",
      address: "",
    },
    customer: {
      name: "",
      phone: "",
      email: "",
      type: "",
    },
    contract: {
      customerId: "",
      propertyId: "",
      type: "",
      startDate: "",
      endDate: "",
    },
    schedule: {
      title: "",
      date: "",
      time: "",
      type: "",
      description: "",
    },
    consultation: {
      customerName: "",
      title: "",
      date: "",
      time: "",
      description: "",
    },
  });

  // 더미 데이터 수정
  const [schedules, setSchedules] = useState<Schedule[]>([
    // 4월 첫째 주
    {
      uid: 1,
      title: "월간 팀 미팅",
      description: "4월 목표 및 계획 수립",
      startDate: "2024-04-01T10:00:00",
      endDate: "2024-04-01T12:00:00",
      customerUid: null,
      customerName: null,
    },
    {
      uid: 2,
      title: "김고객 상담",
      description: "신규 계약 상담",
      startDate: "2024-04-01T14:00:00",
      endDate: "2024-04-01T15:00:00",
      customerUid: 1,
      customerName: "김고객",
    },
    // 4월 둘째 주 - 여러 날짜에 걸친 일정
    {
      uid: 3,
      title: "부동산 실사 프로젝트",
      description: "강남구 물건 실사 및 보고서 작성",
      startDate: "2024-04-08T09:00:00",
      endDate: "2024-04-12T18:00:00",
      customerUid: null,
      customerName: null,
    },
    {
      uid: 4,
      title: "박고객 미팅",
      description: "계약 갱신 논의",
      startDate: "2024-04-09T11:00:00",
      endDate: "2024-04-09T12:00:00",
      customerUid: 2,
      customerName: "박고객",
    },
    // 4월 셋째 주 - 하루에 여러 일정
    {
      uid: 5,
      title: "아침 미팅",
      description: "일일 업무 브리핑",
      startDate: "2024-04-15T09:00:00",
      endDate: "2024-04-15T10:00:00",
      customerUid: null,
      customerName: null,
    },
    {
      uid: 6,
      title: "이고객 상담",
      description: "신규 상담",
      startDate: "2024-04-15T10:30:00",
      endDate: "2024-04-15T11:30:00",
      customerUid: 3,
      customerName: "이고객",
    },
    {
      uid: 7,
      title: "점심 회의",
      description: "팀 런치 미팅",
      startDate: "2024-04-15T12:00:00",
      endDate: "2024-04-15T13:00:00",
      customerUid: null,
      customerName: null,
    },
    {
      uid: 8,
      title: "최고객 미팅",
      description: "계약서 검토",
      startDate: "2024-04-15T14:00:00",
      endDate: "2024-04-15T15:00:00",
      customerUid: 4,
      customerName: "최고객",
    },
    {
      uid: 9,
      title: "일일 마감 회의",
      description: "업무 마감 및 내일 일정 조율",
      startDate: "2024-04-15T17:00:00",
      endDate: "2024-04-15T18:00:00",
      customerUid: null,
      customerName: null,
    },
    // 4월 넷째 주 - 연속된 고객 미팅
    {
      uid: 10,
      title: "정고객 미팅",
      description: "투자 상담",
      startDate: "2024-04-22T10:00:00",
      endDate: "2024-04-22T11:00:00",
      customerUid: 5,
      customerName: "정고객",
    },
    {
      uid: 11,
      title: "강고객 미팅",
      description: "계약 체결",
      startDate: "2024-04-22T11:30:00",
      endDate: "2024-04-22T12:30:00",
      customerUid: 6,
      customerName: "강고객",
    },
    // 4월 마지막 주 - 월말 보고
    {
      uid: 12,
      title: "월간 실적 보고",
      description: "4월 실적 보고 및 5월 계획",
      startDate: "2024-04-30T14:00:00",
      endDate: "2024-04-30T16:00:00",
      customerUid: null,
      customerName: null,
    },
  ]);

  // 날짜 셀의 최대 표시 일정 수 설정
  const MAX_VISIBLE_EVENTS = 5;

  // 날짜별 일정 필터링 함수 수정
  const getSchedulesForDate = (date: Dayjs) => {
    const daySchedules = schedules.filter((schedule) => {
      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);
      return (
        date.format("YYYY-MM-DD") === startDate.format("YYYY-MM-DD") ||
        (date.isAfter(startDate, "day") && date.isBefore(endDate, "day")) ||
        date.format("YYYY-MM-DD") === endDate.format("YYYY-MM-DD")
      );
    });

    // 일정이 MAX_VISIBLE_EVENTS개를 초과하는 경우 처리
    if (daySchedules.length > MAX_VISIBLE_EVENTS) {
      return {
        visibleSchedules: daySchedules.slice(0, MAX_VISIBLE_EVENTS),
        remainingCount: daySchedules.length - MAX_VISIBLE_EVENTS,
      };
    }

    return {
      visibleSchedules: daySchedules,
      remainingCount: 0,
    };
  };

  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, "uid">>({
    title: "",
    description: null,
    startDate: "",
    endDate: "",
    customerUid: null,
    customerName: null,
  });

  const handlePrevMonth = () => {
    setSelectedDate(selectedDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setSelectedDate(selectedDate.add(1, "month"));
  };

  const handlePrevYear = () => {
    setSelectedDate(selectedDate.subtract(1, "year"));
  };

  const handleNextYear = () => {
    setSelectedDate(selectedDate.add(1, "year"));
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date.format("YYYY-MM-DD"));
    }
  };

  const handleAddSchedule = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setFormData({
      property: {
        title: "",
        type: "",
        price: "",
        address: "",
      },
      customer: {
        name: "",
        phone: "",
        email: "",
        type: "",
      },
      contract: {
        customerId: "",
        propertyId: "",
        type: "",
        startDate: "",
        endDate: "",
      },
      schedule: {
        title: "",
        date: "",
        time: "",
        type: "",
        description: "",
      },
      consultation: {
        customerName: "",
        title: "",
        date: "",
        time: "",
        description: "",
      },
    });
  };

  const handleScheduleClick = (clickInfo: EventClickArg) => {
    const schedule = schedules.find(
      (s) => s.uid === parseInt(clickInfo.event.id)
    );
    if (schedule) {
      setSelectedSchedule(schedule);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.uid !== id));
    handleCloseDetailModal();
  };

  const handleInputChange = (
    field: keyof Omit<Schedule, "uid">,
    value: string | null
  ) => {
    setNewSchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getSchedulePosition = (schedule: Schedule, date: Dayjs) => {
    const startDate = dayjs(schedule.startDate);
    const endDate = dayjs(schedule.endDate);
    const isStart =
      startDate.format("YYYY-MM-DD") === date.format("YYYY-MM-DD");
    const isEnd = endDate.format("YYYY-MM-DD") === date.format("YYYY-MM-DD");

    if (isStart && isEnd) return "single";
    if (isStart) return "start";
    if (isEnd) return "end";
    return "middle";
  };

  const handleCreateTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setCreateTab(newValue);
  };

  const handleFormChange = (
    section: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmitSchedule = (formData: FormData) => {
    const newScheduleWithId: Schedule = {
      uid: Math.floor(Math.random() * 1000000),
      title: formData.schedule.title,
      description: formData.schedule.description || null,
      startDate: `${formData.schedule.date}T${formData.schedule.time}:00`,
      endDate: `${formData.schedule.date}T${formData.schedule.time}:00`,
      customerUid: null,
      customerName: null,
    };
    setSchedules((prev) => [...prev, newScheduleWithId]);
  };

  // FullCalendar 이벤트 데이터 변환
  const calendarEvents: EventInput[] = schedules.map((schedule) => ({
    id: schedule.uid.toString(),
    title: schedule.title,
    start: schedule.startDate,
    end: schedule.endDate,
    backgroundColor: schedule.customerUid
      ? "rgba(25, 118, 210, 0.8)"
      : "rgba(255, 167, 38, 0.8)",
    borderColor: schedule.customerUid ? "#1565C0" : "#E65100",
    textColor: "#FFFFFF",
    extendedProps: {
      description: schedule.description,
      customerName: schedule.customerName,
    },
  }));

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        ml: "240px",
        width: "calc(100% - 240px)",
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E0E0E0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "70px",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#222222", p: 2 }}
        >
          일정 관리
        </Typography>
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSchedule}
            sx={{
              backgroundColor: "#164F9E",
              "&:hover": {
                backgroundColor: "#0D3B7A",
              },
            }}
          >
            일정 추가
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mx: 3,
          mt: 3,
          border: "1px solid #E0E0E0",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          "& .fc": {
            fontFamily: "Pretendard, sans-serif",
            "--fc-border-color": "#E0E0E0",
            "--fc-button-text-color": "#164F9E",
            "--fc-button-bg-color": "#FFFFFF",
            "--fc-button-border-color": "#164F9E",
            "--fc-button-hover-bg-color": "#164F9E",
            "--fc-button-hover-border-color": "#164F9E",
            "--fc-button-active-bg-color": "#164F9E",
            "--fc-button-active-border-color": "#164F9E",
            "--fc-more-link-text-color": "#666666",
            "--fc-more-link-bg-color": "transparent",
          },
          "& .fc-toolbar": {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "24px !important",
          },
          "& .fc-toolbar-chunk": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .fc-button-group": {
            backgroundColor: "#F8F9FA",
            padding: "4px",
            borderRadius: "8px",
            gap: "2px",
            "& + .fc-button-group": {
              marginLeft: "16px",
            },
          },
          "& .fc-button": {
            textTransform: "none",
            padding: "6px 12px",
            fontWeight: 500,
            backgroundColor: "transparent",
            border: "none",
            color: "#666666",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "#FFFFFF",
              color: "#164F9E",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
            "&:focus": {
              boxShadow: "none",
            },
            "&.fc-button-active": {
              backgroundColor: "#FFFFFF",
              color: "#164F9E",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
          },
          "& .fc-prevYear-button, & .fc-nextYear-button": {
            padding: "6px 10px",
            "& .fc-icon": {
              fontSize: "1.2em",
            },
          },
          "& .fc-prev-button, & .fc-next-button": {
            padding: "6px 10px",
            "& .fc-icon": {
              fontSize: "1.2em",
            },
          },
          "& .fc-toolbar-title": {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#164F9E",
            margin: "0 24px",
            minWidth: "180px",
            textAlign: "center",
          },
          "& .fc-view-harness": {
            minHeight: "600px !important",
          },
          "& .fc-daygrid-day": {
            position: "relative",
            "&::before": {
              content: '""',
              display: "block",
              paddingTop: "100%",
            },
          },
          "& .fc-day-other": {
            backgroundColor: "#F8F9FA",
            "& .fc-daygrid-day-top": {
              opacity: 0.5,
            },
          },
          "& .fc-daygrid-day-frame": {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
          },
          "& .fc-daygrid-day-top": {
            padding: "8px",
            flex: "0 0 auto",
          },
          "& .fc-daygrid-day-events": {
            padding: "0 4px",
            flex: 1,
            minHeight: 0,
          },
          "& .fc-daygrid-day-bottom": {
            padding: "4px",
            flex: "0 0 auto",
          },
          "& .fc .fc-button": {
            padding: "6px 12px",
            fontWeight: 500,
            borderRadius: "6px",
          },
          "& .fc .fc-toolbar-title": {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#164F9E",
          },
          "& .fc .fc-col-header-cell": {
            padding: "12px 0",
            backgroundColor: "#F8F9FA",
          },
          "& .fc .fc-day": {
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: "#F8F9FA",
            },
          },
          "& .fc .fc-event": {
            cursor: "pointer",
            borderRadius: "4px",
            padding: "2px 4px",
            fontSize: "0.75rem",
            fontWeight: 500,
            minHeight: "20px",
            marginBottom: "2px",
          },
          "& .fc .fc-daygrid-more-link": {
            fontSize: "0.75rem",
            fontWeight: 500,
            padding: "2px 4px",
            margin: "0 4px",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#F8F9FA",
              color: "#164F9E",
              textDecoration: "none",
            },
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={schedules.map((schedule) => ({
            id: schedule.uid.toString(),
            title: schedule.title,
            start: schedule.startDate,
            end: schedule.endDate,
            backgroundColor: schedule.customerUid
              ? "rgba(25, 118, 210, 0.8)"
              : "rgba(255, 167, 38, 0.8)",
            borderColor: schedule.customerUid ? "#1565C0" : "#E65100",
            textColor: "#FFFFFF",
            extendedProps: {
              description: schedule.description,
              customerName: schedule.customerName,
            },
          }))}
          eventClick={handleScheduleClick}
          headerToolbar={{
            left: "",
            center: "prevYear prev title next nextYear",
            right: "",
          }}
          buttonIcons={{
            prevYear: "chevrons-left",
            nextYear: "chevrons-right",
            prev: "chevron-left",
            next: "chevron-right",
          }}
          height="auto"
          locale={koLocale}
          dayMaxEvents={3}
          moreLinkContent={({ num }) => `+${num}개 더보기`}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          initialDate="2024-04-01"
          fixedWeekCount={false}
          showNonCurrentDates={true}
          dayCellDidMount={(arg) => {
            const cell = arg.el;
            const width = cell.offsetWidth;
            cell.style.height = `${width}px`;
          }}
        />
      </Paper>

      <CreateModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSchedule}
        initialTab={3}
      />

      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#164F9E",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          일정 상세
          <Box>
            <IconButton
              size="small"
              onClick={() => handleDeleteSchedule(selectedSchedule?.uid || 0)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedSchedule && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6">{selectedSchedule.title}</Typography>
              <Typography variant="body1" color="text.secondary">
                {dayjs(selectedSchedule.startDate).format(
                  "YYYY년 MM월 DD일 HH:mm"
                )}
                {" ~ "}
                {dayjs(selectedSchedule.endDate).format("HH:mm")}
              </Typography>
              {selectedSchedule.customerName && (
                <Typography variant="body1" color="primary">
                  고객명: {selectedSchedule.customerName}
                </Typography>
              )}
              {selectedSchedule.description && (
                <Typography variant="body1">
                  {selectedSchedule.description}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDetailModal} sx={{ color: "#666666" }}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchedulePage;
