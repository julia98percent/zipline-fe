import { Drawer } from "@mui/material";
import NavigationContent from "./NavigationContent";

const DesktopNavigationBar = () => {
  return (
    <Drawer
      variant="permanent"
      className="w-60 shrink-0 h-screen overflow-auto hidden md:block"
      classes={{
        paper:
          "w-60 box-border bg-white text-gray-800 border-r border-gray-200",
      }}
    >
      <NavigationContent />
    </Drawer>
  );
};

export default DesktopNavigationBar;
