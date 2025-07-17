export enum ContractStatusEnum {
  LISTED = "LISTED",
  NEGOTIATING = "NEGOTIATING",
  INTENT_SIGNED = "INTENT_SIGNED",
  CANCELLED = "CANCELLED",
  CONTRACTED = "CONTRACTED",
  IN_PROGRESS = "IN_PROGRESS",
  PAID_COMPLETE = "PAID_COMPLETE",
  REGISTERED = "REGISTERED",
  MOVED_IN = "MOVED_IN",
  TERMINATED = "TERMINATED",
  CLOSED = "CLOSED",
}

export const CONTRACT_STATUS_OPTION_LIST = [
  { value: ContractStatusEnum.LISTED, label: "매물 등록" },
  { value: ContractStatusEnum.NEGOTIATING, label: "협상 중" },
  { value: ContractStatusEnum.INTENT_SIGNED, label: "가계약" },
  { value: ContractStatusEnum.CANCELLED, label: "계약 취소" },
  { value: ContractStatusEnum.CONTRACTED, label: "계약 체결" },
  { value: ContractStatusEnum.IN_PROGRESS, label: "계약 진행 중" },
  { value: ContractStatusEnum.PAID_COMPLETE, label: "잔금 지급 완료" },
  { value: ContractStatusEnum.REGISTERED, label: "등기 완료" },
  { value: ContractStatusEnum.MOVED_IN, label: "입주 완료" },
  { value: ContractStatusEnum.TERMINATED, label: "계약 해지" },
  { value: ContractStatusEnum.CLOSED, label: "계약 종료" },
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
