import {
  TextField as MuiTextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DatePicker from "@components/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { Dayjs } from "dayjs";

interface Props {
  search: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onSearchChange: (search: string) => void;
  onStartDateChange: (startDate: Dayjs | null) => void;
  onEndDateChange: (endDate: Dayjs | null) => void;
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
          placeholder="고객 이름 또는 전화번호로 검색"
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
          <h6 className="text-sm text-gray-700 font-medium break-keep">
            상담일
          </h6>
          <div className="flex items-center gap-2">
            <DatePicker
              value={startDate || null}
              onChange={onStartDateChange}
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
            <span className="mx-1 text-gray-500">~</span>
            <DatePicker
              value={endDate || null}
              onChange={onEndDateChange}
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselSearchFilters;
