import { AgentPropertyFilterParams } from "@ts/property";

// 가격 관련 필드
export const PRICE_FIELDS: (keyof AgentPropertyFilterParams)[] = [
  "minPrice",
  "maxPrice",
  "minDeposit",
  "maxDeposit",
  "minMonthlyRent",
  "maxMonthlyRent",
];

// 소숫점 허용 필드
export const DOUBLE_FIELDS: (keyof AgentPropertyFilterParams)[] = [
  "minNetArea",
  "maxNetArea",
  "minTotalArea",
  "maxTotalArea",
  "minParkingCapacity",
  "maxParkingCapacity",
];

// 숫자 포맷팅 유틸리티
export const formatNumber = (value: string | number) =>
  value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// 숫자 파싱 유틸리티
export const parseNumber = (value: string) =>
  value.replace(/,/g, "").replace(/[^\d]/g, "");

// 초기 가격 입력 상태
export const createInitialPriceInputs = (
  filter: Partial<AgentPropertyFilterParams>
) => ({
  minPrice: filter.minPrice !== undefined ? formatNumber(filter.minPrice) : "",
  maxPrice: filter.maxPrice !== undefined ? formatNumber(filter.maxPrice) : "",
  minDeposit:
    filter.minDeposit !== undefined ? formatNumber(filter.minDeposit) : "",
  maxDeposit:
    filter.maxDeposit !== undefined ? formatNumber(filter.maxDeposit) : "",
  minMonthlyRent:
    filter.minMonthlyRent !== undefined
      ? formatNumber(filter.minMonthlyRent)
      : "",
  maxMonthlyRent:
    filter.maxMonthlyRent !== undefined
      ? formatNumber(filter.maxMonthlyRent)
      : "",
});

// 검증 에러 메시지
export const VALIDATION_ERROR_MESSAGE = "최소값이 최대값보다 클 수 없습니다.";
