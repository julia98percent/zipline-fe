import { forwardRef } from "react";
import {
  InputLabel as MuiInputLabel,
  InputLabelProps as MuiInputLabelProps,
} from "@mui/material";

export type InputLabelProps = MuiInputLabelProps;

const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <MuiInputLabel ref={ref} className={className || ""} {...props}>
        {children}
      </MuiInputLabel>
    );
  }
);

InputLabel.displayName = "InputLabel";

export default InputLabel;
