import React from "react";
import { Button as MuiButton } from "@mui/material";

interface ButtonType {
  text: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  rightElement?: React.ReactNode;
  size?: "small" | "medium" | "large";
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  id?: string;
  sx?: object;
  [key: string]: any;
}

const Button = ({
  text,
  className,
  onClick,
  disabled = false,
  onMouseEnter,
  onMouseLeave,
  id,
  ...props
}: ButtonType) => {
  return (
    <MuiButton
      id={id}
      disabled={disabled}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      <span>{text}</span>
    </MuiButton>
  );
};

export default Button;
