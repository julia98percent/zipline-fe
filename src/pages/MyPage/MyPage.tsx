import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Collapse,
  Button as MuiButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "@components/Button";
import useUserStore from "@stores/useUserStore";
import apiClient from "@apis/apiClient";
import { formatDate } from "@utils/dateUtil";
import QRCode from "react-qr-code";
import PageHeader from "@components/PageHeader/PageHeader";
import { formatPhoneNumber } from "@utils/numberUtil";
import { toast } from "react-toastify";

function MyPage() {
  const { user } = useUserStore();
  const [editOpen, setEditOpen] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [phoneNo, setPhoneNo] = useState(user?.phoneNo || "");
  const [url, setUrl] = useState(user?.url || "");

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeMonth, setNoticeMonth] = useState(user?.noticeMonth || 3);
  const [noticeTime, setNoticeTime] = useState(user?.noticeTime || "11:00");

  const toggleEdit = () => setEditOpen(!editOpen);
  const toggleNoticeEdit = () => setNoticeOpen((prev) => !prev);

  const updateUserInfo = ({
    name: newName = name,
    email: newEmail = email,
    phoneNo: newPhoneNo = phoneNo,
    noticeMonth: newNoticeMonth = noticeMonth,
    noticeTime: newNoticeTime = noticeTime,
    url: newUrl = url,
  }) => {
    apiClient
      .patch("/users/info", {
        name: newName,
        email: newEmail,
        phoneNo: newPhoneNo,
        noticeMonth: newNoticeMonth,
        noticeTime: newNoticeTime,
        url: newUrl,
      })
      .then(() => {
        toast.success("수정되었습니다.");
      })
      .catch((err) => {
        toast.error("수정 실패: " + err.response?.data?.message);
      });
  };

  const handleInfoUpdate = () => {
    updateUserInfo({});
  };

  const handleNoticeUpdate = () => {
    updateUserInfo({});
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <PageHeader title="마이페이지" userName={user?.name || "-"} />

      <Box sx={{ p: 3 }}>
        {/* 회원 정보 수정 */}
        <Box
          sx={{
            mb: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccountCircleIcon sx={{ color: "#666" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                회원 정보 수정
              </Typography>
            </Box>
            <Button
              text={editOpen ? "닫기" : "수정"}
              size="small"
              sx={{
                backgroundColor: "#2E5D9F",
                color: "white",
                height: 32,
                fontSize: 14,
              }}
              onClick={toggleEdit}
            />
          </Box>
          <Collapse in={editOpen}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="전화번호"
                value={phoneNo}
                onChange={(e) => setPhoneNo(formatPhoneNumber(e.target.value))}
                fullWidth
                size="small"
              />
              <Button
                text="수정하기"
                onClick={handleInfoUpdate}
                sx={{ alignSelf: "flex-end" }}
              />
            </Box>
          </Collapse>
        </Box>

        {/* 문자 발송 설정 */}
        {/* <Box
          sx={{
            mb: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon sx={{ color: "#666" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                문자 발송 설정
              </Typography>
            </Box>
            <Button
              text={noticeOpen ? "닫기" : "수정"}
              size="small"
              sx={{
                backgroundColor: "#2E5D9F",
                color: "white",
                height: 32,
                fontSize: 14,
              }}
              onClick={toggleNoticeEdit}
            />
          </Box>
          <Collapse in={noticeOpen}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="계약 만료 문자 기준 달"
                type="number"
                value={noticeMonth}
                onChange={(e) => setNoticeMonth(Number(e.target.value))}
                fullWidth
                size="small"
              />
              <TextField
                label="문자 발송 시간"
                type="time"
                value={noticeTime}
                onChange={(e) => setNoticeTime(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 60 }}
              />
              <Button
                text="설정 저장"
                onClick={handleNoticeUpdate}
                sx={{ alignSelf: "flex-end" }}
              />
            </Box>
          </Collapse>
        </Box> */}

        {/* QR 코드 및 URL 섹션 */}
        <Box
          sx={{
            mb: 4,
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 3,
            backgroundColor: "white",
          }}
        >
          {/* QR 코드 영역 */}
          {user?.url && (
            <Box
              sx={{
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                backgroundColor: "#f5f5f5",
              }}
            >
              <QRCode value={`https://zip-line.kr/${user?.url}`} size={80} />
            </Box>
          )}

          {/* URL + 복사 버튼 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              설문 URL
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                value={user?.url ? `https://zip-line.kr/${user?.url}` : ""}
                size="small"
                InputProps={{ readOnly: true }}
              />
              <MuiButton
                variant="outlined"
                onClick={() => {
                  if (user?.url) {
                    navigator.clipboard.writeText(
                      `https://zip-line.kr/${user?.url}`
                    );
                    toast("URL이 복사되었습니다.");
                  } else {
                    toast.error("복사할 URL이 없습니다.");
                  }
                }}
                sx={{ minWidth: "40px", height: "40px" }}
              >
                📋
              </MuiButton>
            </Box>
          </Box>
        </Box>

        {/* 설문 정보 섹션 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 3,
            backgroundColor: "white",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {user?.surveyTitle || "기본 설문지"}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              생성일:{" "}
              {user?.surveyCreatedAt ? formatDate(user.surveyCreatedAt) : "-"}
            </Typography>
          </Box>
          <Link to="edit-survey">
            <Button
              text="수정"
              sx={{ backgroundColor: "#2E5D9F", color: "white" }}
            />
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default MyPage;
