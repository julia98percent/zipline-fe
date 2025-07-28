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
    <Box className="flex-grow bg-gray-100 min-h-screen">
      <PageHeader title="마이페이지" />

      <Box className="p-6">
        {/* 회원 정보 수정 */}
        <Box className="mb-6 border border-gray-300 rounded-lg p-4 bg-white">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-2">
              <AccountCircleIcon className="text-gray-600" />
              <Typography variant="subtitle1" className="font-bold">
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
            <Box className="flex flex-col gap-4 mt-2">
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
        <Box className="mb-6 border border-gray-300 rounded-lg p-4 bg-white">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-2">
              <AccessTimeIcon className="text-gray-600" />
              <Typography variant="subtitle1" className="font-bold">
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
            <Box className="flex flex-col gap-4 mt-2">
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
        <Box className="mb-8 border border-gray-300 rounded-lg p-4 flex items-center gap-6 bg-white">
          {/* QR 코드 영역 */}
          {user?.url && (
            <Box className="w-25 h-25 flex items-center justify-center rounded bg-gray-100">
              <QRCode
                value={`${import.meta.env.VITE_CLIENT_URL}/${user?.url}`}
                size={80}
              />
            </Box>
          )}

          <Box className="flex-1">
            <Typography variant="subtitle1" className="font-bold mb-2">
              설문 URL
            </Typography>
            <Box className="flex items-center gap-2">
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
        <Box className="flex justify-between border border-gray-300 rounded-lg p-6 bg-white">
          <Box className="items-center">
            <Typography variant="h6" className="font-bold">
              {user?.surveyTitle || "기본 설문지"}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
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
