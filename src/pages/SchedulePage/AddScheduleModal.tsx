import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import DatePicker from "@components/DatePicker";
import { fetchCustomerList } from "@apis/customerService";
import { Customer } from "@ts/customer";
import Button from "@components/Button";
import dayjs, { Dayjs } from "dayjs";
import { getValidationErrors } from "@utils/scheduleUtil";

interface ScheduleFormData {
  customerId: number | null;
  title: string;
  startDateTime: Dayjs | null;
  endDateTime: Dayjs | null;
  type: string;
  description: string;
  includeTime: boolean;
}

interface ScheduleSubmitData {
  startDateTime: Dayjs | null;
  endDateTime: Dayjs | null;
  title: string;
  description: string;
  customerUid: number | null;
}

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ScheduleSubmitData) => void;
}

function AddScheduleModal({ open, onClose, onSubmit }: AddScheduleModalProps) {
  const initialFormData: ScheduleFormData = {
    customerId: null,
    title: "",
    startDateTime: null,
    endDateTime: null,
    type: "",
    description: "",
    includeTime: false,
  };

  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const customers = await fetchCustomerList({
          page: 0,
          size: 100,
          sortFields: { name: "ASC" },
        });

        setCustomers(customers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleFormChange = (
    field: keyof ScheduleFormData,
    value: string | boolean | number | Dayjs | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrorMessage("");
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrorMessage("");
    onClose();
  };

  const validationErrors = getValidationErrors({
    customerId: formData.customerId,
    title: formData.title,
    startDateTime: formData.startDateTime,
    endDateTime: formData.endDateTime,
  });

  const isSubmitButtonDisabled = validationErrors.length > 0;

  const handleSubmit = async () => {
    if (validationErrors.length) return;

    // 종료 일시가 없는 경우 시작 일시로 설정
    const endDateTime = formData.endDateTime || formData.startDateTime;

    const submitData: ScheduleSubmitData = {
      startDateTime: formData.startDateTime,
      endDateTime,
      title: formData.title.trim(),
      description: formData.description.trim(),
      customerUid: formData.customerId,
    };

    try {
      await onSubmit(submitData);
      handleClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err?.response?.data?.message ||
          "일정 생성 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        className: "w-200 h-175 max-h-[90vh] bg-white rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        일정 등록
      </DialogTitle>

      <DialogContent className=" p-7">
        <div className="grid grid-cols-1 gap-4">
          <FormControl fullWidth>
            <Autocomplete
              options={customers}
              getOptionLabel={(option) => option.name}
              value={
                customers.find((c) => c.uid === formData.customerId) || null
              }
              onChange={(_, newValue) => {
                handleFormChange("customerId", newValue?.uid || null);
              }}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="고객"
                  helperText={!formData.customerId ? errorMessage : ""}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </FormControl>

          <div>
            <TextField
              fullWidth
              label="일정 제목"
              value={formData.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              isDateTimePicker={formData.includeTime}
              label="시작 일시"
              value={
                formData.startDateTime ? dayjs(formData.startDateTime) : null
              }
              onChange={(newValue) => {
                handleFormChange("startDateTime", newValue || null);
              }}
            />
            <DatePicker
              isDateTimePicker={formData.includeTime}
              label="종료 일시"
              value={formData.endDateTime ? dayjs(formData.endDateTime) : null}
              onChange={(newValue) => {
                handleFormChange("endDateTime", newValue || null);
              }}
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.includeTime}
                onChange={(e) => {
                  handleFormChange("includeTime", e.target.checked);
                  if (!e.target.checked) {
                    handleFormChange(
                      "startDateTime",
                      formData.startDateTime
                        ? dayjs(formData.startDateTime).startOf("day")
                        : null
                    );
                    handleFormChange(
                      "endDateTime",
                      formData.endDateTime
                        ? dayjs(formData.endDateTime).startOf("day")
                        : null
                    );
                  }
                }}
                size="small"
              />
            }
            label="시간 포함"
          />

          <div>
            <TextField
              fullWidth
              label="세부사항"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-gray-200">
        {errorMessage && (
          <Typography className="absolute left-6 text-red-600 text-sm">
            {errorMessage}
          </Typography>
        )}
        <div className="flex gap-2">
          <Button onClick={onClose} variant="outlined">
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitButtonDisabled}
          >
            저장
          </Button>
        </div>
        {isSubmitButtonDisabled && validationErrors.length > 0 && (
          <Tooltip
            title={
              <div>
                {validationErrors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            }
            arrow
            placement="top"
          >
            <div className="text-sm text-red-600 cursor-help">
              <ul className="list-disc list-inside">
                {validationErrors.slice(0, 1).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {validationErrors.length > 1 && (
                  <li>외 {validationErrors.length - 1}개 항목</li>
                )}
              </ul>
            </div>
          </Tooltip>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AddScheduleModal;
