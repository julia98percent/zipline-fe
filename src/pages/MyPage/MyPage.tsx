import { useState } from "react";
import { toast } from "react-toastify";
import useAuthStore from "@stores/useAuthStore";
import { updateUserInfo, UpdateUserInfoRequest } from "@apis/userService";
import MyPageView from "./MyPageView";

const MyPage = () => {
  const { user } = useAuthStore();
  const [editOpen, setEditOpen] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [phoneNo, setPhoneNo] = useState(user?.phoneNo || "");

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeMonth, setNoticeMonth] = useState(user?.noticeMonth || 3);
  const [noticeTime, setNoticeTime] = useState(user?.noticeTime || "11:00");

  const toggleEdit = () => setEditOpen(!editOpen);
  const toggleNoticeEdit = () => setNoticeOpen((prev) => !prev);

  const handleUpdateUserInfo = async (data: UpdateUserInfoRequest) => {
    try {
      await updateUserInfo(data);
      toast.success("수정되었습니다.");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      toast.error("수정 실패: " + errorMessage);
    }
  };

  const handleInfoUpdate = () => {
    handleUpdateUserInfo({
      name,
      email,
      phoneNo,
    });
  };

  const handleNoticeUpdate = () => {
    handleUpdateUserInfo({
      noticeMonth,
      noticeTime,
    });
  };

  const handleCopyUrl = () => {
    if (user?.url) {
      navigator.clipboard.writeText(
        `${import.meta.env.VITE_CLIENT_URL}/${user?.url}`
      );
      toast("URL이 복사되었습니다.");
    } else {
      toast.error("복사할 URL이 없습니다.");
    }
  };

  return (
    <MyPageView
      user={user}
      editOpen={editOpen}
      noticeOpen={noticeOpen}
      email={email}
      name={name}
      phoneNo={phoneNo}
      noticeMonth={noticeMonth}
      noticeTime={noticeTime}
      onToggleEdit={toggleEdit}
      onToggleNoticeEdit={toggleNoticeEdit}
      onEmailChange={setEmail}
      onNameChange={setName}
      onPhoneNoChange={setPhoneNo}
      onNoticeMonthChange={setNoticeMonth}
      onNoticeTimeChange={setNoticeTime}
      onInfoUpdate={handleInfoUpdate}
      onNoticeUpdate={handleNoticeUpdate}
      onCopyUrl={handleCopyUrl}
    />
  );
};

export default MyPage;
