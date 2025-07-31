import { TextField as MuiTextField } from "@mui/material";

interface TextFieldProps {
  label?: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
  type?: string;
  size?: "small" | "medium";
  [key: string]: unknown;
}

const TextField = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  className,
  type,
  size = "medium",
  ...props
}: TextFieldProps) => {
  return (
    <MuiTextField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      className={className || ""}
      size={size}
      type={type}
      InputProps={{
        readOnly: Boolean(onChange) == false,
      }}
      {...props}
    />
  );
};

export default TextField;
