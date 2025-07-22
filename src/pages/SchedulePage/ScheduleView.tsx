import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import dayjs from "dayjs";
import PageHeader from "@components/PageHeader/PageHeader";
import ScheduleDetailModal from "@components/ScheduleDetailModal/ScheduleDetailModal";
import AddScheduleModal from "./AddScheduleModal";
import Button from "@components/Button";
import { useResponsiveCalendar } from "@hooks/useResponsiveCalendar";
import { Schedule } from "@ts/schedule";

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
  onMobileMenuToggle?: () => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({
  state,
  handlers,
  onMobileMenuToggle,
}) => {
  const { calendarConfig, calendarRef } = useResponsiveCalendar();

  const {
    isAddModalOpen,
    isDetailModalOpen,
    isEditMode,
    selectedSchedule,
    isUpdating,
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

  useEffect(() => {
    const addCalendarButtonStyles = () => {
      const existingStyle = document.getElementById("calendar-button-styles");
      if (existingStyle) return;

      const style = document.createElement("style");
      style.id = "calendar-button-styles";
      style.textContent = `
        .fc-toolbar-chunk .fc-button {
          background: none !important;
          border: none !important;
          color: #374151 !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          transition: background-color 0.2s ease !important;
        }
        .fc-toolbar-chunk .fc-button:hover {
          background-color: #f3f4f6 !important;
        }
        .fc-toolbar-chunk .fc-button:focus {
          box-shadow: none !important;
        }
        .fc-toolbar-chunk .fc-button-active {
          background-color: #e5e7eb !important;
        }
      `;
      document.head.appendChild(style);
    };

    addCalendarButtonStyles();

    // 컴포넌트 언마운트 시 스타일 제거
    return () => {
      const style = document.getElementById("calendar-button-styles");
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="flex-grow bg-gray-100 min-h-screen">
      <PageHeader title="일정" onMobileMenuToggle={onMobileMenuToggle} />

      <div className="p-5">
        {/* Add Schedule Button */}
        <div className="flex justify-end mb-5">
          <Button onClick={handleAddSchedule}>
            <AddIcon fontSize="small" />
            일정 등록
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleScheduleClick}
            datesSet={handleDatesSet}
            headerToolbar={{
              left: "title",
              center: "",
              right: "prev,today,next",
            }}
            contentHeight={calendarConfig.contentHeight}
            locale={koLocale}
            dayMaxEvents={calendarConfig.dayMaxEvents}
            moreLinkContent={({ num }) => `+${num}개`}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            initialDate={dayjs().format("YYYY-MM-DD")}
            fixedWeekCount={false}
            showNonCurrentDates={true}
            eventDisplay="block"
            eventMinHeight={calendarConfig.eventMinHeight}
            moreLinkClick="popover"
            dayPopoverFormat={{
              month: "long",
              day: "numeric",
              year: "numeric",
            }}
            weekNumbers={false}
            dayHeaders={true}
            eventClassNames={(arg) => {
              const colors = [
                "bg-blue-500 text-white",
                "bg-green-500 text-white",
                "bg-purple-500 text-white",
                "bg-orange-500 text-white",
                "bg-pink-500 text-white",
                "bg-indigo-500 text-white",
              ];
              return colors[parseInt(arg.event.id) % colors.length];
            }}
            eventDidMount={(info) => {
              const width = window.innerWidth;
              if (width < 640) {
                // 모바일에서만 제목 길이 제한
                const titleEl = info.el.querySelector(".fc-event-title");
                if (titleEl?.textContent && titleEl.textContent.length > 8) {
                  titleEl.textContent =
                    titleEl.textContent.substring(0, 8) + "...";
                }
                // 시간 숨기기
                const timeEl = info.el.querySelector(
                  ".fc-event-time"
                ) as HTMLElement;
                if (timeEl) timeEl.style.display = "none";
              }
            }}
            windowResizeDelay={100}
          />
        </div>
      </div>

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
    </div>
  );
};

export default ScheduleView;
