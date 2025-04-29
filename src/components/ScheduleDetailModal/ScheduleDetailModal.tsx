import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Schedule } from "../../interfaces/schedule";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  onSave: (schedule: Schedule) => void;
  customers?: Array<{ uid: number; name: string }>;
  isUpdating?: boolean;
}

const ScheduleDetailModal = ({
  open,
  onClose,
  schedule,
  onSave,
  customers,
  isUpdating = false,
}: Props) => {
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(
    schedule
  );
  const [selectedCustomer, setSelectedCustomer] = useState<{
    uid: number;
    name: string;
  } | null>(
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

  const handleScheduleChange = (field: keyof Schedule, value: string) => {
    if (!editingSchedule) return;

    setEditingSchedule({
      ...editingSchedule,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!editingSchedule) return;

    const { uid, customerName, ...scheduleWithoutUidAndName } = editingSchedule;
    const updatedSchedule = {
      ...scheduleWithoutUidAndName,
      customerUid: selectedCustomer?.uid || null,
      startDate: includeTime
        ? `${startDate}T${startTime}:00`
        : `${startDate}T00:00:00`,
      endDate: includeTime ? `${endDate}T${endTime}:00` : `${endDate}T23:59:59`,
    };

    onSave({
      ...updatedSchedule,
      uid,
      customerName: selectedCustomer?.name || null,
    });
  };

  if (!schedule) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          fontSize: "24px",
          fontWeight: "600",
          color: "#000000",
          p: "24px 24px 16px 24px",
        }}
      >
        일정 상세 조회
      </DialogTitle>
      <DialogContent sx={{ p: "0 24px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#666666",
                mb: "4px",
              }}
            >
              제목
            </Typography>
            <TextField
              fullWidth
              value={editingSchedule?.title}
              onChange={(e) => handleScheduleChange("title", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#FFFFFF",
                  height: "56px",
                  "& fieldset": {
                    borderColor: "#E0E0E0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#164F9E",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#164F9E",
                  },
                },
              }}
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={includeTime}
                onChange={(e) => setIncludeTime(e.target.checked)}
                sx={{
                  color: "#666666",
                  "&.Mui-checked": {
                    color: "#164F9E",
                  },
                }}
              />
            }
            label="시간 포함"
            sx={{
              mb: 1.5,
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                color: "#666666",
              },
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#666666",
                mb: "4px",
              }}
            >
              시작일
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      height: "56px",
                      "& fieldset": {
                        borderColor: "#E0E0E0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#164F9E",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#164F9E",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={!includeTime}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      height: "56px",
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
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#666666",
                mb: "4px",
              }}
            >
              종료일
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      height: "56px",
                      "& fieldset": {
                        borderColor: "#E0E0E0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#164F9E",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#164F9E",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={!includeTime}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      height: "56px",
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
                  }}
                />
              </Box>
            </Box>
          </Box>

          {customers && (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#666666",
                  mb: "4px",
                }}
              >
                고객
              </Typography>
              <Autocomplete
                fullWidth
                options={customers}
                value={selectedCustomer}
                onChange={(_, newValue) => {
                  setSelectedCustomer(newValue);
                }}
                getOptionLabel={(option) => `${option.name} (${option.uid})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="고객명 또는 ID를 입력하세요"
                    sx={{
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
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Typography>
                      {option.name} ({option.uid})
                    </Typography>
                  </li>
                )}
                filterOptions={(options, { inputValue }) => {
                  const searchValue = inputValue.toLowerCase();
                  return options.filter(
                    (option) =>
                      option.name.toLowerCase().includes(searchValue) ||
                      option.uid.toString().includes(searchValue)
                  );
                }}
              />
            </Box>
          )}

          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#666666",
                mb: "4px",
              }}
            >
              세부사항
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editingSchedule?.description || ""}
              onChange={(e) =>
                handleScheduleChange("description", e.target.value)
              }
              sx={{
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
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#666666",
            color: "#666666",
            "&:hover": {
              borderColor: "#333333",
              backgroundColor: "rgba(102, 102, 102, 0.04)",
            },
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isUpdating}
          sx={{
            backgroundColor: "#164F9E",
            "&:hover": {
              backgroundColor: "#0D3B7A",
            },
          }}
        >
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDetailModal;
