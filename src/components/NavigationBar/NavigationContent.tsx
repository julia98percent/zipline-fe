import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Logo from "@assets/logo.png";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ForumIcon from "@mui/icons-material/Forum";
import EmailIcon from "@mui/icons-material/Email";

type ParentMenuName = "매물" | "고객" | "계약" | "일정" | "상담" | "문자";

interface SubmenuItem {
  name: string;
  to: string;
}

interface MenuItem {
  name: ParentMenuName;
  key: string;
  to?: string;
  submenu?: SubmenuItem[];
}

const MENU_INFO: MenuItem[] = [
  {
    name: "매물",
    key: "agent-properties",
    submenu: [
      { name: "개인 매물", to: "/properties/agent" },
      { name: "공개 매물", to: "/properties/public" },
    ],
  },
  { name: "고객", key: "customers", to: "/customers" },
  { name: "계약", key: "contracts", to: "/contracts" },
  { name: "일정", key: "schedules", to: "/schedules" },
  {
    name: "상담",
    key: "counsels",
    submenu: [
      { name: "일반 상담", to: "/counsels" },
      { name: "사전 상담", to: "/counsels/pre" },
    ],
  },
  {
    name: "문자",
    key: "messages",
    submenu: [
      { name: "단체 문자 발송", to: "/messages/bulk" },
      { name: "문자 템플릿", to: "/messages/templates" },
      { name: "문자 발송 내역", to: "/messages/history" },
    ],
  },
];

const getMenuIcon = (name: ParentMenuName, isActive: boolean) => {
  const iconColor = isActive ? "#164F9E" : "#222222";

  switch (name) {
    case "매물":
      return <BusinessIcon sx={{ color: iconColor }} />;
    case "고객":
      return <PeopleIcon sx={{ color: iconColor }} />;
    case "계약":
      return <SettingsIcon sx={{ color: iconColor }} />;
    case "일정":
      return <CalendarMonthIcon sx={{ color: iconColor }} />;
    case "상담":
      return <ForumIcon sx={{ color: iconColor }} />;
    case "문자":
      return <EmailIcon sx={{ color: iconColor }} />;
    default:
      return null;
  }
};

interface NavigationContentProps {
  onItemClick?: () => void;
}

const NavigationContent = ({ onItemClick }: NavigationContentProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={Logo}
              alt="ZIPLINE Logo"
              style={{ width: "24px", height: "24px", marginRight: "8px" }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#164F9E" }}
            >
              ZIPLINE
            </Typography>
          </Box>
        </Link>
      </Box>
      <List sx={{ pt: "4px" }}>
        <ListItem disablePadding>
          <Link to="/" style={{ width: "100%", textDecoration: "none" }}>
            <ListItemButton
              onClick={onItemClick}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
                borderLeft:
                  currentPath === "/" || currentPath.startsWith("/dashboard")
                    ? "4px solid #164F9E"
                    : "none",
                backgroundColor:
                  currentPath === "/" || currentPath.startsWith("/dashboard")
                    ? "rgba(22, 79, 158, 0.04)"
                    : "transparent",
                justifyContent: "flex-start",
                px: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <DashboardIcon
                  sx={{
                    color:
                      currentPath === "/" ||
                      currentPath.startsWith("/dashboard")
                        ? "#164F9E"
                        : "#222222",
                    fontSize: 24,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="대시보드"
                sx={{
                  color:
                    currentPath === "/" || currentPath.startsWith("/dashboard")
                      ? "#164F9E"
                      : "#222222",
                  fontWeight:
                    currentPath === "/" || currentPath.startsWith("/dashboard")
                      ? "bold"
                      : "normal",
                }}
              />
            </ListItemButton>
          </Link>
        </ListItem>
        <Divider />
        {MENU_INFO.map(({ name, key, to, submenu }) => {
          const hasSubmenu = Boolean(submenu);
          const isActive = hasSubmenu
            ? submenu?.some((sub) => currentPath === sub.to) ||
              (currentPath.startsWith(submenu![0].to) &&
                !submenu?.some((sub) => currentPath === sub.to))
            : currentPath.startsWith(to!);

          return (
            <ListItem
              key={key}
              disablePadding
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              {hasSubmenu ? (
                <Box sx={{ width: "100%" }}>
                  <Link
                    to={submenu![0].to}
                    style={{ width: "100%", textDecoration: "none" }}
                  >
                    <ListItemButton
                      onClick={onItemClick}
                      sx={{
                        borderBottom: "none",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        borderLeft: isActive ? "4px solid #164F9E" : "none",
                        backgroundColor: isActive
                          ? "rgba(22, 79, 158, 0.04)"
                          : "transparent",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getMenuIcon(name, isActive)}
                      </ListItemIcon>
                      <ListItemText
                        primary={name}
                        sx={{
                          color: isActive ? "#164F9E" : "#222222",
                          fontWeight: isActive ? "bold" : "normal",
                        }}
                      />
                    </ListItemButton>
                  </Link>
                  <List sx={{ mt: 0, mb: 0 }}>
                    {submenu?.map((sub) => (
                      <Link
                        to={sub.to}
                        key={`${sub.to}-submenu`}
                        style={{ textDecoration: "none" }}
                      >
                        <ListItemButton
                          onClick={onItemClick}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                            borderLeft:
                              currentPath === sub.to
                                ? "4px solid #164F9E"
                                : "none",
                            backgroundColor:
                              currentPath === sub.to
                                ? "rgba(22, 79, 158, 0.04)"
                                : "transparent",
                            justifyContent: { xs: "center", md: "flex-start" },
                            px: { xs: 0, md: 2 },
                            ml: 4,
                            py: 0.5,
                            mb: 0.25,
                          }}
                        >
                          <ListItemText
                            primary={sub.name}
                            sx={{
                              color:
                                currentPath === sub.to ? "#164F9E" : "#222222",
                              fontWeight:
                                currentPath === sub.to ? "bold" : "normal",
                              fontSize: "0.875rem",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </Box>
              ) : (
                <Link
                  to={to!}
                  style={{ width: "100%", textDecoration: "none" }}
                >
                  <ListItemButton
                    onClick={onItemClick}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                      borderLeft: isActive ? "4px solid #164F9E" : "none",
                      backgroundColor: isActive
                        ? "rgba(22, 79, 158, 0.04)"
                        : "transparent",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getMenuIcon(name, isActive)}
                    </ListItemIcon>
                    <ListItemText
                      primary={name}
                      sx={{
                        color: isActive ? "#164F9E" : "#222222",
                        fontWeight: isActive ? "bold" : "normal",
                      }}
                    />
                  </ListItemButton>
                </Link>
              )}
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default NavigationContent;
