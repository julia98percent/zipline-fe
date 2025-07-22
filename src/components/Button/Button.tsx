import React from "react";
import { Button as MuiButton } from "@mui/material";

interface ButtonType {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  rightElement?: React.ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  id?: string;
  children?: React.ReactNode;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = ({
  className,
  onClick,
  variant = "contained",
  disabled = false,
  onMouseEnter,
  onMouseLeave,
  id,
  children,
  color = "primary",
  startIcon,
  endIcon,
  fullWidth,
  ...props
}: ButtonType) => {
  const classNameWithVariant =
    `${variant == "outlined" && " bg-white "}` +
    `${variant == "text" && " hover:bg-black/5 "}`;

  return (
    <MuiButton
      id={id}
      disabled={disabled}
      className={`${classNameWithVariant} shadow-none hover:shadow-none h-[40px] px-4 py-2 rounded-3xl ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
