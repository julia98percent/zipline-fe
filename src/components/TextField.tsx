import { TextField as MuiTextField } from "@mui/material";

interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
  type?: string;
  [key: string]: any;
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
      className={`border rounded-md p-2 ${className}`}
      type={type}
      {...props}
    />
  );
};

export default TextField;
