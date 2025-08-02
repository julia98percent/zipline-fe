import TextField from "@components/TextField";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import DatePicker from "@components/DatePicker";
import { Dayjs } from "dayjs";

interface PropertyOptionsSectionProps {
  moveInDate: Dayjs | null;
  petsAllowed: boolean;
  hasElevator: boolean;
  details: string | null;
  onMoveInDateChange: (date: Dayjs | null) => void;
  onPetsAllowedChange: (allowed: boolean) => void;
  onHasElevatorChange: (hasElevator: boolean) => void;
  onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertyOptionsSection = ({
  moveInDate,
  petsAllowed,
  hasElevator,
  details,
  onMoveInDateChange,
  onPetsAllowedChange,
  onHasElevatorChange,
  onDetailsChange,
}: PropertyOptionsSectionProps) => {
  return (
    <div className="flex flex-col mt-4 pb-4 gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h6 className="font-semibold">반려동물</h6>
          <RadioGroup
            row
            value={petsAllowed.toString()}
            onChange={(e) => onPetsAllowedChange(e.target.value === "true")}
          >
            <FormControlLabel value="true" control={<Radio />} label="허용" />
            <FormControlLabel value="false" control={<Radio />} label="불가" />
          </RadioGroup>
        </div>
        <div>
          <h6 className="font-semibold">건물 엘리베이터</h6>
          <RadioGroup
            row
            value={hasElevator.toString()}
            onChange={(e) => onHasElevatorChange(e.target.value === "true")}
          >
            <FormControlLabel value="true" control={<Radio />} label="있음" />
            <FormControlLabel value="false" control={<Radio />} label="없음" />
          </RadioGroup>
        </div>
      </div>
      {/* 입주 가능일 */}

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

      {/* 특이사항 */}
      <TextField
        label="특이사항"
        value={details ?? ""}
        onChange={onDetailsChange}
        fullWidth
      />
    </div>
  );
};

export default PropertyOptionsSection;
