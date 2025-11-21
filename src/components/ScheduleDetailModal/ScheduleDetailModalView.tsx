import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Schedule } from "@/types/schedule";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { NEUTRAL, RGBA } from "@/constants/colors";

interface Customer {
  uid: number;
  name: string;
}

interface ScheduleDetailModalViewProps {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  isUpdating?: boolean;
  isEditMode?: boolean;
  editingSchedule: Schedule | null;
  selectedCustomer: Customer | null;
  includeTime: boolean;
  customerOptions: Customer[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDateTimeChange: (date: Dayjs | null) => void;
  onEndDateTimeChange: (date: Dayjs | null) => void;
  onIncludeTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomerChange: (
    event: React.SyntheticEvent,
    newValue: Customer | null
  ) => void;
  onSave: () => void;
}

const ScheduleDetailModalView = ({
  open,
  onClose,
  onCancel,
  onEdit,
  isUpdating = false,
  isEditMode = false,
  editingSchedule,
  selectedCustomer,
  includeTime,
  customerOptions,
  onTitleChange,
  onDescriptionChange,
  onStartDateTimeChange,
  onEndDateTimeChange,
  onIncludeTimeChange,
  onCustomerChange,
  onSave,
}: ScheduleDetailModalViewProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        className: "w-[90vw] sm:w-[50vw] max-h-[90vh] rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        {isEditMode
          ? editingSchedule?.uid
            ? "일정 수정"
            : "일정 추가"
          : "일정 상세"}
      </DialogTitle>
      <DialogContent className="bg-neutral-100 flex flex-col gap-3 p-3">
        <div className="w-full p-5 card">
          <TextField
            autoFocus={isEditMode}
            margin="dense"
            label="제목"
            type="text"
            fullWidth
            variant="outlined"
            value={editingSchedule?.title || ""}
            onChange={onTitleChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
            className="mb-4"
            sx={{
              ...(!isEditMode && {
                "& .MuiInputBase-root": {
                  cursor: "default",
                  pointerEvents: "none",
                },
                "& .MuiInputLabel-root": {
                  cursor: "default",
                },
              }),
            }}
          />
          <TextField
            margin="dense"
            label="설명"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={editingSchedule?.description || ""}
            onChange={onDescriptionChange}
            disabled={!isEditMode}
            className="mb-4"
            sx={{
              ...(!isEditMode && {
                "& .MuiInputBase-root": {
                  cursor: "default",
                  overflow: "auto",
                  backgroundColor: "transparent !important",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: NEUTRAL[100],
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: NEUTRAL[400],
                    borderRadius: "3px",
                    "&:hover": {
                      background: NEUTRAL[500],
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  cursor: "default",
                  color: `${RGBA.blackDisabled} !important`,
                },
                "& .MuiInputBase-input": {
                  cursor: "default",
                  userSelect: "none",
                  resize: "none",
                  color: `${RGBA.blackText} !important`,
                  WebkitTextFillColor: `${RGBA.blackText} !important`,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: `${RGBA.blackDark} !important`,
                },
              }),
            }}
          />

          <Autocomplete
            options={customerOptions}
            getOptionLabel={(option) => option.name}
            value={selectedCustomer}
            onChange={onCustomerChange}
            isOptionEqualToValue={(option, value) => option.uid === value.uid}
            disabled={!isEditMode}
            renderInput={(params) => (
              <TextField
                {...params}
                label="고객"
                margin="dense"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  readOnly: !isEditMode,
                }}
              />
            )}
            className="mb-4"
            sx={{
              ...(!isEditMode && {
                "& .MuiInputBase-root": {
                  cursor: "default",
                  pointerEvents: "none",
                  backgroundColor: "transparent !important",
                },
                "& .MuiInputLabel-root": {
                  cursor: "default",
                  color: "rgba(0, 0, 0, 0.6) !important",
                },
                "& .MuiInputBase-input": {
                  color: "rgba(0, 0, 0, 0.87) !important",
                  WebkitTextFillColor: "rgba(0, 0, 0, 0.87) !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.23) !important",
                },
                "& .MuiAutocomplete-endAdornment": {
                  display: "none",
                },
              }),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={includeTime}
                onChange={onIncludeTimeChange}
                disabled={!isEditMode}
              />
            }
            label="시간 포함"
            className="mb-4"
            sx={{
              ...(!isEditMode && {
                cursor: "default",
                pointerEvents: "none",
              }),
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <DatePicker
              isDateTimePicker={includeTime}
              label="시작일시"
              value={
                editingSchedule?.startDate
                  ? dayjs(editingSchedule.startDate)
                  : null
              }
              onChange={onStartDateTimeChange}
              readOnly={!isEditMode}
              sx={{
                ...(!isEditMode && {
                  "& .MuiInputBase-root": {
                    cursor: "default",
                    pointerEvents: "none",
                  },
                  "& .MuiInputLabel-root": {
                    cursor: "default",
                    pointerEvents: "none",
                  },
                }),
              }}
            />

            <DatePicker
              isDateTimePicker={includeTime}
              label="종료일시"
              value={
                editingSchedule?.endDate ? dayjs(editingSchedule.endDate) : null
              }
              onChange={onEndDateTimeChange}
              readOnly={!isEditMode}
              sx={{
                ...(!isEditMode && {
                  "& .MuiInputBase-root": {
                    cursor: "default",
                    pointerEvents: "none",
                  },
                  "& .MuiInputLabel-root": {
                    cursor: "default",
                    pointerEvents: "none",
                  },
                }),
              }}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-gray-200">
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <Button onClick={onCancel} color="info" variant="outlined">
                취소
              </Button>
              <Button
                onClick={onSave}
                variant="contained"
                disabled={isUpdating}
              >
                {isUpdating ? "저장 중..." : "저장"}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onClose} color="info" variant="outlined">
                닫기
              </Button>
              {onCancel && (
                <Button onClick={onEdit} color="primary" variant="outlined">
                  수정
                </Button>
              )}
            </>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDetailModalView;
