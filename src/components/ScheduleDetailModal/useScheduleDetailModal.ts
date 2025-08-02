import { useState, useEffect, useCallback } from "react";
import { Schedule } from "@ts/schedule";
import dayjs, { Dayjs } from "dayjs";
import { fetchCustomerList } from "@apis/customerService";
import { showToast } from "@components/Toast";
import { getValidationErrors } from "@utils/scheduleUtil";

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
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);

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

      const hasTime =
        dayjs(schedule.startDate).format("HH:mm") !== "00:00" ||
        dayjs(schedule.endDate).format("HH:mm") !== "00:00";
      setIncludeTime(hasTime);
    }
  }, [schedule]);

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

  const handleStartDateTimeChange = useCallback(
    (startDate: Dayjs | null) => {
      if (editingSchedule && startDate) {
        setEditingSchedule({
          ...editingSchedule,
          startDate,
        });
      }
    },
    [editingSchedule]
  );

  const handleEndDateTimeChange = useCallback(
    (endDate: Dayjs | null) => {
      if (editingSchedule && endDate) {
        setEditingSchedule({
          ...editingSchedule,
          endDate,
        });
      }
    },
    [editingSchedule]
  );

  const handleIncludeTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIncludeTime(e.target.checked);
      if (!e.target.checked && editingSchedule) {
        setEditingSchedule({
          ...editingSchedule,
          startDate: dayjs(editingSchedule.startDate).startOf("day"),
          endDate: dayjs(editingSchedule.endDate).startOf("day"),
        });
      }
    },
    [editingSchedule]
  );

  const handleCustomerChange = useCallback(
    (_event: React.SyntheticEvent, newValue: Customer | null) => {
      if (editingSchedule) {
        setSelectedCustomer(newValue);
      }
    },
    [editingSchedule]
  );

  const validateErrors = getValidationErrors({
    customerId: selectedCustomer?.uid,
    title: editingSchedule?.title,
    startDateTime: editingSchedule?.startDate,
    endDateTime: editingSchedule?.endDate,
  });

  const handleSave = () => {
    if (!editingSchedule || validateErrors.length) return;

    const { uid, ...scheduleWithoutUid } = editingSchedule;

    const updatedSchedule: Omit<Schedule, "uid"> = {
      ...scheduleWithoutUid,
      startDate: editingSchedule.startDate,
      endDate: editingSchedule.endDate,
      customerUid: selectedCustomer?.uid || null,
      customerName: selectedCustomer?.name || null,
    };

    onSave({ uid, ...updatedSchedule });
  };

  return {
    editingSchedule,
    selectedCustomer,
    includeTime,
    customerOptions,
    handleTitleChange,
    handleDescriptionChange,
    handleStartDateTimeChange,
    handleEndDateTimeChange,
    handleIncludeTimeChange,
    handleCustomerChange,
    handleSave,
  };
};
