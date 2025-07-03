import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Schedule } from "@ts/schedule";

interface Customer {
  uid: number;
  name: string;
}

interface ScheduleDetailModalViewProps {
  open: boolean;
  onClose: () => void;
  isUpdating?: boolean;
  editingSchedule: Schedule | null;
  selectedCustomer: Customer | null;
  includeTime: boolean;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  customerOptions: Customer[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  isUpdating = false,
  editingSchedule,
  selectedCustomer,
  includeTime,
  startDate,
  endDate,
  startTime,
  endTime,
  customerOptions,
  onTitleChange,
  onDescriptionChange,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onIncludeTimeChange,
  onCustomerChange,
  onSave,
}: ScheduleDetailModalViewProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingSchedule?.uid ? "일정 수정" : "일정 추가"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="제목"
            type="text"
            fullWidth
            variant="outlined"
            value={editingSchedule?.title || ""}
            onChange={onTitleChange}
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
          />

          <Autocomplete
            options={customerOptions}
            getOptionLabel={(option) => option.name}
            value={selectedCustomer}
            onChange={onCustomerChange}
            isOptionEqualToValue={(option, value) => option.uid === value.uid}
            renderInput={(params) => (
              <TextField
                {...params}
                label="고객"
                margin="dense"
                variant="outlined"
                fullWidth
              />
            )}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox checked={includeTime} onChange={onIncludeTimeChange} />
            }
            label="시간 포함"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="시작일"
              type="date"
              value={startDate}
              onChange={onStartDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            {includeTime && (
              <TextField
                label="시작시간"
                type="time"
                value={startTime}
                onChange={onStartTimeChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="종료일"
              type="date"
              value={endDate}
              onChange={onEndDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            {includeTime && (
              <TextField
                label="종료시간"
                type="time"
                value={endTime}
                onChange={onEndTimeChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={onSave} variant="contained" disabled={isUpdating}>
          {isUpdating ? "저장 중..." : "저장"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDetailModalView;
