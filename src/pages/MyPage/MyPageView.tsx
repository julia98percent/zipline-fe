import { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Collapse, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CommentIcon from "@mui/icons-material/Comment";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Button from "@components/Button";
import { formatDate } from "@utils/dateUtil";
import { formatPhoneNumber } from "@utils/numberUtil";
import QRCode from "react-qr-code";
import PageHeader from "@components/PageHeader/PageHeader";
import { User } from "@ts/user";
import TextField from "@components/TextField";

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
    <div>
      <PageHeader />

      <div className="flex flex-col p-5 pt-0 gap-4">
        <div className="p-5 mx-2 card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AccountCircleIcon />
              <h6 className="font-semibold">회원 정보 수정</h6>
            </div>
            <Button onClick={onToggleEdit} variant="text">
              {editOpen ? "닫기" : "수정하기"}
            </Button>
          </div>
          <Collapse in={editOpen}>
            <div className="flex flex-col gap-4 mt-2">
              <TextField
                label="이름"
                value={name}
                onChange={handleNameChange}
                size="small"
              />
              <TextField
                label="이메일"
                value={email}
                onChange={handleEmailChange}
                size="small"
              />
              <TextField
                label="전화번호"
                value={phoneNo}
                onChange={handlePhoneNoChange}
                size="small"
              />
              <Button
                onClick={onInfoUpdate}
                variant="contained"
                className="max-w-fit self-end"
              >
                설정 저장하기
              </Button>
            </div>
          </Collapse>
        </div>

        <div className="flex p-5 mx-2 card gap-2 items-center">
          {user?.url && (
            <div className="w-25 h-25 flex items-center justify-center rounded bg-gray-100">
              <QRCode
                value={`${import.meta.env.VITE_CLIENT_URL}/${user?.url}`}
                size={80}
              />
            </div>
          )}

          <div className="flex-1">
            <h6 className="font-semibold mb-2">설문 URL</h6>
            <div className="flex items-center gap-2">
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
              <IconButton
                onClick={onCopyUrl}
                className="min-w-10 h-10 border border-[rgba(0,_0,_0,_0.23)] hover:border-gray-600 hover:bg-white rounded"
              >
                📋
              </IconButton>
            </div>
          </div>
        </div>

        <div className="flex justify-between p-5 mx-2 card">
          <div className="flex items-center gap-2">
            <ChecklistIcon />
            <div className="items-center">
              <h6 className="font-semibold">
                {user?.surveyTitle || "기본 설문지"}
              </h6>
              <h6 className="text-neutral-500 text-sm">
                생성일:{" "}
                {user?.surveyCreatedAt ? formatDate(user.surveyCreatedAt) : "-"}
              </h6>
            </div>
          </div>
          <Link to="edit-survey">
            <Button variant="text">수정하기</Button>
          </Link>
        </div>

        <div className="p-5 mx-2 card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AccessTimeIcon />
              <h6 className="font-semibold">문자 발송 설정</h6>
            </div>
            <Button onClick={onToggleNoticeEdit} variant="text">
              {noticeOpen ? "닫기" : "수정하기"}
            </Button>
          </div>
          <Collapse in={noticeOpen}>
            <div className="flex flex-col gap-4 mt-2">
              <TextField
                label="계약 만료 문자 기준 달"
                type="number"
                value={`${noticeMonth}`}
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
              <Button onClick={onNoticeUpdate} className="max-w-fit self-end">
                설정 저장하기
              </Button>
            </div>
          </Collapse>
        </div>

        <div className="p-5 mx-2 card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CommentIcon />
              <h6 className="font-semibold">문자 템플릿 설정</h6>
            </div>
            <Link to="/messages/templates">
              <Button variant="text">이동하기</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageView;
