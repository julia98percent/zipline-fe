import { ChangeEvent, useCallback } from "react";
import { TextField, Tooltip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export interface PhoneNumberInputProps {
  phoneNumber: string;
  handleChangePhoneNumber: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
}

const isValidPhoneNumber = (phone: string) =>
  /^01[0|1|6|7|8|9]-\d{3,4}-\d{4}$/.test(phone);

const formatPhoneNumber = (input: string): string => {
  const cleanedInput = input.replace(/[^0-9]/g, "");
  const match = cleanedInput.match(/^(\d{3})(\d{0,4})(\d{0,4})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  }
  return cleanedInput;
};

const PhoneNumberInput = ({
  phoneNumber,
  handleChangePhoneNumber,
  error,
  helperText,
  onBlur,
}: PhoneNumberInputProps) => {
  const isError = error || (phoneNumber && !isValidPhoneNumber(phoneNumber));
  const errorMessage =
    helperText ||
    (phoneNumber && !isValidPhoneNumber(phoneNumber)
      ? "올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)"
      : "");

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const formattedPhoneNumber = formatPhoneNumber(e.target.value);
      handleChangePhoneNumber({
        target: {
          name: e.target.name,
          value: formattedPhoneNumber,
        },
      } as ChangeEvent<HTMLInputElement>);
    },
    [handleChangePhoneNumber]
  );

  return (
    <div style={{ position: "relative" }}>
      <TextField
        label="전화번호"
        value={phoneNumber}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder="010-1234-5678"
        type="tel"
        fullWidth
        required
        variant="outlined"
        error={isError}
        InputProps={{
          endAdornment: isError && (
            <Tooltip title={errorMessage} arrow placement="right">
              <ErrorOutlineIcon color="error" sx={{ cursor: "help" }} />
            </Tooltip>
          ),
        }}
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
    </div>
  );
};

export default PhoneNumberInput;
