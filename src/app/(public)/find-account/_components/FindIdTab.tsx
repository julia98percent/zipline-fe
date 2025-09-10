import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { showToast } from "@/components/Toast";
import { findUserId, FindIdRequest } from "@/apis/userService";
import { formatPhoneNumber } from "@/utils/numberUtil";
import { API_ERROR_MESSAGES } from "@/types/apiResponse";

// 전화번호 유효성 검사 함수
const isValidPhoneNumber = (phoneNo: string) =>
  /^01[0|1|6|7|8|9]-\d{3,4}-\d{4}$/.test(phoneNo);

// 이메일 유효성 검사 함수
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

type ContactMethod = "phone" | "email";

interface FindIdTabProps {
  isActive: boolean;
  onSwitchToPasswordTab: () => void;
}

const FindIdTab = ({ isActive, onSwitchToPasswordTab }: FindIdTabProps) => {
  const router = useRouter();
  const [findIdForm, setFindIdForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    contactMethod: "email" as ContactMethod,
  });
  const [foundId, setFoundId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = () => {
    const hasName = findIdForm.name;

    if (findIdForm.contactMethod === "phone") {
      return (
        hasName && findIdForm.phoneNo && isValidPhoneNumber(findIdForm.phoneNo)
      );
    } else {
      return hasName && findIdForm.email && isValidEmail(findIdForm.email);
    }
  };

  const handleFindId = async () => {
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      const requestData: FindIdRequest = {
        name: findIdForm.name,
        verificationType:
          findIdForm.contactMethod === "phone" ? "PHONE" : "EMAIL",
      };

      if (findIdForm.contactMethod === "phone") {
        requestData.phoneNo = findIdForm.phoneNo;
      } else {
        requestData.email = findIdForm.email;
      }

      const userId = await findUserId(requestData);
      setFoundId(userId);
      showToast({
        message: "아이디를 찾았습니다.",
        type: "success",
      });
    } catch (e) {
      const axiosError = e as API_ERROR_MESSAGES;
      const errorMessage =
        axiosError?.response?.data.message ||
        "일치하는 사용자 정보를 찾을 수 없습니다.";
      showToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactMethodChange = (value: ContactMethod) => {
    setFindIdForm((prev) => ({
      ...prev,
      contactMethod: value,
      phoneNo: "",
      email: "",
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormValid() && !foundId) {
      handleFindId();
    }
  };

  const resetForm = () => {
    setFoundId("");
    setFindIdForm({
      name: "",
      email: "",
      phoneNo: "",
      contactMethod: "email",
    });
  };

  useEffect(() => {
    if (isActive) {
      resetForm();
    }
  }, [isActive]);

  if (!foundId) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <Typography variant="body2" className="text-gray-700 font-medium">
            인증 방법 선택
          </Typography>
          <RadioGroup
            value={findIdForm.contactMethod}
            onChange={(e) =>
              handleContactMethodChange(e.target.value as ContactMethod)
            }
            row
            className="space-x-4"
          >
            <FormControlLabel
              value="email"
              control={<Radio />}
              label="이메일"
              className="mr-4"
            />
            <FormControlLabel
              value="phone"
              control={<Radio />}
              label="전화번호"
              className="mr-4"
            />
          </RadioGroup>
        </div>

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

        {/* 조건부 연락처 입력 필드 */}
        {findIdForm.contactMethod === "email" ? (
          <TextField
            label="이메일"
            type="email"
            value={findIdForm.email}
            onChange={(e) =>
              setFindIdForm((prev) => ({ ...prev, email: e.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder="example@email.com"
            fullWidth
            error={!!(findIdForm.email && !isValidEmail(findIdForm.email))}
            helperText={
              findIdForm.email && !isValidEmail(findIdForm.email)
                ? "올바른 이메일 형식을 입력해주세요"
                : ""
            }
          />
        ) : (
          <TextField
            label="전화번호"
            value={findIdForm.phoneNo}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              setFindIdForm((prev) => ({ ...prev, phoneNo: formatted }));
            }}
            onKeyDown={handleKeyDown}
            placeholder="010-1234-5678"
            fullWidth
            error={
              !!(findIdForm.phoneNo && !isValidPhoneNumber(findIdForm.phoneNo))
            }
            helperText={
              findIdForm.phoneNo && !isValidPhoneNumber(findIdForm.phoneNo)
                ? "올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)"
                : ""
            }
          />
        )}

        <Button
          color="primary"
          fullWidth
          onClick={handleFindId}
          disabled={!isFormValid() || isLoading}
          className="h-[46px]"
        >
          {isLoading ? "아이디 찾는 중..." : "아이디 찾기"}
        </Button>
      </div>
    );
  }

  return (
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
          onClick={() => router.push("/sign-in")}
          className="h-[46px]"
        >
          로그인하기
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={onSwitchToPasswordTab}
          className="h-[46px]"
        >
          비밀번호 찾기
        </Button>
      </div>
    </div>
  );
};

export default FindIdTab;
