import { CONTRACT_TYPES, PROPERTY_CATEGORIES, NEUTRAL } from "./colors";

// 거래 유형별
export const PROPERTY_TYPE_COLORS = {
  SALE: CONTRACT_TYPES.SALE,
  DEPOSIT: CONTRACT_TYPES.DEPOSIT,
  MONTHLY: CONTRACT_TYPES.MONTHLY,
} as const;

// 매물 카테고리별
export const PROPERTY_CATEGORY_COLORS = {
  APARTMENT: PROPERTY_CATEGORIES.APARTMENT,
  OFFICETEL: PROPERTY_CATEGORIES.OFFICETEL,
  VILLA: PROPERTY_CATEGORIES.VILLA,
  ONE_ROOM: PROPERTY_CATEGORIES.ONE_ROOM,
  TWO_ROOM: PROPERTY_CATEGORIES.TWO_ROOM,
  HOUSE: PROPERTY_CATEGORIES.HOUSE,
  COMMERCIAL: PROPERTY_CATEGORIES.COMMERCIAL,
} as const;

// 기본 색상 (fallback)
export const DEFAULT_PROPERTY_COLORS = {
  background: NEUTRAL[100],
  text: NEUTRAL[700],
} as const;

export const getPropertyTypeColors = (type: string) => {
  return (
    PROPERTY_TYPE_COLORS[type as keyof typeof PROPERTY_TYPE_COLORS] ||
    PROPERTY_CATEGORIES.ONE_ROOM
  );
};

export const getPropertyCategoryColors = (category: string) => {
  return (
    PROPERTY_CATEGORY_COLORS[
      category as keyof typeof PROPERTY_CATEGORY_COLORS
    ] || DEFAULT_PROPERTY_COLORS
  );
};

export const MAX_PROPERTY_PRICE = 5000000; // 500만 (만원 단위 -> 5백억)
export const MAX_PROPERTY_AREA = 10000; // 최대 면적 10,000㎡
export const MIN_PROPERTY_AREA = 1; // 최소 면적 1㎡
export const MAX_PROPERTY_FLOOR = 100; // 최대 층수 100층
export const MIN_PROPERTY_FLOOR = -1; // 최소 층수 -1 (지하층)
export const MAX_PROPERTY_CONSTRUCTION_YEAR = new Date().getFullYear(); // 현재 연도
export const MIN_PROPERTY_CONSTRUCTION_YEAR = 1900; // 최소 연도 1900
export const MAX_PROPERTY_PARKING_CAPACITY = 100; // 최대 주차 가능 대수
export const MIN_PROPERTY_PARKING_CAPACITY = 0; // 최소 주차 가능 대수 0
