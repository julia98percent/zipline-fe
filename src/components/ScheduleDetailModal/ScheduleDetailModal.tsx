import { Schedule } from "@ts/schedule";
import { useScheduleDetailModal } from "./useScheduleDetailModal";
import ScheduleDetailModalView from "./ScheduleDetailModalView";

interface ScheduleDetailModalProps {
  open: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  onSave: (schedule: Schedule) => void;
  onEdit?: () => void;
  isUpdating?: boolean;
  isEditMode?: boolean;
}

const ScheduleDetailModal = ({
  open,
  onClose,
  schedule,
  onSave,
  onEdit,
  isUpdating = false,
  isEditMode = false,
}: ScheduleDetailModalProps) => {
  const {
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
  } = useScheduleDetailModal({
    open,
    schedule,
    onSave,
  });

  if (!schedule) return null;

  return (
    <ScheduleDetailModalView
      open={open}
      onClose={onClose}
      onEdit={onEdit}
      isUpdating={isUpdating}
      isEditMode={isEditMode}
      editingSchedule={editingSchedule}
      selectedCustomer={selectedCustomer}
      includeTime={includeTime}
      startDate={startDate}
      endDate={endDate}
      startTime={startTime}
      endTime={endTime}
      customerOptions={customerOptions}
      onTitleChange={handleTitleChange}
      onDescriptionChange={handleDescriptionChange}
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      onStartTimeChange={handleStartTimeChange}
      onEndTimeChange={handleEndTimeChange}
      onIncludeTimeChange={handleIncludeTimeChange}
      onCustomerChange={handleCustomerChange}
      onSave={handleSave}
    />
  );
};

export default ScheduleDetailModal;
