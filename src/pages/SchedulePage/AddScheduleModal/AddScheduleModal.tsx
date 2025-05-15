import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import apiClient from "@apis/apiClient";

interface ScheduleFormData {
  customerId: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  type: string;
  description: string;
  includeTime: boolean;
}

interface ScheduleSubmitData {
  startDateTime: string;
  endDateTime: string;
  title: string;
  description: string;
  customerUid: number | null;
}

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ScheduleSubmitData) => void;
}

interface Customer {
  uid: string;
  name: string;
}

function AddScheduleModal({ open, onClose, onSubmit }: AddScheduleModalProps) {
  const initialFormData: ScheduleFormData = {
    customerId: "",
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    type: "",
    description: "",
    includeTime: false,
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#FFFFFF",
      "& fieldset": {
        borderColor: "#E0E0E0",
      },
      "&:hover fieldset": {
        borderColor: "#164F9E",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#164F9E",
      },
      "&.Mui-disabled": {
        backgroundColor: "#F8F9FA",
        "& fieldset": {
          borderColor: "#E0E0E0",
        },
      },
    },
  };

  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/customers", {
          params: {
            page: 1,
            size: 100,
            sort: "name,asc",
          },
        });

        if (response?.data?.data?.customers) {
          setCustomers(response.data.data.customers);
        }
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
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 입력이 변경될 때마다 에러 메시지 초기화
    setErrorMessage("");
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!formData.customerId) {
      setErrorMessage("고객을 선택해주세요.");
      return;
    }

    if (!formData.title.trim()) {
      setErrorMessage("일정 제목을 입력해주세요.");
      return;
    }

    if (!formData.startDate) {
      setErrorMessage("시작 날짜를 선택해주세요.");
      return;
    }

    if (formData.includeTime && !formData.startTime) {
      setErrorMessage("시작 시간을 선택해주세요.");
      return;
    }

    // 시작 시간이 종료 시간보다 늦은 경우 체크
    if (formData.includeTime && formData.endTime) {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`
      );
      const endDateTime = new Date(
        `${formData.endDate || formData.startDate}T${formData.endTime}`
      );

      if (startDateTime > endDateTime) {
        setErrorMessage("시작 시간은 종료 시간보다 늦을 수 없습니다.");
        return;
      }
    }

    // 날짜와 시간을 ISO 문자열로 변환
    const formatDateTime = (date: string, time: string) => {
      const dateTime = new Date(date);
      if (formData.includeTime && time) {
        const [hours, minutes] = time.split(":");
        dateTime.setHours(parseInt(hours, 10));
        dateTime.setMinutes(parseInt(minutes, 10));
      }
      return dateTime.toISOString();
    };

    // 종료 날짜가 없는 경우 시작 날짜로 설정
    const endDate = formData.endDate || formData.startDate;
    const endTime = formData.includeTime
      ? formData.endTime || formData.startTime
      : "00:00";

    const submitData: ScheduleSubmitData = {
      startDateTime: formatDateTime(formData.startDate, formData.startTime),
      endDateTime: formatDateTime(endDate, endTime),
      title: formData.title.trim(),
      description: formData.description.trim(),
      customerUid: formData.customerId
        ? parseInt(formData.customerId, 10)
        : null,
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
        sx: {
          width: "800px",
          height: "700px",
          maxHeight: "80vh",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle sx={{ color: "#164F9E", fontWeight: "bold", p: 3 }}>
        일정 등록
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: "10px !important" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ width: "100%" }}>
            <FormControl fullWidth sx={{ mb: 2, ...inputStyle }}>
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => option.name}
                value={
                  customers.find((c) => c.uid === formData.customerId) || null
                }
                onChange={(_, newValue) => {
                  handleFormChange("customerId", newValue?.uid || "");
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
          </Box>
          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="일정 제목"
              value={formData.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              sx={inputStyle}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 calc(50% - 6px)", minWidth: "240px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="시작 날짜"
                  value={formData.startDate ? dayjs(formData.startDate) : null}
                  onChange={(newValue) => {
                    handleFormChange(
                      "startDate",
                      newValue?.format("YYYY-MM-DD") || ""
                    );
                  }}
                  format="YYYY/MM/DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: inputStyle,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 6px)", minWidth: "240px" }}>
              <TextField
                fullWidth
                label="시작 시간"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleFormChange("startTime", e.target.value)}
                disabled={!formData.includeTime}
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 calc(50% - 6px)", minWidth: "240px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="종료 날짜"
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  onChange={(newValue) => {
                    handleFormChange(
                      "endDate",
                      newValue?.format("YYYY-MM-DD") || ""
                    );
                  }}
                  format="YYYY/MM/DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: inputStyle,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 6px)", minWidth: "240px" }}>
              <TextField
                fullWidth
                label="종료 시간"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleFormChange("endTime", e.target.value)}
                disabled={!formData.includeTime}
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />
            </Box>
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.includeTime}
                  onChange={(e) =>
                    handleFormChange("includeTime", e.target.checked)
                  }
                  size="small"
                />
              }
              label="시간 포함"
              sx={{ mb: 1.5 }}
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="세부사항"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, position: "relative" }}>
        {errorMessage && (
          <Typography
            sx={{
              position: "absolute",
              left: 24,
              color: "#D32F2F",
              fontSize: "0.875rem",
            }}
          >
            {errorMessage}
          </Typography>
        )}
        <Button onClick={handleClose} sx={{ color: "#164F9E" }}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#164F9E",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#0D3B7A",
              boxShadow: "none",
            },
          }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddScheduleModal;
