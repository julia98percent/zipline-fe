import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Button from "@components/Button";

interface Props {
  search: string;
  startDate: string | null;
  endDate: string | null;
  onSearchChange: (search: string) => void;
  onStartDateChange: (startDate: string | null) => void;
  onEndDateChange: (endDate: string | null) => void;
  onSearchClick: () => void;
  onResetClick: () => void;
}

const CounselSearchFilters = ({
  search,
  startDate,
  endDate,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onSearchClick,
  onResetClick,
}: Props) => {
  return (
    <div className={styles.counselListPage}>
      <div className={styles.searchFilterRow}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="제목으로 검색"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button
          variant="contained"
          className={styles.searchButton}
          onClick={onSearchClick}
        >
          검색
        </Button>
        <Button
          variant="outlined"
          className={styles.resetButton}
          onClick={onResetClick}
        >
          초기화
        </Button>
      </div>

      <div className={styles.dateFilterRow}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#333333",
                fontWeight: 500,
                mr: 1,
              }}
            >
              상담일
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                          borderRadius: "20px",
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
              <Box component="span" sx={{ mx: 1 }}>
                ~
              </Box>
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
                          borderRadius: "20px",
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
            </Box>
          </Box>
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default CounselSearchFilters;
