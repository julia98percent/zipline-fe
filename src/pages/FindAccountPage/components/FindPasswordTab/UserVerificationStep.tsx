import React from "react";
import { Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import Button from "@components/Button";
import TextField from "@components/TextField";
import { formatPhoneNumber } from "@utils/numberUtil";
import { StepProps, ContactMethod } from "./types";

// 전화번호 유효성 검사 함수
const isValidPhoneNumber = (phoneNo: string) =>
  /^01[0|1|6|7|8|9]-\d{3,4}-\d{4}$/.test(phoneNo);

// 이메일 유효성 검사 함수
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

interface UserVerificationStepProps extends StepProps {
  onSendCode: () => void;
}

const UserVerificationStep: React.FC<UserVerificationStepProps> = ({
  passwordForm,
  setPasswordForm,
  isLoading,
  onSendCode,
}) => {
  const isValidForm = () => {
    const hasBasicInfo = passwordForm.userId && passwordForm.name;

    if (passwordForm.contactMethod === "phone") {
      return (
        hasBasicInfo &&
        passwordForm.phoneNo &&
        isValidPhoneNumber(passwordForm.phoneNo)
      );
    } else {
      return (
        hasBasicInfo && passwordForm.email && isValidEmail(passwordForm.email)
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValidForm()) {
      onSendCode();
    }
  };

  const handleContactMethodChange = (value: ContactMethod) => {
    setPasswordForm((prev) => ({
      ...prev,
      contactMethod: value,
      // 선택이 바뀔 때 기존 연락처 정보 초기화
      phoneNo: "",
      email: "",
    }));
  };

  return (
    <div className="space-y-6">
      {/* 연락 방법 선택 */}
      <div className="space-y-3">
        <Typography variant="body2" className="text-gray-700 font-medium">
          인증 방법 선택
        </Typography>
        <RadioGroup
          value={passwordForm.contactMethod}
          onChange={(e) =>
            handleContactMethodChange(e.target.value as ContactMethod)
          }
          row
          className="space-x-4"
        >
          <FormControlLabel
            value="phone"
            control={<Radio />}
            label="전화번호"
            className="mr-4"
          />
          <FormControlLabel
            value="email"
            control={<Radio />}
            label="이메일"
            className="mr-4"
          />
        </RadioGroup>
      </div>

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

      {/* 조건부 연락처 입력 필드 */}
      {passwordForm.contactMethod === "phone" ? (
        <TextField
          label="전화번호"
          value={passwordForm.phoneNo}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            setPasswordForm((prev) => ({ ...prev, phoneNo: formatted }));
          }}
          onKeyDown={handleKeyDown}
          placeholder="010-1234-5678"
          fullWidth
          error={
            !!(
              passwordForm.phoneNo && !isValidPhoneNumber(passwordForm.phoneNo)
            )
          }
          helperText={
            passwordForm.phoneNo && !isValidPhoneNumber(passwordForm.phoneNo)
              ? "올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)"
              : ""
          }
        />
      ) : (
        <TextField
          label="이메일"
          type="email"
          value={passwordForm.email}
          onChange={(e) =>
            setPasswordForm((prev) => ({ ...prev, email: e.target.value }))
          }
          onKeyDown={handleKeyDown}
          placeholder="example@email.com"
          fullWidth
          error={!!(passwordForm.email && !isValidEmail(passwordForm.email))}
          helperText={
            passwordForm.email && !isValidEmail(passwordForm.email)
              ? "올바른 이메일 형식을 입력해주세요"
              : ""
          }
        />
      )}

      <Button
        color="primary"
        fullWidth
        onClick={onSendCode}
        disabled={!isValidForm() || isLoading}
        className="h-[46px]"
      >
        {isLoading ? "인증번호 발송 중..." : "인증번호 발송"}
      </Button>
    </div>
  );
};

export default UserVerificationStep;
