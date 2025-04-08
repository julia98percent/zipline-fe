import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import Button from "./Button";

const MENU_INFO = [
  {
    name: "매물",
    key: "agent-properties",
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
  const currentPath = location.pathname;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const open = Boolean(anchorEl);
  const submenuOpen = Boolean(submenuAnchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSubmenuAnchorEl(event.currentTarget);
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
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
          {MENU_INFO.map(({ name, key, to, submenu }) =>
            submenu ? (
              <>
                <Button
                  key={`${key}-menu`}
                  text={name}
                  onClick={handleSubmenuClick}
                  sx={{
                    color: currentPath.startsWith(submenu[0].to)
                      ? "#2E5D9F"
                      : "inherit",
                    fontWeight: currentPath.startsWith(submenu[0].to)
                      ? "bold"
                      : "normal",
                    "&:hover": {
                      backgroundColor: "#E3F2FD",
                      color: "#1E88E5",
                    },
                  }}
                />
                <Menu
                  anchorEl={submenuAnchorEl}
                  open={submenuOpen}
                  onClose={handleSubmenuClose}
                >
                  {submenu.map((sub) => (
                    <Link to={sub.to} key={`${sub.to}-submenu`}>
                      <MenuItem
                        onClick={handleSubmenuClose}
                        sx={{
                          fontWeight:
                            currentPath === sub.to ? "bold" : "normal",
                        }}
                      >
                        {sub.name}
                      </MenuItem>
                    </Link>
                  ))}
                </Menu>
              </>
            ) : (
              <Link to={to} key={`${key}-menu`}>
                <Button
                  text={name}
                  sx={{
                    color: currentPath.startsWith(to!) ? "#2E5D9F" : "inherit",
                    fontWeight: currentPath.startsWith(to!) ? "bold" : "normal",
                    "&:hover": {
                      backgroundColor: "#E3F2FD",
                      color: "#1E88E5",
                    },
                  }}
                />
              </Link>
            )
          )}
        </Box>
        <Box>
          <Button text={userInfo.name} onClick={handleClick} />
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <Link to="/my">
              <MenuItem onClick={handleClose}>마이페이지</MenuItem>
            </Link>
            <MenuItem onClick={handleClose}>로그아웃</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
