import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Button from "./Button";

const MENU_INFO = [
  {
    name: "매물",
    key: "agent-properties",
    to: "properties",
    submenu: [
      { name: "개인 매물", to: "/properties/private" },
      { name: "공개 매물", to: "/properties/public" },
    ],
  },
  { name: "고객", key: "customers", to: "/customers" },
  {
    name: "문자",
    key: "messages",
    to: "/messages",
  },
];

const NavigationBar = ({ userInfo }: { userInfo: { name: string } }) => {
  const location = useLocation();
  const currentRoute = location.pathname.split("/")[1];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    key: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSubmenuOpen(key);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSubmenuOpen(null);
  };

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
          {MENU_INFO.map(({ name, key, to, submenu }) => (
            <Box key={`${key}-menu`}>
              {submenu ? (
                <>
                  <Button
                    text={name}
                    sx={{
                      color: currentRoute.startsWith(to)
                        ? "#2E5D9F"
                        : "inherit",
                      fontWeight: currentRoute.startsWith(to)
                        ? "bold"
                        : "normal",
                      "&:hover": {
                        backgroundColor: "#E3F2FD",
                        color: "#1E88E5",
                      },
                    }}
                    onClick={(e) => handleMenuOpen(e, key)}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={submenuOpen === key}
                    onClose={handleMenuClose}
                  >
                    {submenu.map(({ name, to }) => (
                      <MenuItem key={to} onClick={handleMenuClose}>
                        <Link
                          to={to}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {name}
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Link to={to} style={{ textDecoration: "none" }}>
                  <Button
                    text={name}
                    sx={{
                      color: currentRoute.startsWith(to)
                        ? "#2E5D9F"
                        : "inherit",
                      fontWeight: currentRoute.startsWith(to)
                        ? "bold"
                        : "normal",
                      "&:hover": {
                        backgroundColor: "#E3F2FD",
                        color: "#1E88E5",
                      },
                    }}
                  />
                </Link>
              )}
            </Box>
          ))}
        </Box>
        {/* <Box>
          <Button text={userInfo.name} onClick={handleClick} />
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <Link to="/my">
              <MenuItem onClick={handleClose}>마이페이지</MenuItem>
            </Link>
            <MenuItem onClick={handleClose}>로그아웃</MenuItem>
          </Menu>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
