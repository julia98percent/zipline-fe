import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "@stores/useUserStore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import apiClient from "@apis/apiClient";

interface PageHeaderProps {
  title: string;
  userName: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, userName, action }: PageHeaderProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { clearUser } = useUserStore();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const accessToken = sessionStorage.getItem("_ZA");
      const deviceId = localStorage.getItem("deviceId");

      if (!accessToken || !deviceId) {
        throw new Error("로그아웃 정보가 부족합니다.");
      }

      await apiClient.post(
        "/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Device-Id": deviceId,
          },
          withCredentials: true,
        }
      );

      sessionStorage.removeItem("_ZA");
      clearUser();
      navigate("/sign-in");
    } catch (error) {
      sessionStorage.removeItem("_ZA");
      clearUser();
      navigate("/sign-in");
    } finally {
      handleClose();
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E0E0E0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "70px",
        px: 2,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: "bold", color: "#222222" }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {action}
        <Button
          onClick={handleClick}
          sx={{
            color: "#222222",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
          startIcon={<AccountCircleIcon />}
        >
          {userName}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              minWidth: "150px",
            },
          }}
        >
          <Link to="/my" style={{ textDecoration: "none", color: "inherit" }}>
            <MenuItem onClick={handleClose}>마이페이지</MenuItem>
          </Link>
          <MenuItem onClick={handleLogout} sx={{ color: "#d32f2f" }}>
            로그아웃
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default PageHeader;
