import { TextField } from "@mui/material";

interface PhoneNumberInputProps {
  phoneNumber: string;
  handleChangePhoneNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneNumberInput = ({
  phoneNumber,
  handleChangePhoneNumber,
}: PhoneNumberInputProps) => {
  return (
    <TextField
      label="전화번호"
      value={phoneNumber}
      onChange={handleChangePhoneNumber}
      fullWidth
      required
      variant="outlined"
      helperText="예: 010-1234-5678"
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: "#164F9E",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#164F9E",
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#164F9E",
        },
      }}
    />
  );
};

export default PhoneNumberInput;
