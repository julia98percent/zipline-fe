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
      { name: "개인 매물", to: "/properties/private", icon: "home" },
      { name: "공개 매물", to: "/properties/public", icon: "apartment" },
    ],
  },
  { name: "고객", key: "customers", to: "/customers" },
  { name: "계약", key: "contracts", to: "/contracts" },
  {
    name: "문자",
    key: "messages",
    submenu: [
      { name: "단체 문자 발송", to: "/messages/bulk", icon: "send" },
      { name: "문자 템플릿", to: "/messages/templates", icon: "description" },
      { name: "문자 발송 내역", to: "/messages/history", icon: "history" },
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

  const handleClickLogOut = () => {
    sessionStorage.removeItem("_ZA");
    clearUser();
    navigate("sign-in");
    handleClose();
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

  const handleSubmit = () => {
    // TODO: API 연동
    console.log(formData);
    handleCreateModalClose();
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
                      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
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
                        <ListItemIcon
                          sx={{
                            minWidth: { xs: 0, md: 40 },
                            mr: { xs: 0, md: 2 },
                          }}
                        >
                          {sub.icon === "home" && (
                            <HomeIcon
                              sx={{
                                color:
                                  currentPath === sub.to
                                    ? "#164F9E"
                                    : "#222222",
                              }}
                            />
                          )}
                          {sub.icon === "apartment" && (
                            <ApartmentIcon
                              sx={{
                                color:
                                  currentPath === sub.to
                                    ? "#164F9E"
                                    : "#222222",
                              }}
                            />
                          )}
                          {sub.icon === "send" && (
                            <SendIcon
                              sx={{
                                color:
                                  currentPath === sub.to
                                    ? "#164F9E"
                                    : "#222222",
                              }}
                            />
                          )}
                          {sub.icon === "description" && (
                            <DescriptionIcon
                              sx={{
                                color:
                                  currentPath === sub.to
                                    ? "#164F9E"
                                    : "#222222",
                              }}
                            />
                          )}
                          {sub.icon === "history" && (
                            <HistoryIcon
                              sx={{
                                color:
                                  currentPath === sub.to
                                    ? "#164F9E"
                                    : "#222222",
                              }}
                            />
                          )}
                        </ListItemIcon>
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
          onClick={handleClick}
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
          open={open}
          onClose={handleClose}
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
              onClick={handleClose}
              sx={{
                fontWeight: currentPath === "/my" ? "bold" : "normal",
                color: "#222222",
              }}
            >
              마이페이지
            </MenuItem>
          </Link>
          <MenuItem onClick={handleClickLogOut} sx={{ color: "#222222" }}>
            로그아웃
          </MenuItem>
        </Menu>
      </Box>

      <Dialog
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "800px",
            height: "700px",
            maxHeight: "80vh",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#164F9E", fontWeight: "bold", p: 3 }}>
          등록하기
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Tabs
            value={createTab}
            onChange={handleCreateTabChange}
            sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
          >
            <Tab label="매물 등록" />
            <Tab label="고객 등록" />
            <Tab label="계약 등록" />
            <Tab label="일정 등록" />
            <Tab label="상담 등록" />
          </Tabs>

          {createTab === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="제목"
                  value={formData.property.title}
                  onChange={(e) =>
                    handleFormChange("property", "title", e.target.value)
                  }
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <FormControl fullWidth>
                    <InputLabel>매물 유형</InputLabel>
                    <Select
                      value={formData.property.type}
                      onChange={(e) =>
                        handleFormChange("property", "type", e.target.value)
                      }
                      label="매물 유형"
                    >
                      <SelectMenuItem value="apartment">아파트</SelectMenuItem>
                      <SelectMenuItem value="house">주택</SelectMenuItem>
                      <SelectMenuItem value="land">토지</SelectMenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <TextField
                    fullWidth
                    label="가격"
                    value={formData.property.price}
                    onChange={(e) =>
                      handleFormChange("property", "price", e.target.value)
                    }
                  />
                </Box>
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="주소"
                  value={formData.property.address}
                  onChange={(e) =>
                    handleFormChange("property", "address", e.target.value)
                  }
                />
              </Box>
            </Box>
          )}

          {createTab === 1 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="고객명"
                  value={formData.customer.name}
                  onChange={(e) =>
                    handleFormChange("customer", "name", e.target.value)
                  }
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="연락처"
                  value={formData.customer.phone}
                  onChange={(e) =>
                    handleFormChange("customer", "phone", e.target.value)
                  }
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="이메일"
                  value={formData.customer.email}
                  onChange={(e) =>
                    handleFormChange("customer", "email", e.target.value)
                  }
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel>고객 유형</InputLabel>
                  <Select
                    value={formData.customer.type}
                    label="고객 유형"
                    onChange={(e) =>
                      handleFormChange("customer", "type", e.target.value)
                    }
                  >
                    <SelectMenuItem value="buyer">매수자</SelectMenuItem>
                    <SelectMenuItem value="seller">매도자</SelectMenuItem>
                    <SelectMenuItem value="tenant">임차인</SelectMenuItem>
                    <SelectMenuItem value="landlord">임대인</SelectMenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}

          {createTab === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="고객 ID"
                  value={formData.contract.customerId}
                  onChange={(e) =>
                    handleFormChange("contract", "customerId", e.target.value)
                  }
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="매물 ID"
                  value={formData.contract.propertyId}
                  onChange={(e) =>
                    handleFormChange("contract", "propertyId", e.target.value)
                  }
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel>계약 유형</InputLabel>
                  <Select
                    value={formData.contract.type}
                    label="계약 유형"
                    onChange={(e) =>
                      handleFormChange("contract", "type", e.target.value)
                    }
                  >
                    <SelectMenuItem value="sale">매매</SelectMenuItem>
                    <SelectMenuItem value="rent">임대</SelectMenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="시작일"
                  type="date"
                  value={formData.contract.startDate}
                  onChange={(e) =>
                    handleFormChange("contract", "startDate", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="종료일"
                  type="date"
                  value={formData.contract.endDate}
                  onChange={(e) =>
                    handleFormChange("contract", "endDate", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          )}

          {createTab === 3 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="일정 제목"
                  value={formData.schedule.title}
                  onChange={(e) =>
                    handleFormChange("schedule", "title", e.target.value)
                  }
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <TextField
                    fullWidth
                    label="날짜"
                    type="date"
                    value={formData.schedule.date}
                    onChange={(e) =>
                      handleFormChange("schedule", "date", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <TextField
                    fullWidth
                    label="시간"
                    type="time"
                    value={formData.schedule.time}
                    onChange={(e) =>
                      handleFormChange("schedule", "time", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel>일정 유형</InputLabel>
                  <Select
                    value={formData.schedule.type}
                    label="일정 유형"
                    onChange={(e) =>
                      handleFormChange("schedule", "type", e.target.value)
                    }
                  >
                    <SelectMenuItem value="meeting">미팅</SelectMenuItem>
                    <SelectMenuItem value="inspection">실사</SelectMenuItem>
                    <SelectMenuItem value="contract">계약</SelectMenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="설명"
                  multiline
                  rows={4}
                  value={formData.schedule.description}
                  onChange={(e) =>
                    handleFormChange("schedule", "description", e.target.value)
                  }
                />
              </Box>
            </Box>
          )}

          {createTab === 4 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="고객명"
                  value={formData.consultation.customerName}
                  onChange={(e) =>
                    handleFormChange(
                      "consultation",
                      "customerName",
                      e.target.value
                    )
                  }
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="상담 제목"
                  value={formData.consultation.title}
                  onChange={(e) =>
                    handleFormChange("consultation", "title", e.target.value)
                  }
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="날짜"
                  type="date"
                  value={formData.consultation.date}
                  onChange={(e) =>
                    handleFormChange("consultation", "date", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="시간"
                  type="time"
                  value={formData.consultation.time}
                  onChange={(e) =>
                    handleFormChange("consultation", "time", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="상담 내용"
                  multiline
                  rows={4}
                  value={formData.consultation.description}
                  onChange={(e) =>
                    handleFormChange(
                      "consultation",
                      "description",
                      e.target.value
                    )
                  }
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCreateModalClose} sx={{ color: "#222222" }}>
            취소
          </MuiButton>
          <MuiButton
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#164F9E",
              color: "white",
              "&:hover": {
                backgroundColor: "#0D3B7A",
              },
            }}
          >
            등록
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default NavigationBar;
