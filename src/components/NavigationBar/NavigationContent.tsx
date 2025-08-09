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
    key: "properties",
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
      return <BusinessIcon style={{ color: iconColor }} />;
    case "고객":
      return <PeopleIcon style={{ color: iconColor }} />;
    case "계약":
      return <SettingsIcon style={{ color: iconColor }} />;
    case "일정":
      return <CalendarMonthIcon style={{ color: iconColor }} />;
    case "상담":
      return <ForumIcon style={{ color: iconColor }} />;
    case "문자":
      return <EmailIcon style={{ color: iconColor }} />;
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
      <Box className="p-4">
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <Box className="flex items-center">
            <img src={Logo} alt="ZIPLINE Logo" className="w-6 h-6 mr-2" />
            <Typography
              variant="h6"
              className="font-bold text-blue-800 text-primary"
            >
              ZIPLINE
            </Typography>
          </Box>
        </Link>
      </Box>
      <List className="pt-1">
        <ListItem disablePadding>
          <Link to="/" style={{ width: "100%", textDecoration: "none" }}>
            <ListItemButton
              onClick={onItemClick}
              className="hover:bg-gray-50 px-4 justify-start"
              style={{
                borderLeft:
                  currentPath === "/" || currentPath.startsWith("/dashboard")
                    ? "4px solid #164F9E"
                    : "none",
                backgroundColor:
                  currentPath === "/" || currentPath.startsWith("/dashboard")
                    ? "rgba(22, 79, 158, 0.04)"
                    : "transparent",
              }}
            >
              <ListItemIcon className="min-w-10">
                <DashboardIcon
                  className="text-2xl"
                  style={{
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
                style={{
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
            ? submenu?.some((sub) => currentPath.startsWith(sub.to))
            : currentPath.startsWith(to!);

          return (
            <ListItem
              key={key}
              disablePadding
              className="border-b border-gray-200 last:border-b-0"
            >
              {hasSubmenu ? (
                <Box className="w-full">
                  <Link
                    to={submenu![0].to}
                    style={{ width: "100%", textDecoration: "none" }}
                  >
                    <ListItemButton
                      onClick={onItemClick}
                      className="hover:bg-gray-50"
                      style={{
                        borderBottom: "none",
                        borderLeft: isActive ? "4px solid #164F9E" : "none",
                        backgroundColor: isActive
                          ? "rgba(22, 79, 158, 0.04)"
                          : "transparent",
                      }}
                    >
                      <ListItemIcon className="min-w-10">
                        {getMenuIcon(name, isActive)}
                      </ListItemIcon>
                      <ListItemText
                        primary={name}
                        style={{
                          color: isActive ? "#164F9E" : "#222222",
                          fontWeight: isActive ? "bold" : "normal",
                        }}
                      />
                    </ListItemButton>
                  </Link>
                  <List className="mt-0 mb-0">
                    {submenu?.map((sub) => (
                      <Link
                        to={sub.to}
                        key={`${sub.to}-submenu`}
                        style={{ textDecoration: "none" }}
                      >
                        <ListItemButton
                          onClick={onItemClick}
                          className="hover:bg-gray-50 justify-start px-4 py-1 mb-1 ml-8"
                          style={{
                            borderLeft: currentPath.startsWith(sub.to)
                              ? "4px solid #164F9E"
                              : "none",
                            backgroundColor: currentPath.startsWith(sub.to)
                              ? "rgba(22, 79, 158, 0.04)"
                              : "transparent",
                          }}
                        >
                          <ListItemText
                            primary={sub.name}
                            className="text-sm"
                            style={{
                              color: currentPath.startsWith(sub.to)
                                ? "#164F9E"
                                : "#222222",
                              fontWeight: currentPath.startsWith(sub.to)
                                ? "bold"
                                : "normal",
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
                    className="hover:bg-gray-50"
                    style={{
                      borderLeft: isActive ? "4px solid #164F9E" : "none",
                      backgroundColor: isActive
                        ? "rgba(22, 79, 158, 0.04)"
                        : "transparent",
                    }}
                  >
                    <ListItemIcon className="min-w-10">
                      {getMenuIcon(name, isActive)}
                    </ListItemIcon>
                    <ListItemText
                      primary={name}
                      style={{
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
