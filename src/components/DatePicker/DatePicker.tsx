import { SxProps } from "@mui/system";
import {
  DesktopDatePicker as MuiDesktopDatePicker,
  DesktopDateTimePicker as MuiDesktopDateTimePicker,
} from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface Props {
  label?: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  slotProps?: object;
  isDateTimePicker?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  sx?: SxProps;
}

const DatePicker = ({
  label,
  value,
  onChange,
  slotProps,
  isDateTimePicker = false,
  readOnly = false,
  disabled = false,
  className = "",
  sx,
}: Props) => {
  if (isDateTimePicker) {
    return (
      <MuiDesktopDateTimePicker
        sx={sx}
        label={label}
        value={value}
        onChange={onChange}
        format="YYYY. MM. DD HH:mm"
        timezone="Asia/Seoul"
        slotProps={{
          ...slotProps,
          calendarHeader: { format: "YYYY년 MM월" },
        }}
        readOnly={readOnly}
        disabled={disabled}
        className={className}
      />
    );
  }

  return (
    <MuiDesktopDatePicker
      sx={sx}
      label={label}
      value={value}
      onChange={onChange}
      format="YYYY. MM. DD"
      timezone="Asia/Seoul"
      slotProps={{
        ...slotProps,
        calendarHeader: { format: "YYYY년 MM월" },
      }}
      readOnly={readOnly}
      disabled={disabled}
      className={className}
    />
  );
};

export default DatePicker;
