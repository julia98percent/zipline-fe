"use client";
import { useRouter } from "next/navigation";
import { ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuthStore from "@/stores/useAuthStore";
import { logoutUser } from "@/apis/userService";
import { clearAllAuthState } from "@/utils/authUtil";

interface UserMenuProps {
  onClose?: () => void;
}

const UserMenu = ({ onClose }: UserMenuProps) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleMyPageClick = () => {
    router.push("/my");
    onClose?.();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAllAuthState();
      router.push("/sign-in");
      onClose?.();
    }
  };

  return (
    <div className="absolute top-12 right-0 card z-50 w-48 border border-neutral-100 bg-white shadow-lg">
      <div className="py-2 px-3 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-900">
          {user?.name || "사용자"}
        </p>
        <p className="text-xs text-gray-600 truncate">{user?.email || ""}</p>
      </div>
      <MenuList className="py-1">
        <MenuItem
          onClick={handleMyPageClick}
          className="text-sm hover:bg-gray-50"
        >
          <ListItemIcon className="min-w-8">
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="마이페이지" />
        </MenuItem>
        <MenuItem onClick={handleLogout} className="text-sm hover:bg-gray-50">
          <ListItemIcon className="min-w-8">
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="로그아웃" />
        </MenuItem>
      </MenuList>
    </div>
  );
};

export default UserMenu;
