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
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
          color: "#222222",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <NavigationContent onItemClick={onClose} />
    </Drawer>
  );
};

export default MobileNavigationBar;
