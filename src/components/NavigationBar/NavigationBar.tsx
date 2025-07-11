import DesktopNavigationBar from "./DesktopNavigationBar";
import MobileNavigationBar from "./MobileNavigationBar";

interface NavigationBarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NavigationBar = ({ mobileOpen, onMobileClose }: NavigationBarProps) => {
  return (
    <>
      <DesktopNavigationBar />
      <MobileNavigationBar
        open={mobileOpen || false}
        onClose={onMobileClose || (() => {})}
      />
    </>
  );
};

export default NavigationBar;
