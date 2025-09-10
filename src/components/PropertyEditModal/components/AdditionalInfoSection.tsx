import { TextField } from "@mui/material";
import DatePicker from "@/components/DatePicker";
import { Dayjs } from "dayjs";

interface AdditionalInfoSectionProps {
  moveInDate: Dayjs | null;
  parkingCapacity: string;
  details: string;
  onMoveInDateChange: (date: Dayjs | null) => void;
  onParkingCapacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdditionalInfoSection = ({
  moveInDate,
  parkingCapacity,
  details,
  onMoveInDateChange,
  onParkingCapacityChange,
  onDetailsChange,
}: AdditionalInfoSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 card">
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
        <TextField
          label="주차 가능 대수"
          value={parkingCapacity}
          onChange={onParkingCapacityChange}
          fullWidth
        />
      </div>
      <div className="p-5 card">
        <TextField
          label="특이사항"
          value={details ?? ""}
          onChange={onDetailsChange}
          fullWidth
          multiline
          rows={4}
          inputProps={{ maxLength: 255 }}
        />
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
