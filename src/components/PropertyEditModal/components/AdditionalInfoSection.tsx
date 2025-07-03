import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface AdditionalInfoSectionProps {
  moveInDate: Dayjs | null;
  constructionYear: string;
  parkingCapacity: string;
  details: string;
  onMoveInDateChange: (date: Dayjs | null) => void;
  onConstructionYearChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onParkingCapacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdditionalInfoSection = ({
  moveInDate,
  constructionYear,
  parkingCapacity,
  details,
  onMoveInDateChange,
  onConstructionYearChange,
  onParkingCapacityChange,
  onDetailsChange,
}: AdditionalInfoSectionProps) => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DesktopDatePicker
            onChange={onMoveInDateChange}
            value={moveInDate}
            format="YYYY. MM. DD"
            label="입주 가능일"
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </DemoContainer>
      </LocalizationProvider>

      {/* 건축년도 */}
      <TextField
        label="건축년도"
        value={constructionYear}
        onChange={onConstructionYearChange}
        sx={{ mt: 2 }}
        fullWidth
        placeholder="숫자만 입력하세요 ex)2010"
      />

      <TextField
        label="주차 가능 대수"
        value={parkingCapacity}
        onChange={onParkingCapacityChange}
        sx={{ mt: 2 }}
        fullWidth
      />

      {/* 특이사항 */}
      <TextField
        label="특이사항"
        value={details ?? ""}
        onChange={onDetailsChange}
        sx={{ mt: 2 }}
        fullWidth
      />
    </>
  );
};

export default AdditionalInfoSection;
