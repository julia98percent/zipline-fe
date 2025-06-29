import { useState, useEffect } from "react";
import { Box, Paper, Button } from "@mui/material";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import apiClient from "@apis/apiClient";
import PageHeader from "@components/PageHeader/PageHeader";
import ScheduleDetailModal from "@components/ScheduleDetailModal/ScheduleDetailModal";
import { Schedule } from "@ts/schedule";
import AddScheduleModal from "./AddScheduleModal";
import { showToast } from "@components/Toast/Toast";

interface ScheduleFormData {
  startDateTime: string;
  endDateTime: string;
  title: string;
  description: string;
  customerUid: number | null;
}

const SchedulePage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dayMaxEvents, setDayMaxEvents] = useState(4);

  const fetchSchedules = (startDate: string, endDate: string) => {
    apiClient
      .get(`/schedules?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => {
        setSchedules(res.data.data);
      });
  };

  useEffect(() => {
    const calculateDayMaxEvents = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // 모바일
        setDayMaxEvents(2);
      } else if (width < 1024) {
        // 태블릿
        setDayMaxEvents(3);
      } else {
        // 데스크톱
        setDayMaxEvents(4);
      }
    };

    calculateDayMaxEvents();
    window.addEventListener("resize", calculateDayMaxEvents);

    return () => {
      window.removeEventListener("resize", calculateDayMaxEvents);
    };
  }, []);

  useEffect(() => {
    // 초기 로드 시 현재 달의 첫날과 마지막날을 기준으로 일정을 가져옴
    const startOfMonth = dayjs().startOf("month").toISOString();
    const endOfMonth = dayjs().endOf("month").toISOString();
    fetchSchedules(startOfMonth, endOfMonth);
  }, []);

  const handleDatesSet = (arg: DatesSetArg) => {
    const start = dayjs(arg.start).toISOString();
    const end = dayjs(arg.end).subtract(1, "day").toISOString();
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

  const handleSubmitSchedule = async (formData: ScheduleFormData) => {
    try {
      const response = await apiClient.post("/schedules", formData);

      if (response.data.success) {
        // 현재 표시된 기간의 일정을 다시 불러옴
        const startOfMonth = dayjs().startOf("month").toISOString();
        const endOfMonth = dayjs().endOf("month").toISOString();
        fetchSchedules(startOfMonth, endOfMonth);

        showToast({ message: "일정을 등록했습니다.", type: "success" });
        setIsAddModalOpen(false);
      }
    } catch {
      showToast({ message: "일정 등록에 실패했습니다.", type: "error" });
    }
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
        showToast({
          message: "일정을 수정했습니다.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Failed to update schedule:", error);
      showToast({
        message: "일정 수정에 실패했습니다.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <PageHeader title="일정" />

      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 3, mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSchedule}
          sx={{
            backgroundColor: "#164F9E",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#0D3B7A",
              boxShadow: "none",
            },
          }}
        >
          일정 등록
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mx: 3,
          mt: 3,

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
          dayMaxEvents={dayMaxEvents}
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

      <AddScheduleModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSchedule}
      />

      <ScheduleDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        schedule={selectedSchedule}
        onSave={handleUpdateSchedule}
        isUpdating={isUpdating}
      />
    </Box>
  );
};

export default SchedulePage;
