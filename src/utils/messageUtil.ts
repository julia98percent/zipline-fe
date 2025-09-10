import { MSG_ERROR_MESSAGES, MESSAGE_STATUS } from "@/constants/Message";

export const getStatusMessage = (statusCode: string): string => {
  if (statusCode.startsWith("4")) {
    return MESSAGE_STATUS.SENT;
  } else if (statusCode.startsWith("2")) {
    return MESSAGE_STATUS.RECEIVED;
  } else if (statusCode.startsWith("3")) {
    return MESSAGE_STATUS.CARRIER_RECEIVED;
  } else {
    return MESSAGE_STATUS.FAILED;
  }
};

export const getErrorMessage = (statusCode: string): string => {
  return MSG_ERROR_MESSAGES[statusCode] || "알 수 없는 오류입니다.";
};

export const translateMessageStatusToKorean = (status: string) => {
  switch (status) {
    case "COMPLETE":
      return "접수 완료";
    case "FAILED":
      return "접수 실패";
    default:
      return "접수 대기";
  }
};
