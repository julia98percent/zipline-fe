"use client";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";
import CustomLink from "@/components/CustomLink";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ForumIcon from "@mui/icons-material/Forum";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuthStore from "@/stores/useAuthStore";
import { logoutUser } from "@/apis/userService";
import { clearAllAuthState } from "@/utils/authUtil";
import { MENU_INFO, ParentMenuName } from "@/utils/pageUtils";
import { PRIMARY, TEXT } from "@/constants/colors";

const getMenuIcon = (name: ParentMenuName, isActive = false) => {
  const iconColor = isActive ? PRIMARY.main : TEXT.primary;

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
  const pathname = usePathname();
  const currentPath = pathname;
  const { user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logoutUser();
    } finally {
      clearAllAuthState();
      router.push("/sign-in");
    }
  };

  return (
    <div className="bg-neutral-100 h-full">
      <div className="p-4">
        <CustomLink href={"/"}>
          <div className="flex items-center">
            <Image
              src={"/assets/logo.png"}
              alt="ZIPLINE Logo"
              width={12}
              height={12}
              className="w-6 h-6 mr-2"
            />
            <h3 className="text-lg font-bold text-blue-800 text-primary">
              ZIPLINE
            </h3>
          </div>
        </CustomLink>
      </div>
      <List className="p-0">
        <ListItem disablePadding>
          <CustomLink href="/" className="w-full">
            <ListItemButton
              onClick={onItemClick}
              className="hover:bg-gray-50 px-4 justify-start"
              style={{
                borderLeft:
                  currentPath === "/" || currentPath?.startsWith("/dashboard")
                    ? `4px solid ${PRIMARY.main}`
                    : "none",
                backgroundColor:
                  currentPath === "/" || currentPath?.startsWith("/dashboard")
                    ? "var(--color-selected)"
                    : "transparent",
              }}
            >
              <ListItemIcon className="min-w-10">
                <DashboardIcon
                  className="text-2xl"
                  style={{
                    color:
                      currentPath === "/" ||
                      currentPath?.startsWith("/dashboard")
                        ? PRIMARY.main
                        : TEXT.primary,
                    fontSize: 24,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="대시보드"
                style={{
                  color:
                    currentPath === "/" || currentPath?.startsWith("/dashboard")
                      ? PRIMARY.main
                      : TEXT.primary,
                  fontWeight:
                    currentPath === "/" || currentPath?.startsWith("/dashboard")
                      ? "bold"
                      : "normal",
                }}
              />
            </ListItemButton>
          </CustomLink>
        </ListItem>
        <Divider />
        {MENU_INFO.map(({ name, key, to, submenu }) => {
          const hasSubmenu = Boolean(submenu);
          const isActive = hasSubmenu
            ? submenu?.some((sub) => currentPath?.startsWith(sub.to))
            : currentPath?.startsWith(to!);

          return (
            <ListItem
              key={key}
              disablePadding
              className="border-b border-gray-200 last:border-b-0"
            >
              {hasSubmenu ? (
                <div className="w-full">
                  <CustomLink href={submenu![0].to!}>
                    <ListItemButton
                      onClick={onItemClick}
                      className="hover:bg-gray-50"
                    >
                      <ListItemIcon className="min-w-10">
                        {getMenuIcon(name, isActive)}
                      </ListItemIcon>
                      <ListItemText
                        primary={name}
                        style={{
                          color: isActive ? PRIMARY.main : TEXT.primary,
                          fontWeight: isActive ? "bold" : "normal",
                        }}
                      />
                    </ListItemButton>
                  </CustomLink>
                  <List className="py-0">
                    {submenu?.map((sub) => (
                      <CustomLink href={sub.to} key={`${sub.to}-submenu`}>
                        <ListItemButton
                          onClick={onItemClick}
                          className="hover:bg-gray-50 justify-start px-4 py-1 mb-1 ml-8"
                          style={{
                            borderLeft: currentPath?.startsWith(sub.to)
                              ? `4px solid ${PRIMARY.main}`
                              : "none",
                            backgroundColor: currentPath?.startsWith(sub.to)
                              ? "var(--color-selected)"
                              : "transparent",
                          }}
                        >
                          <ListItemText
                            primary={sub.name}
                            className="text-sm"
                            style={{
                              color: currentPath?.startsWith(sub.to)
                                ? PRIMARY.main
                                : TEXT.primary,
                              fontWeight: currentPath?.startsWith(sub.to)
                                ? "bold"
                                : "normal",
                            }}
                          />
                        </ListItemButton>
                      </CustomLink>
                    ))}
                  </List>
                </div>
              ) : (
                <CustomLink href={to as `/${string}`} className="w-full">
                  <ListItemButton
                    onClick={onItemClick}
                    className="hover:bg-gray-50"
                    style={{
                      borderLeft: isActive ? `4px solid ${PRIMARY.main}` : "none",
                      backgroundColor: isActive
                        ? "var(--color-selected)"
                        : "transparent",
                    }}
                  >
                    <ListItemIcon className="min-w-10">
                      {getMenuIcon(name, isActive)}
                    </ListItemIcon>
                    <ListItemText
                      primary={name}
                      style={{
                        color: isActive ? PRIMARY.main : TEXT.primary,
                        fontWeight: isActive ? "bold" : "normal",
                      }}
                    />
                  </ListItemButton>
                </CustomLink>
              )}
            </ListItem>
          );
        })}
        <CustomLink href={"/my"}>
          <div className="m-3 px-2 py-2 rounded bg-white border border-gray-200">
            <span className="font-semibold">{user?.name || "사용자"} 님</span>
            <span className="text-sm text-gray-600">
              {user?.email || "이메일"}
            </span>
            <Divider className="my-1" />
            <div
              className="flex text-sm text-gray-600 items-center p-1 gap-1"
              onClick={handleLogout}
            >
              <LogoutIcon className="w-5" />
              <span>로그아웃</span>
            </div>
          </div>
        </CustomLink>
      </List>
    </div>
  );
};

export default NavigationContent;
