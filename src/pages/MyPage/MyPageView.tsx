import { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Box, TextField, Typography, Collapse } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "@components/Button";
import { formatDate } from "@utils/dateUtil";
import { formatPhoneNumber } from "@utils/numberUtil";
import QRCode from "react-qr-code";
import PageHeader from "@components/PageHeader/PageHeader";
import { User } from "@ts/user";

interface MyPageViewProps {
  user: User | null;
  editOpen: boolean;
  noticeOpen: boolean;
  email: string;
  name: string;
  phoneNo: string;
  noticeMonth: number;
  noticeTime: string;
  onToggleEdit: () => void;
  onToggleNoticeEdit: () => void;
  onEmailChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onPhoneNoChange: (value: string) => void;
  onNoticeMonthChange: (value: number) => void;
  onNoticeTimeChange: (value: string) => void;
  onInfoUpdate: () => void;
  onNoticeUpdate: () => void;
  onCopyUrl: () => void;
}

const MyPageView = ({
  user,
  editOpen,
  noticeOpen,
  email,
  name,
  phoneNo,
  noticeMonth,
  noticeTime,
  onToggleEdit,
  onToggleNoticeEdit,
  onEmailChange,
  onNameChange,
  onPhoneNoChange,
  onNoticeMonthChange,
  onNoticeTimeChange,
  onInfoUpdate,
  onNoticeUpdate,
  onCopyUrl,
}: MyPageViewProps) => {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    onEmailChange(e.target.value);
  };

  const handlePhoneNoChange = (e: ChangeEvent<HTMLInputElement>) => {
    onPhoneNoChange(formatPhoneNumber(e.target.value));
  };

  const handleNoticeMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    onNoticeMonthChange(Number(e.target.value));
  };

  const handleNoticeTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    onNoticeTimeChange(e.target.value);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <PageHeader title="마이페이지" />

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
              onClick={onToggleEdit}
              variant="outlined"
              className="text-sm px-3 py-1"
            >
              {editOpen ? "닫기" : "수정하기"}
            </Button>
          </Box>
          <Collapse in={editOpen}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="이름"
                value={name}
                onChange={handleNameChange}
                fullWidth
                size="small"
              />
              <TextField
                label="이메일"
                value={email}
                onChange={handleEmailChange}
                fullWidth
                size="small"
              />
              <TextField
                label="전화번호"
                value={phoneNo}
                onChange={handlePhoneNoChange}
                fullWidth
                size="small"
              />
              <Button
                onClick={onInfoUpdate}
                className="px-4 py-2 h-[46px] max-w-fit self-end"
              >
                설정 저장하기
              </Button>
            </Box>
          </Collapse>
        </Box>

        {/* 문자 발송 설정 */}
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
              <AccessTimeIcon sx={{ color: "#666" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                문자 발송 설정
              </Typography>
            </Box>
            <Button
              onClick={onToggleNoticeEdit}
              variant="outlined"
              className="text-sm px-3 py-1"
            >
              {noticeOpen ? "닫기" : "수정하기"}
            </Button>
          </Box>
          <Collapse in={noticeOpen}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="계약 만료 문자 기준 달"
                type="number"
                value={noticeMonth}
                onChange={handleNoticeMonthChange}
                fullWidth
                size="small"
              />
              <TextField
                label="문자 발송 시간"
                type="time"
                value={noticeTime}
                onChange={handleNoticeTimeChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 60 }}
              />
              <Button
                onClick={onNoticeUpdate}
                className="px-4 py-2 h-[46px] max-w-fit self-end"
              >
                설정 저장하기
              </Button>
            </Box>
          </Collapse>
        </Box>

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
              <QRCode
                value={`${import.meta.env.VITE_CLIENT_URL}/${user?.url}`}
                size={80}
              />
            </Box>
          )}

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              설문 URL
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                value={
                  user?.url
                    ? `${import.meta.env.VITE_CLIENT_URL}/${user?.url}`
                    : ""
                }
                size="small"
                InputProps={{ readOnly: true }}
              />
              <Button
                onClick={onCopyUrl}
                className="min-w-10 h-10 border border-gray-300 bg-white hover:bg-gray-50 rounded transition-colors"
              >
                📋
              </Button>
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
          <Box sx={{ alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {user?.surveyTitle || "기본 설문지"}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              생성일:{" "}
              {user?.surveyCreatedAt ? formatDate(user.surveyCreatedAt) : "-"}
            </Typography>
          </Box>
          <Link to="edit-survey">
            <Button variant="outlined" className="px-4 py-2">
              수정하기
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default MyPageView;
