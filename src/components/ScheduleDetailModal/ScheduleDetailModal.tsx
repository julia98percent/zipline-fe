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
    customerOptions,
    handleTitleChange,
    handleDescriptionChange,
    handleStartDateTimeChange,
    handleEndDateTimeChange,
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
      customerOptions={customerOptions}
      onTitleChange={handleTitleChange}
      onDescriptionChange={handleDescriptionChange}
      onStartDateTimeChange={handleStartDateTimeChange}
      onEndDateTimeChange={handleEndDateTimeChange}
      onIncludeTimeChange={handleIncludeTimeChange}
      onCustomerChange={handleCustomerChange}
      onSave={handleSave}
    />
  );
};

export default ScheduleDetailModal;
