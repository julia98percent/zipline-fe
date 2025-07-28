import { Drawer } from "@mui/material";
import NavigationContent from "./NavigationContent";

interface MobileNavigationBarProps {
  open: boolean;
  onClose: () => void;
}

const MobileNavigationBar = ({ open, onClose }: MobileNavigationBarProps) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      className="block md:hidden"
      classes={{
        paper:
          "w-60 box-border bg-white text-gray-800 border-r border-gray-200",
      }}
    >
      <NavigationContent onItemClick={onClose} />
    </Drawer>
  );
};

export default MobileNavigationBar;
