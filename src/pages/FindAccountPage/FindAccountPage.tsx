import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import Button from "@components/Button";
import TextField from "@components/TextField";
import { showToast } from "@components/Toast/Toast";
import {
  findUserId,
  verifyUserForPasswordReset,
  resetPassword,
} from "@apis/userService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const FindAccountPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "password" ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  // 아이디 찾기 상태
  const [findIdForm, setFindIdForm] = useState({
    name: "",
    email: "",
  });
  const [foundId, setFoundId] = useState("");
  const [isLoadingFindId, setIsLoadingFindId] = useState(false);

  // 비밀번호 찾기 상태
  const [passwordStep, setPasswordStep] = useState<"verify" | "reset">(
    "verify"
  );
  const [passwordForm, setPasswordForm] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const isValidFindIdForm = findIdForm.name && findIdForm.email;
  const isValidVerifyForm =
    passwordForm.userId &&
    passwordForm.name &&
    passwordForm.email &&
    passwordForm.phone;
  const isValidResetForm =
    passwordForm.newPassword &&
    passwordForm.confirmPassword &&
    passwordForm.newPassword === passwordForm.confirmPassword &&
    passwordForm.newPassword.length >= 8;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchParams({ tab: newValue === 1 ? "password" : "id" });

    // 탭 변경 시 상태 초기화
    if (newValue === 0) {
      setFoundId("");
      setFindIdForm({ name: "", email: "" });
    } else {
      setPasswordStep("verify");
      setPasswordForm({
        userId: "",
        name: "",
        email: "",
        phone: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  // 아이디 찾기 함수
  const handleFindId = async () => {
    if (!isValidFindIdForm) return;

    setIsLoadingFindId(true);
    try {
      const userId = await findUserId({
        name: findIdForm.name,
        email: findIdForm.email,
      });
      setFoundId(userId);
      showToast({
        message: "아이디를 찾았습니다.",
        type: "success",
      });
    } catch {
      showToast({
        message: "일치하는 사용자 정보를 찾을 수 없습니다.",
        type: "error",
      });
    } finally {
      setIsLoadingFindId(false);
    }
  };

  // 비밀번호 찾기 - 사용자 인증
  const handleVerifyUser = async () => {
    if (!isValidVerifyForm) return;

    setIsLoadingPassword(true);
    try {
      await verifyUserForPasswordReset({
        userId: passwordForm.userId,
        name: passwordForm.name,
        email: passwordForm.email,
        phoneNo: passwordForm.phone,
      });

      showToast({
        message: "사용자 인증이 완료되었습니다. 새 비밀번호를 설정해주세요.",
        type: "success",
      });
      setPasswordStep("reset");
    } catch {
      showToast({
        message: "일치하는 사용자 정보를 찾을 수 없습니다.",
        type: "error",
      });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  // 비밀번호 재설정
  const handleResetPassword = async () => {
    if (!isValidResetForm) return;

    setIsLoadingPassword(true);
    try {
      await resetPassword({
        userId: passwordForm.userId,
        newPassword: passwordForm.newPassword,
      });

      showToast({
        message: "비밀번호가 성공적으로 변경되었습니다.",
        type: "success",
      });
      navigate("/sign-in");
    } catch {
      showToast({
        message: "비밀번호 변경에 실패했습니다.",
        type: "error",
      });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (activeTab === 0 && isValidFindIdForm && !foundId) {
        handleFindId();
      } else if (activeTab === 1) {
        if (passwordStep === "verify" && isValidVerifyForm) {
          handleVerifyUser();
        } else if (passwordStep === "reset" && isValidResetForm) {
          handleResetPassword();
        }
      }
    }
  };

  const renderFindIdTab = () => (
    <TabPanel value={activeTab} index={0}>
      {!foundId ? (
        <div className="space-y-6">
          <TextField
            label="이름"
            value={findIdForm.name}
            onChange={(e) =>
              setFindIdForm((prev) => ({ ...prev, name: e.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder="이름을 입력하세요"
            fullWidth
          />

          <TextField
            label="이메일"
            type="email"
            value={findIdForm.email}
            onChange={(e) =>
              setFindIdForm((prev) => ({ ...prev, email: e.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder="이메일을 입력하세요"
            fullWidth
          />

          <Button
            color="primary"
            fullWidth
            onClick={handleFindId}
            disabled={!isValidFindIdForm || isLoadingFindId}
            className="h-[46px] rounded-lg text-base"
          >
            {isLoadingFindId ? "아이디 찾는 중..." : "아이디 찾기"}
          </Button>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <Typography variant="h6" className="text-gray-800 mb-2">
              아이디 찾기 결과
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-4">
              고객님의 아이디는 다음과 같습니다.
            </Typography>
            <div className="bg-white border rounded-lg p-4">
              <Typography variant="h5" className="text-primary font-bold">
                {foundId}
              </Typography>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              color="primary"
              fullWidth
              onClick={() => navigate("/sign-in")}
              className="h-[46px] rounded-lg text-base"
            >
              로그인하기
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setActiveTab(1);
                setSearchParams({ tab: "password" });
              }}
              className="h-[46px] rounded-lg text-base"
            >
              비밀번호 찾기
            </Button>
          </div>
        </div>
      )}
    </TabPanel>
  );

  const renderPasswordVerifyStep = () => (
    <div className="space-y-6">
      <TextField
        label="아이디"
        value={passwordForm.userId}
        onChange={(e) =>
          setPasswordForm((prev) => ({ ...prev, userId: e.target.value }))
        }
        onKeyDown={handleKeyDown}
        placeholder="아이디를 입력하세요"
        fullWidth
      />

      <TextField
        label="이름"
        value={passwordForm.name}
        onChange={(e) =>
          setPasswordForm((prev) => ({ ...prev, name: e.target.value }))
        }
        onKeyDown={handleKeyDown}
        placeholder="이름을 입력하세요"
        fullWidth
      />

      <TextField
        label="이메일"
        type="email"
        value={passwordForm.email}
        onChange={(e) =>
          setPasswordForm((prev) => ({ ...prev, email: e.target.value }))
        }
        onKeyDown={handleKeyDown}
        placeholder="이메일을 입력하세요"
        fullWidth
      />

      <TextField
        label="휴대폰 번호"
        value={passwordForm.phone}
        onChange={(e) =>
          setPasswordForm((prev) => ({ ...prev, phone: e.target.value }))
        }
        onKeyDown={handleKeyDown}
        placeholder="휴대폰 번호를 입력하세요 (예: 010-1234-5678)"
        fullWidth
      />

      <Button
        color="primary"
        fullWidth
        onClick={handleVerifyUser}
        disabled={!isValidVerifyForm || isLoadingPassword}
        className="h-[46px] rounded-lg text-base"
      >
        {isLoadingPassword ? "사용자 인증 중..." : "사용자 인증"}
      </Button>
    </div>
  );

  const renderPasswordResetStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <Typography variant="body2" className="text-green-800">
          ✓ 사용자 인증이 완료되었습니다. 새 비밀번호를 설정해주세요.
        </Typography>
      </div>

      <TextField
        label="새 비밀번호"
        type="password"
        value={passwordForm.newPassword}
        onChange={(e) =>
          setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
        }
        onKeyDown={handleKeyDown}
        placeholder="새 비밀번호를 입력하세요 (8자 이상)"
        fullWidth
        helperText="8자 이상 입력해주세요"
      />

      <TextField
        label="새 비밀번호 확인"
        type="password"
        value={passwordForm.confirmPassword}
        onChange={(e) =>
          setPasswordForm((prev) => ({
            ...prev,
            confirmPassword: e.target.value,
          }))
        }
        onKeyDown={handleKeyDown}
        placeholder="새 비밀번호를 다시 입력하세요"
        fullWidth
        error={
          !!(
            passwordForm.confirmPassword &&
            passwordForm.newPassword !== passwordForm.confirmPassword
          )
        }
        helperText={
          passwordForm.confirmPassword &&
          passwordForm.newPassword !== passwordForm.confirmPassword
            ? "비밀번호가 일치하지 않습니다"
            : ""
        }
      />

      <Button
        color="primary"
        fullWidth
        onClick={handleResetPassword}
        disabled={!isValidResetForm || isLoadingPassword}
        className="h-[46px] rounded-lg text-base"
      >
        {isLoadingPassword ? "비밀번호 변경 중..." : "비밀번호 변경"}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => setPasswordStep("verify")}
        disabled={isLoadingPassword}
        className="h-[46px] rounded-lg text-base"
      >
        이전 단계로
      </Button>
    </div>
  );

  const renderPasswordTab = () => (
    <TabPanel value={activeTab} index={1}>
      {passwordStep === "verify"
        ? renderPasswordVerifyStep()
        : renderPasswordResetStep()}
    </TabPanel>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Typography
            variant="h4"
            component="h1"
            className="text-gray-900 font-bold mb-2"
          >
            계정 찾기
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            아이디나 비밀번호를 찾을 수 있습니다.
          </Typography>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="계정 찾기 탭"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#6B7280",
                  "&.Mui-selected": {
                    color: "#164F9E",
                    fontWeight: 600,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#164F9E",
                },
              }}
            >
              <Tab label="아이디 찾기" />
              <Tab label="비밀번호 찾기" />
            </Tabs>
          </Box>

          {renderFindIdTab()}
          {renderPasswordTab()}

          <div className="flex justify-center items-center mt-8 space-x-4 text-sm">
            <Link to="/sign-in" className="text-gray-600 hover:text-primary">
              로그인
            </Link>
            <div className="w-px h-4 bg-gray-300"></div>
            <Link to="/sign-up" className="text-gray-600 hover:text-primary">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindAccountPage;
