import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MENU_INFO = [
  {
    name: "매물",
    key: "agent-properties",
    to: "properties",
    // submenu
  },
  { name: "고객", key: "customers", to: "customers" },
  {
    name: "문자",
    key: "messages",
    to: "messages",
    // submenu
  },
];

const NavigationBar = ({ userInfo }: { userInfo: { name: string } }) => {
  const location = useLocation();
  const currentRoute = location.pathname.split("/")[1];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#2E5D9F",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "0 16px",
      }}
    >
      <Toolbar className="flex justify-between">
        <Link to={"/"}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            LOGO
          </Typography>
        </Link>

        <Box className="flex gap-4">
          {MENU_INFO.map(({ name, key, to }) => (
            <Link to={to} key={`${key}-menu`}>
              <Button
                sx={{
                  color: currentRoute.startsWith(to) ? "#2E5D9F" : "inherit",
                  fontWeight: currentRoute.startsWith(to) ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: "#E3F2FD",
                    color: "#1E88E5",
                  },
                }}
              >
                {name}
              </Button>
            </Link>
          ))}
        </Box>

        <Box>
          <Typography variant="body1">{userInfo.name}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
