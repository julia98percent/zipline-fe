import {
  SelectProps as MuiSelectProps,
  SelectChangeEvent,
  Select as MuiSelect,
} from "@mui/material";
import { ReactNode } from "react";
import FormControl from "./FormControl";
import InputLabel from "./InputLabel";
import MenuItem from "./MenuItem";

interface SelectProps<T extends string | number | boolean>
  extends Omit<MuiSelectProps, "sx" | "onChange"> {
  label?: string;
  options?: Array<{
    value: T;
    label: string;
    disabled?: boolean;
  }>;
  onChange?: (event: SelectChangeEvent<T>, child: React.ReactNode) => void;
  children?: ReactNode;
  emptyText?: string;
  showEmptyOption?: boolean;
  className?: string;
  fullWidth?: boolean;
}

function Select<
  T extends string | number | boolean = string | number | boolean
>(props: SelectProps<T> & { ref?: React.Ref<HTMLDivElement> }) {
  const {
    label,
    options = [],
    onChange,
    children,
    value = "",
    disabled = false,
    size = "small",
    emptyText = "선택",
    showEmptyOption = true,
    className,
    ref,
    fullWidth,
    ...restProps
  } = props;

  const handleChange = (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode
  ) => {
    onChange?.(event as SelectChangeEvent<T>, child);
  };

  return (
    <FormControl
      size={size}
      className={`min-w-30 ${className || ""}`}
      disabled={disabled}
      ref={ref}
      fullWidth={fullWidth}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        value={String(value)}
        onChange={handleChange}
        label={label}
        disabled={disabled}
        displayEmpty={!label}
        {...restProps}
      >
        {showEmptyOption && (
          <MenuItem value="">
            <em>{emptyText}</em>
          </MenuItem>
        )}
        {options.length > 0
          ? options.map((option) => (
              <MenuItem
                key={String(option.value)}
                value={String(option.value)}
                disabled={option.disabled}
              >
                {option.label}
              </MenuItem>
            ))
          : children}
      </MuiSelect>
    </FormControl>
  );
}

Select.displayName = "Select";

export default Select;
export type { SelectProps };
