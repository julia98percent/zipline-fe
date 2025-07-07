import { Box, Paper, Button } from "@mui/material";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import PageHeader from "@components/PageHeader/PageHeader";
import ScheduleDetailModal from "@components/ScheduleDetailModal/ScheduleDetailModal";
import { Schedule } from "@ts/schedule";
import AddScheduleModal from "./AddScheduleModal";

interface ScheduleFormData {
  startDateTime: string;
  endDateTime: string;
  title: string;
  description: string;
  customerUid: number | null;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string | null;
  extendedProps: {
    customerUid: number | null;
    customerName: string | null;
    startTime: string;
  };
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

interface ScheduleViewProps {
  state: {
    isAddModalOpen: boolean;
    isDetailModalOpen: boolean;
    isEditMode: boolean;
    selectedSchedule: Schedule | null;
    schedules: Schedule[];
    isUpdating: boolean;
    dayMaxEvents: number;
    events: CalendarEvent[];
  };
  handlers: {
    handleDatesSet: (arg: DatesSetArg) => void;
    handleAddSchedule: () => void;
    handleCloseModal: () => void;
    handleScheduleClick: (clickInfo: EventClickArg) => void;
    handleCloseDetailModal: () => void;
    handleEditClick: () => void;
    handleSubmitSchedule: (formData: ScheduleFormData) => Promise<void>;
    handleUpdateSchedule: (updatedSchedule: Schedule) => Promise<void>;
  };
}

const ScheduleView = ({ state, handlers }: ScheduleViewProps) => {
  const {
    isAddModalOpen,
    isDetailModalOpen,
    isEditMode,
    selectedSchedule,
    isUpdating,
    dayMaxEvents,
    events,
  } = state;

  const {
    handleDatesSet,
    handleAddSchedule,
    handleCloseModal,
    handleScheduleClick,
    handleCloseDetailModal,
    handleEditClick,
    handleSubmitSchedule,
    handleUpdateSchedule,
  } = handlers;

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
            maxHeight: "calc(400px - 41px)",
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
        onEdit={handleEditClick}
        isUpdating={isUpdating}
        isEditMode={isEditMode}
      />
    </Box>
  );
};

export default ScheduleView;
