import {
  Typography,
  TextField as MuiTextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";

interface Props {
  search: string;
  startDate: string | null;
  endDate: string | null;
  onSearchChange: (search: string) => void;
  onStartDateChange: (startDate: string | null) => void;
  onEndDateChange: (endDate: string | null) => void;
  onSearchClick: () => void;
}

const CounselSearchFilters = ({
  search,
  startDate,
  endDate,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onSearchClick,
}: Props) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <MuiTextField
          fullWidth
          size="small"
          placeholder="제목으로 검색"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearchClick();
            }
          }}
          className="flex-1"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={onSearchClick}>
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Typography
              variant="subtitle2"
              className="text-gray-700 font-medium"
            >
              상담일
            </Typography>
            <div className="flex items-center gap-2">
              <DatePicker
                value={startDate ? dayjs(startDate) : null}
                onChange={(newValue) => {
                  onStartDateChange(
                    newValue ? newValue.format("YYYY-MM-DD") : null
                  );
                }}
                format="YYYY/MM/DD"
                slotProps={{
                  textField: {
                    size: "small",

                    sx: {
                      backgroundColor: "white",
                      width: "170px",
                      "& .MuiOutlinedInput-root": {
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
                    },
                  },
                }}
              />
              <span className="mx-1 text-gray-500">~</span>
              <DatePicker
                value={endDate ? dayjs(endDate) : null}
                onChange={(newValue) => {
                  onEndDateChange(
                    newValue ? newValue.format("YYYY-MM-DD") : null
                  );
                }}
                format="YYYY/MM/DD"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      backgroundColor: "white",
                      width: "170px",
                      "& .MuiOutlinedInput-root": {
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
                    },
                  },
                }}
              />
            </div>
          </div>
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default CounselSearchFilters;
