import TextField from "@components/TextField";
import { Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
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
    <>
      {/* 반려동물 여부 */}
      <Typography variant="subtitle1" className="mt-4">
        반려동물 여부
      </Typography>
      <RadioGroup
        row
        value={petsAllowed.toString()}
        onChange={(e) => onPetsAllowedChange(e.target.value === "true")}
      >
        <FormControlLabel value="true" control={<Radio />} label="허용" />
        <FormControlLabel value="false" control={<Radio />} label="불가" />
      </RadioGroup>

      {/* 엘리베이터 여부 */}
      <Typography variant="subtitle1" className="mt-4">
        건물 엘리베이터 여부
      </Typography>
      <RadioGroup
        row
        value={hasElevator.toString()}
        onChange={(e) => onHasElevatorChange(e.target.value === "true")}
      >
        <FormControlLabel value="true" control={<Radio />} label="있음" />
        <FormControlLabel value="false" control={<Radio />} label="없음" />
      </RadioGroup>

      {/* 입주 가능일 */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={["DatePicker"]}
          sx={{ marginTop: -1, paddingTop: 0 }}
        >
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

      {/* 특이사항 */}
      <TextField
        label="특이사항"
        value={details ?? ""}
        onChange={onDetailsChange}
        fullWidth
      />
    </>
  );
};

export default PropertyOptionsSection;
