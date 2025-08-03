import { forwardRef } from "react";
import {
  FormControl as MuiFormControl,
  FormControlProps as MuiFormControlProps,
} from "@mui/material";

export type FormControlProps = MuiFormControlProps;

const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ children, className, size = "medium", ...props }, ref) => {
    return (
      <MuiFormControl
        ref={ref}
        size={size}
        className={`min-w-30 ${className || ""}`}
        {...props}
      >
        {children}
      </MuiFormControl>
    );
  }
);

FormControl.displayName = "FormControl";

export default FormControl;
