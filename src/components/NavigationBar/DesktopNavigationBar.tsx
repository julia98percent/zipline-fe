import { Drawer } from "@mui/material";
import NavigationContent from "./NavigationContent";

const DesktopNavigationBar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        height: "100vh",
        overflow: "auto",
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
          color: "#222222",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <NavigationContent />
    </Drawer>
  );
};

export default DesktopNavigationBar;
