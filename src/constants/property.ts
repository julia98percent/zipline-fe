// 거래 유형별
export const PROPERTY_TYPE_COLORS = {
  SALE: {
    background: "#e8f5e9",
    text: "#388e3c",
  },
  DEPOSIT: {
    background: "#e3f2fd",
    text: "#1976d2",
  },
  MONTHLY: {
    background: "#fff3e0",
    text: "#f57c00",
  },
} as const;

// 매물 카테고리별
export const PROPERTY_CATEGORY_COLORS = {
  APARTMENT: {
    background: "#e1f5fe",
    text: "#0277bd",
  },
  OFFICETEL: {
    background: "#f1f8e9",
    text: "#689f38",
  },
  VILLA: {
    background: "#fff8e1",
    text: "#f9a825",
  },
  ONE_ROOM: {
    background: "#f3e5f5",
    text: "#7b1fa2",
  },
  TWO_ROOM: {
    background: "#e8f5e9",
    text: "#388e3c",
  },
  HOUSE: {
    background: "#fce4ec",
    text: "#c2185b",
  },
  COMMERCIAL: {
    background: "#ede7f6",
    text: "#512da8",
  },
} as const;

// 기본 색상 (fallback)
export const DEFAULT_PROPERTY_COLORS = {
  background: "#F5F5F5",
  text: "#424242",
} as const;

export const getPropertyTypeColors = (type: string) => {
  return (
    PROPERTY_TYPE_COLORS[type as keyof typeof PROPERTY_TYPE_COLORS] || {
      background: "#f3e5f5",
      text: "#7b1fa2",
    }
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
