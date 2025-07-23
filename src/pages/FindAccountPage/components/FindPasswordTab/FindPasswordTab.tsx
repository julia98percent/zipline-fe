import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "@components/Toast/Toast";
import {
  verifyUserForPasswordReset,
  verifyCode,
  resetPassword,
  getRemainingTime,
  VerifyUserForPasswordResetRequest,
} from "@apis/userService";
import UserVerificationStep from "./UserVerificationStep";
import CodeVerificationStep from "./CodeVerificationStep";
import PasswordResetStep from "./PasswordResetStep";
import { PasswordForm, PasswordResetStep as Step } from "./types";
import { API_ERROR_MESSAGES } from "@ts/apiResponse";

interface FindPasswordTabProps {
  isActive: boolean;
}

const FindPasswordTab = ({ isActive }: FindPasswordTabProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("verify");
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    userId: "",
    name: "",
    phoneNo: "",
    email: "",
    contactMethod: "phone",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // 타이머 (초 단위)

  const resetForm = () => {
    setStep("verify");
    setPasswordForm({
      userId: "",
      name: "",
      phoneNo: "",
      email: "",
      contactMethod: "phone",
      code: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeLeft(0);
  };

  // 타이머 useEffect
  useEffect(() => {
    let timer: number;
    if (timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  // 탭이 변경될 때 폼 초기화
  useEffect(() => {
    if (isActive) {
      resetForm();
    }
  }, [isActive]);

  // 서버에서 남은 시간 가져오기
  const fetchRemainingTime = async (userId: string) => {
    try {
      const remainingTime = await getRemainingTime(userId);
      setTimeLeft(remainingTime);
      return remainingTime;
    } catch (error) {
      console.log("Failed to fetch remaining time:", error);
      // 서버에서 시간을 가져오지 못하면 기본값(0) 유지
      return 0;
    }
  };

  useEffect(() => {
    if (step === "code" && passwordForm.userId) {
      const syncTime = async () => {
        const remainingTime = await fetchRemainingTime(passwordForm.userId);
        if (remainingTime === 0) {
          setTimeLeft(180);
        }
      };
      syncTime();
    }
  }, [step, passwordForm.userId]);

  // 사용자 인증 및 인증번호 발송
  const handleSendCode = async () => {
    const hasBasicInfo = passwordForm.userId && passwordForm.name;
    const hasContactInfo =
      passwordForm.contactMethod === "phone"
        ? passwordForm.phoneNo
        : passwordForm.email;

    if (!hasBasicInfo || !hasContactInfo) return;

    setIsLoading(true);
    try {
      const requestData: VerifyUserForPasswordResetRequest = {
        userId: passwordForm.userId,
        name: passwordForm.name,
        verificationType:
          passwordForm.contactMethod === "phone" ? "PHONE" : "EMAIL",
      };

      // 선택된 연락 방법에 따라 데이터 추가
      if (passwordForm.contactMethod === "phone") {
        requestData.phoneNo = passwordForm.phoneNo;
      } else {
        requestData.email = passwordForm.email;
      }

      await verifyUserForPasswordReset(requestData);

      const contactInfo =
        passwordForm.contactMethod === "phone"
          ? passwordForm.phoneNo
          : passwordForm.email;

      showToast({
        message: `${contactInfo}로 인증번호가 발송되었습니다. 3분 이내에 입력해주세요.`,
        type: "success",
      });
      setStep("code");
      // useEffect에서 처리하므로 여기서는 호출하지 않음
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

  // 인증번호 검증
  const handleVerifyCode = async () => {
    const isValidCode = passwordForm.code.length === 6;

    if (!isValidCode) return;

    setIsLoading(true);
    try {
      await verifyCode({
        userId: passwordForm.userId,
        code: passwordForm.code,
      });

      showToast({
        message: "인증이 완료되었습니다. 새 비밀번호를 설정해주세요.",
        type: "success",
      });
      setStep("reset");
      setTimeLeft(0); // 타이머 정지
    } catch (e) {
      const axiosError = e as API_ERROR_MESSAGES;
      const errorMessage =
        axiosError?.response?.data?.message || "인증번호가 일치하지 않습니다.";
      showToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 재발송
  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const requestData: VerifyUserForPasswordResetRequest = {
        userId: passwordForm.userId,
        name: passwordForm.name,
        verificationType:
          passwordForm.contactMethod === "phone" ? "PHONE" : "EMAIL",
      };

      // 선택된 연락 방법에 따라 데이터 추가
      if (passwordForm.contactMethod === "phone") {
        requestData.phoneNo = passwordForm.phoneNo;
      } else {
        requestData.email = passwordForm.email;
      }

      await verifyUserForPasswordReset(requestData);

      showToast({
        message: "인증번호가 재발송되었습니다.",
        type: "success",
      });
      // 서버에서 실제 남은 시간을 가져와서 설정
      const remainingTime = await fetchRemainingTime(passwordForm.userId);
      if (remainingTime === 0) {
        // 서버에서 시간을 가져오지 못한 경우 기본값 설정
        setTimeLeft(180); // 3분 타이머 재시작
      }
      setPasswordForm((prev) => ({ ...prev, code: "" })); // 입력된 코드 초기화
    } catch (e) {
      const axiosError = e as API_ERROR_MESSAGES;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "인증번호 재발송에 실패했습니다.";

      showToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 재설정
  const handleResetPassword = async () => {
    const isValidForm =
      passwordForm.newPassword &&
      passwordForm.confirmPassword &&
      passwordForm.newPassword === passwordForm.confirmPassword &&
      passwordForm.newPassword.length >= 8;

    if (!isValidForm) return;

    setIsLoading(true);
    try {
      await resetPassword({
        userId: passwordForm.userId,
        newPassword: passwordForm.newPassword,
        newPasswordCheck: passwordForm.confirmPassword,
      });

      showToast({
        message: "비밀번호가 성공적으로 변경되었습니다.",
        type: "success",
      });
      navigate("/sign-in");
    } catch (e) {
      const axiosError = e as API_ERROR_MESSAGES;
      const errorMessage =
        axiosError?.response?.data?.message || "비밀번호 변경에 실패했습니다.";

      showToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      passwordForm,
      setPasswordForm,
      isLoading,
      onNext: () => {},
    };

    switch (step) {
      case "verify":
        return (
          <UserVerificationStep {...commonProps} onSendCode={handleSendCode} />
        );
      case "code":
        return (
          <CodeVerificationStep
            {...commonProps}
            timeLeft={timeLeft}
            onVerifyCode={handleVerifyCode}
            onResendCode={handleResendCode}
          />
        );
      case "reset":
        return (
          <PasswordResetStep
            {...commonProps}
            onResetPassword={handleResetPassword}
          />
        );
      default:
        return (
          <UserVerificationStep {...commonProps} onSendCode={handleSendCode} />
        );
    }
  };

  return renderCurrentStep();
};

export default FindPasswordTab;
