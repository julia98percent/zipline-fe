import { useState, useEffect } from "react";
import { Box, Paper, Button, Snackbar, Alert } from "@mui/material";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import CreateModal, { FormData } from "@components/CreateModal/CreateModal";
import apiClient from "@apis/apiClient";
import PageHeader from "@components/PageHeader/PageHeader";
import ScheduleDetailModal from "@components/ScheduleDetailModal/ScheduleDetailModal";
import { Schedule } from "../../interfaces/schedule";

const SchedulePage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [customers] = useState<Array<{ uid: number; name: string }>>([
    { uid: 1, name: "김지원" },
    { uid: 2, name: "이민수" },
    { uid: 3, name: "박서연" },
    { uid: 4, name: "최준호" },
    { uid: 5, name: "정미영" },
    { uid: 6, name: "강동현" },
    { uid: 7, name: "윤서아" },
    { uid: 8, name: "임재현" },
    { uid: 9, name: "한지민" },
    { uid: 10, name: "송현우" },
    { uid: 11, name: "조은지" },
    { uid: 12, name: "백승민" },
    { uid: 13, name: "신예진" },
    { uid: 14, name: "류태준" },
    { uid: 15, name: "홍서영" },
    { uid: 16, name: "문준서" },
    { uid: 17, name: "양미주" },
    { uid: 18, name: "고동욱" },
    { uid: 19, name: "배수진" },
    { uid: 20, name: "서진우" },
    { uid: 21, name: "남궁민" },
    { uid: 22, name: "오하윤" },
    { uid: 23, name: "구민재" },
    { uid: 24, name: "황지현" },
    { uid: 25, name: "안성민" },
    { uid: 26, name: "전유진" },
    { uid: 27, name: "권도현" },
    { uid: 28, name: "유승현" },
    { uid: 29, name: "차민서" },
    { uid: 30, name: "허준영" },
    { uid: 31, name: "노현주" },
    { uid: 32, name: "민서연" },
    { uid: 33, name: "김태호" },
    { uid: 34, name: "이수민" },
    { uid: 35, name: "박진아" },
    { uid: 36, name: "최우진" },
    { uid: 37, name: "정다운" },
    { uid: 38, name: "강민지" },
    { uid: 39, name: "윤도현" },
    { uid: 40, name: "임수진" },
    { uid: 41, name: "한승우" },
    { uid: 42, name: "송지은" },
    { uid: 43, name: "조현우" },
    { uid: 44, name: "백지원" },
    { uid: 45, name: "신동현" },
    { uid: 46, name: "류미란" },
    { uid: 47, name: "홍준기" },
    { uid: 48, name: "문서연" },
    { uid: 49, name: "양준호" },
    { uid: 50, name: "고은서" },
    { uid: 51, name: "배민수" },
    { uid: 52, name: "서유진" },
    { uid: 53, name: "남궁현" },
    { uid: 54, name: "오태준" },
    { uid: 55, name: "구지민" },
    { uid: 56, name: "황서준" },
    { uid: 57, name: "안미영" },
    { uid: 58, name: "전준호" },
    { uid: 59, name: "권서아" },
    { uid: 60, name: "유재현" },
    { uid: 61, name: "차지민" },
    { uid: 62, name: "허현우" },
    { uid: 63, name: "노은지" },
    { uid: 64, name: "민승민" },
    { uid: 65, name: "김예진" },
    { uid: 66, name: "이태준" },
    { uid: 67, name: "박서영" },
    { uid: 68, name: "최준서" },
    { uid: 69, name: "정미주" },
    { uid: 70, name: "강동욱" },
    { uid: 71, name: "윤수진" },
    { uid: 72, name: "임진우" },
    { uid: 73, name: "한민재" },
    { uid: 74, name: "송지현" },
    { uid: 75, name: "조성민" },
    { uid: 76, name: "백유진" },
    { uid: 77, name: "신도현" },
    { uid: 78, name: "류승현" },
    { uid: 79, name: "홍민서" },
    { uid: 80, name: "문준영" },
    { uid: 81, name: "양현주" },
    { uid: 82, name: "고서연" },
    { uid: 83, name: "배태호" },
    { uid: 84, name: "서수민" },
    { uid: 85, name: "남궁진아" },
    { uid: 86, name: "오우진" },
    { uid: 87, name: "구다운" },
    { uid: 88, name: "황민지" },
    { uid: 89, name: "안도현" },
    { uid: 90, name: "전수진" },
    { uid: 91, name: "권승우" },
    { uid: 92, name: "유지은" },
    { uid: 93, name: "차현우" },
    { uid: 94, name: "허지원" },
    { uid: 95, name: "노동현" },
    { uid: 96, name: "민미란" },
    { uid: 97, name: "김준기" },
    { uid: 98, name: "이서연" },
    { uid: 99, name: "박준호" },
    { uid: 100, name: "최은서" },
  ]);

  const fetchSchedules = (startDate: string, endDate: string) => {
    apiClient
      .get(`/schedules?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => {
        setSchedules(res.data.data);
      });
  };

  useEffect(() => {
    // 초기 로드 시 현재 달의 첫날과 마지막날을 기준으로 일정을 가져옴
    const startOfMonth = dayjs().startOf("month").toISOString();
    const endOfMonth = dayjs().endOf("month").toISOString();
    fetchSchedules(startOfMonth, endOfMonth);
  }, []);

  const handleDatesSet = (arg: DatesSetArg) => {
    const start = dayjs(arg.start).toISOString();
    const end = dayjs(arg.end).subtract(1, "day").toISOString();
    console.log(start, end);
    fetchSchedules(start, end);
  };

  const handleAddSchedule = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
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
    setTimeout(() => {
      setSelectedSchedule(null);
    }, 200);
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

  // 고객별 색상 매핑
  const getCustomerColor = (customerUid: number | null) => {
    const colors = [
      "#cce7fc", // 파랑
      "#e3f1db", // 초록
      "#ffe4c4", // 주황
      "#f8d7e3", // 분홍
    ];
    return {
      backgroundColor: colors[(customerUid || 0) % colors.length],
      borderColor: "rgba(0,0,0,0.15)",
    };
  };

  const events = schedules.map((schedule) => {
    const colorInfo = getCustomerColor(schedule.customerUid);
    return {
      id: schedule.uid.toString(),
      title:
        schedule.title +
        (schedule.customerName ? ` - ${schedule.customerName}` : ""),
      start: schedule.startDate,
      end: schedule.endDate,
      description: schedule.description,
      extendedProps: {
        customerUid: schedule.customerUid,
        customerName: schedule.customerName,
        startTime: dayjs(schedule.startDate).format("HH:mm"),
      },
      backgroundColor: colorInfo.backgroundColor,
      borderColor: colorInfo.borderColor,
      textColor: "#333333",
    };
  });

  console.log("Calendar events:", events);

  const handleUpdateSchedule = async (updatedSchedule: Schedule) => {
    try {
      setIsUpdating(true);
      // uid와 customerName을 제거하여 API에 전달
      const { uid, customerName, ...scheduleForApi } = updatedSchedule;
      void uid;
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
        handleCloseDetailModal();
        setToast({
          open: true,
          message: "일정을 수정했습니다.",
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
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
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
      <PageHeader title="일정" userName="사용자 이름" />

      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 3, mt: 2 }}>
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
              paddingTop: "80%",
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
            padding: "0",
            flex: "0 0 auto",
          },
          "& .fc-daygrid-day-events": {
            padding: "0 2px",
            flex: 1,
            minHeight: 0,
            marginTop: "-6px",
            paddingTop: "0",
          },
          "& .fc-daygrid-day-bottom": {
            padding: "0",
            flex: "0 0 auto",
          },
          "& .fc .fc-button": {
            padding: "4px 8px",
            fontSize: "1rem",
            backgroundColor: "transparent",
            border: "none",
            color: "#666666",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#164F9E",
              transform: "scale(1.1)",
            },
            "&:focus": {
              boxShadow: "none",
            },
            "&.fc-button-active": {
              backgroundColor: "transparent",
              color: "#164F9E",
            },
          },
          "& .fc .fc-toolbar-title": {
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#164F9E",
            margin: "0 12px",
            minWidth: "140px",
            textAlign: "center",
          },
          "& .fc .fc-day": {
            fontSize: "1.1rem",
          },
          "& .fc .fc-event": {
            padding: "1px 2px",
            fontSize: "0.9rem",
            minHeight: "20px",
            marginBottom: "0",
          },
          "& .fc .fc-daygrid-more-link": {
            fontSize: "0.9rem",
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
          "& .fc-more-popover": {
            transform: "translateY(-20px)",
          },
          "& .fc-popover": {
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxHeight: "400px",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          },
          "& .fc-popover-header": {
            padding: "8px 12px",
            backgroundColor: "#F8F9FA",
            borderBottom: "1px solid #E0E0E0",
            flex: "0 0 auto",
          },
          "& .fc-popover-body": {
            padding: "8px",
            overflowY: "auto",
            maxHeight: "calc(400px - 41px)", // 전체 높이에서 헤더 높이를 뺀 값
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
              "&:hover": {
                background: "#555",
              },
            },
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleScheduleClick}
          datesSet={handleDatesSet}
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
          dayMaxEvents={4}
          moreLinkContent={({ num }) => `+${num}개 더보기`}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          initialDate={dayjs().format("YYYY-MM-DD")}
          fixedWeekCount={false}
          showNonCurrentDates={true}
          eventDisplay="block"
          eventMinHeight={14}
          eventTextColor="#FFFFFF"
          eventBackgroundColor="rgba(25, 118, 210, 0.8)"
          eventBorderColor="#1565C0"
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

      <ScheduleDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        schedule={selectedSchedule}
        onSave={handleUpdateSchedule}
        customers={customers}
        isUpdating={isUpdating}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          bottom: "24px !important",
        }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{
            width: "100%",
            minWidth: "240px",
            borderRadius: "8px",
            backgroundColor:
              toast.severity === "success" ? "#F6F8FF" : "#FFF5F5",
            color: toast.severity === "success" ? "#164F9E" : "#D32F2F",
            border: `1px solid ${
              toast.severity === "success" ? "#164F9E" : "#D32F2F"
            }`,
            "& .MuiAlert-icon": {
              color: toast.severity === "success" ? "#164F9E" : "#D32F2F",
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SchedulePage;
