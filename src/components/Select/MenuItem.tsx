import { forwardRef } from "react";
import {
  MenuItem as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
} from "@mui/material";

export interface MenuItemProps extends MuiMenuItemProps {
  label?: string;
}

const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(
  ({ label, children, className, ...props }, ref) => {
    return (
      <MuiMenuItem
        ref={ref}
        className={`text-sm min-h-9 hover:bg-black/[0.04] aria-selected:bg-blue-600/[0.08] aria-selected:hover:bg-blue-600/[0.12] ${
          className || ""
        }`}
        {...props}
      >
        {label || children}
      </MuiMenuItem>
    );
  }
);

MenuItem.displayName = "MenuItem";

export default MenuItem;
