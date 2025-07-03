import { useState, useEffect, useCallback } from "react";
import { Schedule } from "@ts/schedule";
import dayjs from "dayjs";
import { fetchCustomerList } from "@apis/customerService";
import { showToast } from "@components/Toast";

interface Customer {
  uid: number;
  name: string;
}

interface UseScheduleDetailModalProps {
  open: boolean;
  schedule: Schedule | null;
  onSave: (schedule: Schedule) => void;
}

export const useScheduleDetailModal = ({
  open,
  schedule,
  onSave,
}: UseScheduleDetailModalProps) => {
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(
    schedule
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    schedule?.customerUid && schedule?.customerName
      ? {
          uid: schedule.customerUid,
          name: schedule.customerName,
        }
      : null
  );
  const [includeTime, setIncludeTime] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);

  // Initialize form data when schedule changes
  useEffect(() => {
    if (schedule) {
      setEditingSchedule(schedule);
      setSelectedCustomer(
        schedule.customerUid && schedule.customerName
          ? {
              uid: schedule.customerUid,
              name: schedule.customerName,
            }
          : null
      );
      const start = dayjs(schedule.startDate);
      const end = dayjs(schedule.endDate);
      const hasTime =
        start.format("HH:mm") !== "00:00" || end.format("HH:mm") !== "00:00";

      setStartDate(start.format("YYYY-MM-DD"));
      setEndDate(end.format("YYYY-MM-DD"));
      setStartTime(start.format("HH:mm"));
      setEndTime(end.format("HH:mm"));
      setIncludeTime(hasTime);
    }
  }, [schedule]);

  // Fetch customer options
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customers = await fetchCustomerList({
          page: 0,
          size: 1000,
          sortFields: { name: "ASC" },
        });

        const customerOptions = customers.map((c) => ({
          uid: c.uid,
          name: c.name,
        }));
        setCustomerOptions(customerOptions);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        setCustomerOptions([]);
        showToast({
          type: "error",
          message: "고객 목록을 불러오는데 실패했습니다.",
        });
      }
    };

    if (open) {
      fetchCustomers();
    }
  }, [open]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (editingSchedule) {
        setEditingSchedule({
          ...editingSchedule,
          title: e.target.value,
        });
      }
    },
    [editingSchedule]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (editingSchedule) {
        setEditingSchedule({
          ...editingSchedule,
          description: e.target.value,
        });
      }
    },
    [editingSchedule]
  );

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStartDate(e.target.value);
    },
    []
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(e.target.value);
    },
    []
  );

  const handleStartTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStartTime(e.target.value);
    },
    []
  );

  const handleEndTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndTime(e.target.value);
    },
    []
  );

  const handleIncludeTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIncludeTime(e.target.checked);
    },
    []
  );

  const handleCustomerChange = useCallback(
    (_event: React.SyntheticEvent, newValue: Customer | null) => {
      setSelectedCustomer(newValue);
    },
    []
  );

  const validateForm = useCallback(() => {
    if (!editingSchedule?.title.trim()) {
      showToast({
        type: "error",
        message: "제목을 입력해주세요.",
      });
      return false;
    }

    if (!startDate) {
      showToast({
        type: "error",
        message: "시작일을 선택해주세요.",
      });
      return false;
    }

    if (!endDate) {
      showToast({
        type: "error",
        message: "종료일을 선택해주세요.",
      });
      return false;
    }

    const startDateTime = includeTime
      ? dayjs(`${startDate}T${startTime}`)
      : dayjs(startDate);
    const endDateTime = includeTime
      ? dayjs(`${endDate}T${endTime}`)
      : dayjs(endDate);

    if (endDateTime.isBefore(startDateTime)) {
      showToast({
        type: "error",
        message: "종료일시는 시작일시보다 늦어야 합니다.",
      });
      return false;
    }

    return true;
  }, [editingSchedule, startDate, endDate, startTime, endTime, includeTime]);

  const handleSave = useCallback(() => {
    if (!editingSchedule || !validateForm()) return;

    const startDateTime = includeTime
      ? dayjs(`${startDate}T${startTime}`)
      : dayjs(startDate);
    const endDateTime = includeTime
      ? dayjs(`${endDate}T${endTime}`)
      : dayjs(endDate);

    const { uid, ...scheduleWithoutUid } = editingSchedule;

    const updatedSchedule: Omit<Schedule, "uid"> = {
      ...scheduleWithoutUid,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      customerUid: selectedCustomer?.uid || null,
      customerName: selectedCustomer?.name || null,
    };

    onSave({ uid, ...updatedSchedule } as Schedule);
  }, [
    editingSchedule,
    validateForm,
    includeTime,
    startDate,
    startTime,
    endDate,
    endTime,
    selectedCustomer,
    onSave,
  ]);

  return {
    editingSchedule,
    selectedCustomer,
    includeTime,
    startDate,
    endDate,
    startTime,
    endTime,
    customerOptions,
    handleTitleChange,
    handleDescriptionChange,
    handleStartDateChange,
    handleEndDateChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleIncludeTimeChange,
    handleCustomerChange,
    handleSave,
  };
};
