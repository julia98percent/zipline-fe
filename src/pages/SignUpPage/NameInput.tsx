import { TextField } from "@mui/material";

interface NameInputProps {
  name: string;
  handleChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameInput = ({ name, handleChangeName }: NameInputProps) => {
  return (
    <TextField
      label="이름"
      value={name}
      onChange={handleChangeName}
      fullWidth
      required
      variant="outlined"
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

export default NameInput;
