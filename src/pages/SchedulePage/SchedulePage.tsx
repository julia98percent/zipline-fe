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
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg, DatesSetArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import CreateModal, { FormData } from "@components/CreateModal/CreateModal";
import apiClient from "@apis/apiClient";
import PageHeader from "@components/PageHeader/PageHeader";

interface Schedule {
  uid: number;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  customerUid: number | null;
  customerName: string | null;
}

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedules = async (startDate: string, endDate: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/api/v1/schedules`, {
        params: {
          startDate,
          endDate,
        },
      });

      if (response.data.success) {
        setSchedules(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    const start = dayjs(arg.start).startOf("month").toISOString();
    const end = dayjs(arg.end).endOf("month").toISOString();
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
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.uid !== id));
    handleCloseDetailModal();
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
      <PageHeader title="일정 관리" userName="사용자 이름" />

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
          events={calendarEvents}
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
