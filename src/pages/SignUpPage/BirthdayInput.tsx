import { Dispatch, SetStateAction } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";

interface Props {
  birthday: Dayjs | null;
  handleChangeBirthday: Dispatch<SetStateAction<Dayjs | null>>;
}

const BirthdayInput = ({ birthday, handleChangeBirthday }: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DesktopDatePicker
          onChange={handleChangeBirthday}
          value={birthday}
          format="YYYY. MM. DD"
          label="생년월일"
          sx={{
            width: "100vw",
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default BirthdayInput;
