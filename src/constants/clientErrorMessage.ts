export const USER_ERROR_MESSAGES = {
  INFO_FETCH_FAILED: "사용자 정보를 불러올 수 없습니다.",
} as const;

export const REGION_ERROR_MESSAGES = {
  FETCH_FAILED: "지역 정보를 불러올 수 없습니다.",
} as const;

export const MESSAGE_ERROR_MESSAGES = {
  FETCH_FAILED: "메시지를 불러올 수 없습니다.",
  LIST_FETCH_FAILED: "메시지 목록을 불러올 수 없습니다.",
  TEMPLATE_FETCH_FAILED: "템플릿을 불러올 수 없습니다.",
  BULK_SEND_FAILED: "메시지 전송에 실패했습니다.",
} as const;

export const NOTIFICATION_ERROR_MESSAGES = {
  FETCH_FAILED: "알림을 불러올 수 없습니다.",
  READ_FAILED: "알림 읽기에 실패했습니다.",
  READ_ALL_FAILED: "모든 알림 읽기에 실패했습니다.",
  DELETE_FAILED: "알림 삭제에 실패했습니다.",
} as const;

export const COUNSEL_ERROR_MESSAGES = {
  PRE_COUNSEL_DETAIL_FETCH_FAILED: "사전 상담 상세 정보를 불러올 수 없습니다.",
  UPDATE_FAILED: "상담 내용 수정 중 오류가 발생했습니다.",
  FETCH_FAILED: "상담 목록을 불러올 수 없습니다.",
  DELETE_FAILED: "상담 삭제에 실패했습니다.",
} as const;

export const CUSTOMER_ERROR_MESSAGES = {
  ADD_FAILED: "고객 등록 중 오류가 발생했습니다.",
  LABEL_FETCH_FAILED: "라벨을 불러올 수 없습니다.",
  SEARCH_FAILED: "고객 검색에 실패했습니다.",
} as const;

export const CONTRACT_ERROR_MESSAGES = {
  DETAIL_FETCH_FAILED: "계약 정보를 불러올 수 없습니다.",
  HISTORY_FETCH_FAILED: "계약 히스토리를 불러올 수 없습니다.",
  LIST_FETCH_FAILED: "계약 목록을 불러올 수 없습니다.",
  DELETE_FAILED: "계약 삭제에 실패했습니다.",
} as const;
