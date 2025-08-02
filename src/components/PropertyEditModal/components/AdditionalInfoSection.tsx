import { TextField } from "@mui/material";
import DatePicker from "@components/DatePicker";
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
      <DatePicker
        onChange={onMoveInDateChange}
        value={moveInDate}
        label="입주 가능일"
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
      />

      {/* 건축년도 */}
      <TextField
        label="건축년도"
        value={constructionYear}
        onChange={onConstructionYearChange}
        className="mt-4"
        fullWidth
        placeholder="숫자만 입력하세요 ex)2010"
      />

      <TextField
        label="주차 가능 대수"
        value={parkingCapacity}
        onChange={onParkingCapacityChange}
        className="mt-4"
        fullWidth
      />

      {/* 특이사항 */}
      <TextField
        label="특이사항"
        value={details ?? ""}
        onChange={onDetailsChange}
        className="mt-4"
        fullWidth
      />
    </>
  );
};

export default AdditionalInfoSection;
