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
