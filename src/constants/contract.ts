export const CONTRACT_STATUS_OPTION_LIST = [
  { value: "LISTED", label: "매물 등록" },
  { value: "NEGOTIATING", label: "협상 중" },
  { value: "INTENT_SIGNED", label: "가계약" },
  { value: "CANCELLED", label: "계약 취소" },
  { value: "CONTRACTED", label: "계약 체결" },
  { value: "IN_PROGRESS", label: "계약 진행 중" },
  { value: "PAID_COMPLETE", label: "잔금 지급 완료" },
  { value: "REGISTERED", label: "등기 완료" },
  { value: "MOVED_IN", label: "입주 완료" },
  { value: "TERMINATED", label: "계약 해지" },
  { value: "CLOSED", label: "계약 종료" },
] as const;

const CONTRACT_STATUS_COLOR_MAP: Record<string, string> = {
  LISTED: "default",
  NEGOTIATING: "info",
  INTENT_SIGNED: "warning",
  CANCELLED: "error",
  CONTRACTED: "success",
  IN_PROGRESS: "primary",
  PAID_COMPLETE: "secondary",
  REGISTERED: "success",
  MOVED_IN: "success",
  TERMINATED: "error",
  CLOSED: "default",
};

export const CONTRACT_STATUS_TYPES = CONTRACT_STATUS_OPTION_LIST.map(
  (status) => ({
    value: status.value,
    name: status.label,
    label: status.label,
    color: CONTRACT_STATUS_COLOR_MAP[status.value] || "default",
  })
);
