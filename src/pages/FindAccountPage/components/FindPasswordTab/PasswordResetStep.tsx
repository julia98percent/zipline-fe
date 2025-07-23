import React from "react";
import { Typography } from "@mui/material";
import Button from "@components/Button";
import TextField from "@components/TextField";
import { StepProps } from "./types";

interface PasswordResetStepProps extends StepProps {
  onResetPassword: () => void;
}

const PasswordResetStep: React.FC<PasswordResetStepProps> = ({
  passwordForm,
  setPasswordForm,
  isLoading,
  onResetPassword,
}) => {
  const isValidForm =
    passwordForm.newPassword &&
    passwordForm.confirmPassword &&
    passwordForm.newPassword === passwordForm.confirmPassword &&
    passwordForm.newPassword.length >= 8;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValidForm) {
      onResetPassword();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <Typography variant="body2" className="text-green-800">
          ✓ 인증이 완료되었습니다. 새 비밀번호를 설정해주세요.
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

      <div className="space-y-3">
        <Button
          color="primary"
          fullWidth
          onClick={onResetPassword}
          disabled={!isValidForm || isLoading}
          className="h-[46px] rounded-lg text-base"
        >
          {isLoading ? "비밀번호 변경 중..." : "비밀번호 변경"}
        </Button>
      </div>
    </div>
  );
};

export default PasswordResetStep;
