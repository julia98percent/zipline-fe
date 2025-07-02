import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import { Schedule } from "@ts/schedule";
import { showToast } from "@components/Toast";
import {
  fetchSchedulesByDateRange,
  createSchedule,
  updateSchedule,
} from "@apis/scheduleService";
import ScheduleView from "./ScheduleView";
import { SCHEDULE_ERROR_MESSAGES } from "@constants/clientErrorMessage";

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
  const [dayMaxEvents, setDayMaxEvents] = useState(6);

  const fetchSchedules = async (startDate: string, endDate: string) => {
    try {
      const scheduleList = await fetchSchedulesByDateRange({
        startDate,
        endDate,
      });
      setSchedules(scheduleList);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      showToast({
        message: SCHEDULE_ERROR_MESSAGES.FETCH_FAILED,
        type: "error",
      });
    }
  };

  useEffect(() => {
    const calculateDayMaxEvents = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDayMaxEvents(2);
      } else if (width < 1024) {
        setDayMaxEvents(3);
      } else {
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
      const result = await createSchedule(formData);

      if (result.success) {
        const startOfMonth = dayjs().startOf("month").toISOString();
        const endOfMonth = dayjs().endOf("month").toISOString();
        await fetchSchedules(startOfMonth, endOfMonth);

        showToast({
          message: result.message || "일정이 성공적으로 등록되었습니다.",
          type: "success",
        });
        setIsAddModalOpen(false);
      } else {
        showToast({
          message: result.message || "일정 등록에 실패했습니다.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to create schedule:", error);
      showToast({ message: SCHEDULE_ERROR_MESSAGES.ADD_FAILED, type: "error" });
    }
  };

  const handleUpdateSchedule = async (updatedSchedule: Schedule) => {
    try {
      setIsUpdating(true);
      const { uid, customerName, ...scheduleForApi } = updatedSchedule;
      void customerName;

      const result = await updateSchedule(uid, scheduleForApi);

      if (result.success) {
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.uid === updatedSchedule.uid ? updatedSchedule : schedule
          )
        );
        handleCloseDetailModal();
        showToast({
          message: result.message || "일정이 성공적으로 업데이트되었습니다.",
          type: "success",
        });
      } else {
        console.error("Update failed:", result.message);
        showToast({
          message: result.message || "일정 업데이트에 실패했습니다.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to update schedule:", error);
      showToast({
        message: SCHEDULE_ERROR_MESSAGES.UPDATE_FAILED,
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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

  const events: CalendarEvent[] = schedules.map((schedule) => {
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

  const viewProps = {
    state: {
      isAddModalOpen,
      isDetailModalOpen,
      selectedSchedule,
      schedules,
      isUpdating,
      dayMaxEvents,
      events,
    },
    handlers: {
      handleDatesSet,
      handleAddSchedule,
      handleCloseModal,
      handleScheduleClick,
      handleCloseDetailModal,
      handleSubmitSchedule,
      handleUpdateSchedule,
    },
  };

  return <ScheduleView {...viewProps} />;
};

export default SchedulePage;
