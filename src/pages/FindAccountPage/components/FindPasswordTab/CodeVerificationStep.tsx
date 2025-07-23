import React from "react";
import { Typography } from "@mui/material";
import Button from "@components/Button";
import TextField from "@components/TextField";
import { StepProps } from "./types";

interface CodeVerificationStepProps extends StepProps {
  timeLeft: number;
  onVerifyCode: () => void;
  onResendCode: () => void;
}

const CodeVerificationStep: React.FC<CodeVerificationStepProps> = ({
  passwordForm,
  setPasswordForm,
  isLoading,
  timeLeft,
  onVerifyCode,
  onResendCode,
}) => {
  const isValidCode = passwordForm.code.length === 6;
  const isTimeExpired = timeLeft === 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValidCode && !isTimeExpired) {
      onVerifyCode();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <Typography variant="body2" className="text-blue-800">
          📱 입력하신{" "}
          {passwordForm.contactMethod === "phone" ? "전화번호" : "이메일"}로
          인증번호 6자리를 발송했습니다.
        </Typography>
        <Typography variant="body2" className="text-blue-800 mt-1">
          {passwordForm.contactMethod === "phone" ? "전화번호" : "이메일"}:{" "}
          {passwordForm.contactMethod === "phone"
            ? passwordForm.phoneNo
            : passwordForm.email}
        </Typography>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="body2" className="text-gray-600">
            인증번호 입력
          </Typography>
          <div className="flex items-center space-x-2">
            {!isTimeExpired ? (
              <Typography
                variant="body2"
                className={`font-medium ${
                  timeLeft <= 30 ? "text-red-500" : "text-blue-600"
                }`}
              >
                {formatTime(timeLeft)}
              </Typography>
            ) : (
              <Typography variant="body2" className="text-red-500 font-medium">
                시간 만료
              </Typography>
            )}
          </div>
        </div>

        <TextField
          value={passwordForm.code}
          onChange={(e) => {
            // 숫자만 입력 가능하도록 제한
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPasswordForm((prev) => ({ ...prev, code: value }));
          }}
          onKeyDown={handleKeyDown}
          placeholder="인증번호 6자리를 입력하세요"
          fullWidth
          disabled={isTimeExpired}
          inputProps={{
            maxLength: 6,
            style: {
              textAlign: "center",
              fontSize: "18px",
              letterSpacing: "4px",
            },
          }}
          error={isTimeExpired}
          helperText={
            isTimeExpired
              ? "인증 시간이 만료되었습니다. 인증번호를 재발송해주세요."
              : ""
          }
        />
      </div>

      <div className="space-y-3">
        <Button
          color="primary"
          fullWidth
          onClick={onVerifyCode}
          disabled={!isValidCode || isLoading || isTimeExpired}
          className="h-[46px] rounded-lg text-base"
        >
          {isLoading ? "인증 확인 중..." : "인증 확인"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={onResendCode}
          disabled={isLoading}
          className="h-[46px] rounded-lg text-base"
        >
          {isLoading ? "재발송 중..." : "인증번호 재발송"}
        </Button>
      </div>
    </div>
  );
};

export default CodeVerificationStep;
