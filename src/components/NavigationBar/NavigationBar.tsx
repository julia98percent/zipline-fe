import { useState } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  ListItemIcon,
  Collapse,
  Button as MuiButton,
} from "@mui/material";
import { useLocation, Link, useNavigate } from "react-router-dom";
import useUserStore from "@stores/useUserStore";
import SubmittedSurveyPopup from "./SubmittedSurveyPopup";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import Logo from "@assets/logo.png";
import CreateModal from "@components/CreateModal/CreateModal";

interface FormData {
  property: {
    title: string;
    type: string;
    price: string;
    address: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
    type: string;
  };
  contract: {
    customerId: string;
    propertyId: string;
    type: string;
    startDate: string;
    endDate: string;
  };
  schedule: {
    title: string;
    date: string;
    time: string;
    type: string;
    description: string;
  };
  consultation: {
    customerName: string;
    title: string;
    date: string;
    time: string;
    description: string;
  };
}

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
  { name: "계약", key: "contracts", to: "/contracts" },
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

const NavigationBar = ({ userName }: { userName: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [createTab, setCreateTab] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    property: {
      title: "",
      type: "",
      price: "",
      address: "",
    },
    customer: {
      name: "",
      phone: "",
      email: "",
      type: "",
    },
    contract: {
      customerId: "",
      propertyId: "",
      type: "",
      startDate: "",
      endDate: "",
    },
    schedule: {
      title: "",
      date: "",
      time: "",
      type: "",
      description: "",
    },
    consultation: {
      customerName: "",
      title: "",
      date: "",
      time: "",
      description: "",
    },
  });

  const { clearUser } = useUserStore();

  const open = Boolean(anchorEl);
  const submenuOpen = Boolean(submenuAnchorEl);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsUserMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setIsUserMenuOpen(false);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("_ZA");
    clearUser();
    navigate("/sign-in");
    handleUserMenuClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setSubmenuAnchorEl(event.currentTarget);
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setCreateTab(newValue);
  };

  const handleFormChange = (
    section: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCreateSubmit = (formData: FormData) => {
    // TODO: API 연동
    console.log(formData);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
          color: "#222222",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
      }}
    >
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
      <Box sx={{ mt: 3, mb: 1 }}>
        <Box>
          <MuiButton
            variant="contained"
            fullWidth
            onClick={handleCreateClick}
            startIcon={<AddIcon sx={{ fontSize: 24 }} />}
            sx={{
              backgroundColor: "#164F9E",
              color: "white",
              boxShadow: "none",
              borderRadius: 0,
              height: "48px",
              justifyContent: "flex-start",
              pl: 2,
              fontSize: "16px",
              "& .MuiButton-startIcon": {
                margin: 0,
                marginRight: 2,
              },
              "&:hover": {
                backgroundColor: "#0D3B7A",
                boxShadow: "none",
              },
            }}
          >
            새로 만들기
          </MuiButton>
          <Typography
            variant="caption"
            sx={{
              color: "#666666",
              pl: 2,
              mt: 0.5,
              fontSize: "12px",
            }}
          >
            매물 · 고객 · 계약 · 일정 · 상담
          </Typography>
        </Box>
      </Box>
      <List>
        <ListItem disablePadding>
          <Link to="/" style={{ width: "100%", textDecoration: "none" }}>
            <ListItemButton
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
        {MENU_INFO.map(({ name, key, to, submenu }) => (
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
            {submenu ? (
              <Box sx={{ width: "100%" }}>
                <Link
                  to={submenu[0].to}
                  style={{ width: "100%", textDecoration: "none" }}
                >
                  <ListItemButton
                    sx={{
                      borderBottom: "none",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                      borderLeft:
                        currentPath.startsWith(submenu[0].to) &&
                        !submenu.some((sub) => currentPath === sub.to)
                          ? "4px solid #164F9E"
                          : "none",
                      backgroundColor:
                        currentPath.startsWith(submenu[0].to) &&
                        !submenu.some((sub) => currentPath === sub.to)
                          ? "rgba(22, 79, 158, 0.04)"
                          : "transparent",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {name === "매물" && (
                        <BusinessIcon
                          sx={{
                            color:
                              currentPath.startsWith(submenu[0].to) ||
                              submenu.some((sub) => currentPath === sub.to)
                                ? "#164F9E"
                                : "#222222",
                          }}
                        />
                      )}
                      {name === "고객" && (
                        <PeopleIcon
                          sx={{
                            color:
                              currentPath.startsWith(submenu[0].to) &&
                              !submenu.some((sub) => currentPath === sub.to)
                                ? "#164F9E"
                                : "#222222",
                          }}
                        />
                      )}
                      {name === "계약" && (
                        <SettingsIcon
                          sx={{
                            color:
                              currentPath.startsWith(submenu[0].to) &&
                              !submenu.some((sub) => currentPath === sub.to)
                                ? "#164F9E"
                                : "#222222",
                          }}
                        />
                      )}
                      {name === "문자" && (
                        <ChatIcon
                          sx={{
                            color:
                              currentPath.startsWith(submenu[0].to) ||
                              submenu.some((sub) => currentPath === sub.to)
                                ? "#164F9E"
                                : "#222222",
                          }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={name}
                      sx={{
                        color:
                          currentPath.startsWith(submenu[0].to) ||
                          submenu.some((sub) => currentPath === sub.to)
                            ? "#164F9E"
                            : "#222222",
                        fontWeight:
                          currentPath.startsWith(submenu[0].to) ||
                          submenu.some((sub) => currentPath === sub.to)
                            ? "bold"
                            : "normal",
                      }}
                    />
                  </ListItemButton>
                </Link>
                <List sx={{ pl: { xs: 0, md: 2 } }}>
                  {submenu.map((sub) => (
                    <Link
                      to={sub.to}
                      key={`${sub.to}-submenu`}
                      style={{ textDecoration: "none" }}
                    >
                      <ListItemButton
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
                        }}
                      >
                        <ListItemText
                          primary={sub.name}
                          sx={{
                            display: { xs: "none", md: "block" },
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
              <Link to={to!} style={{ width: "100%", textDecoration: "none" }}>
                <ListItemButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    borderLeft: currentPath.startsWith(to!)
                      ? "4px solid #164F9E"
                      : "none",
                    backgroundColor: currentPath.startsWith(to!)
                      ? "rgba(22, 79, 158, 0.04)"
                      : "transparent",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {name === "매물" && (
                      <BusinessIcon
                        sx={{
                          color:
                            currentPath.startsWith(to!) ||
                            to === "/properties/private" ||
                            to === "/properties/public"
                              ? "#164F9E"
                              : "#222222",
                        }}
                      />
                    )}
                    {name === "고객" && (
                      <PeopleIcon
                        sx={{
                          color: currentPath.startsWith(to!)
                            ? "#164F9E"
                            : "#222222",
                        }}
                      />
                    )}
                    {name === "계약" && (
                      <SettingsIcon
                        sx={{
                          color: currentPath.startsWith(to!)
                            ? "#164F9E"
                            : "#222222",
                        }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={name}
                    sx={{
                      display: { xs: "none", md: "block" },
                      color: currentPath.startsWith(to!)
                        ? "#164F9E"
                        : "#222222",
                      fontWeight: currentPath.startsWith(to!)
                        ? "bold"
                        : "normal",
                    }}
                  />
                </ListItemButton>
              </Link>
            )}
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: "auto", p: 2 }}>
        <MuiButton
          onClick={handleUserMenuClick}
          sx={{
            color: "#222222",
            justifyContent: "flex-start",
            width: "calc(100% - 24px)",
            border: "1px solid #E0E0E0",
            borderRadius: "12px",
            mx: 1.5,
            my: 0.5,
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              border: "1px solid #E0E0E0",
            },
            "& .MuiButton-startIcon": {
              margin: 0,
              marginRight: 1,
            },
          }}
          startIcon={<AccountCircleIcon />}
        >
          {userName}
        </MuiButton>
        <Menu
          anchorEl={anchorEl}
          open={isUserMenuOpen}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              width: "calc(240px - 48px)",
              marginTop: "-40px",
              marginLeft: "-1.5px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              "& .MuiMenuItem-root": {
                px: 2,
                py: 1.5,
                "&:first-of-type": {
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                },
                "&:last-child": {
                  borderBottomLeftRadius: "12px",
                  borderBottomRightRadius: "12px",
                },
              },
            },
          }}
        >
          <Link to="/my" style={{ textDecoration: "none" }}>
            <MenuItem
              onClick={handleUserMenuClose}
              sx={{
                fontWeight: currentPath === "/my" ? "bold" : "normal",
                color: "#222222",
              }}
            >
              마이페이지
            </MenuItem>
          </Link>
          <MenuItem onClick={handleLogout} sx={{ color: "#222222" }}>
            로그아웃
          </MenuItem>
        </Menu>
      </Box>

      <CreateModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSubmit={handleCreateSubmit}
      />
    </Drawer>
  );
};

export default NavigationBar;
