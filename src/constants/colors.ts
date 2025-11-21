/**
 * 중앙 색상 팔레트
 * 프로젝트 전체에서 사용되는 모든 색상을 여기서 관리합니다.
 */

/**
 * Primary 브랜드 색상
 */
export const PRIMARY = {
  light: "#2a6fdb",
  main: "#164F9E",
  dark: "#0d3b7a",
} as const;

/**
 * Secondary 색상
 */
export const SECONDARY = {
  main: "#2E5D9F",
} as const;

/**
 * 상태별 색상 (Status Colors)
 */
export const SUCCESS = {
  light: "#e8f5e9",
  main: "#4caf50",
  dark: "#2e7d32",
  text: "#388e3c",
  alt: "#219653", // 매수인 색상
  altLight: "#E9F7EF", // 매수인 배경
} as const;

export const WARNING = {
  light: "#fff3e0",
  main: "#f57c00",
  dark: "#ff9800",
} as const;

export const ERROR = {
  light: "#FDEEEE",
  main: "#EB5757",
  dark: "#d32f2f",
} as const;

export const INFO = {
  light: "#070a0dff",
  main: "#1976d2",
  dark: "#0288d1",
  alt: "#2196f3", // 전세 색상
} as const;

export const PURPLE = {
  light: "#f3e5f5",
  main: "#7b1fa2",
  dark: "#9c27b0",
} as const;

/**
 * 계약 유형별 색상
 */
export const CONTRACT_TYPES = {
  SALE: {
    background: SUCCESS.light,
    text: SUCCESS.text,
  },
  DEPOSIT: {
    background: INFO.light,
    text: INFO.main,
  },
  MONTHLY: {
    background: WARNING.light,
    text: WARNING.main,
  },
} as const;

/**
 * 고객 역할별 색상
 */
export const CUSTOMER_ROLES = {
  tenant: {
    background: WARNING.light,
    text: WARNING.dark,
    label: "임차인",
  },
  landlord: {
    background: ERROR.light,
    text: ERROR.main,
    label: "임대인",
  },
  buyer: {
    background: SUCCESS.altLight,
    text: SUCCESS.alt,
    label: "매수인",
  },
  seller: {
    background: "#EBF2FC",
    text: "#2F80ED",
    label: "매도인",
  },
} as const;

/**
 * 매물 카테고리별 색상
 */
export const PROPERTY_CATEGORIES = {
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
    background: PURPLE.light,
    text: PURPLE.main,
  },
  TWO_ROOM: {
    background: SUCCESS.light,
    text: SUCCESS.text,
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

/**
 * 스케줄 색상 (고객별 색상)
 */
export const SCHEDULE_COLORS = [
  "#e3f2fd", // blue
  "#f3e5f5", // purple
  "#e8f5e8", // green
  "#fff3e0", // orange
  "#fce4ec", // pink
  "#e0f2f1", // teal
  "#f1f8e9", // light green
  "#fff8e1", // amber
  "#e1f5fe", // light blue
  "#f9fbe7", // lime
] as const;

/**
 * Neutral 색상 (회색 팔레트)
 */
export const NEUTRAL = {
  50: "#f9f9f9",
  100: "#f5f5f5",
  200: "#f0f0f0",
  300: "#e0e0e0",
  400: "#d0d0d0",
  500: "#999999",
  600: "#666666",
  700: "#424242",
  800: "#333333",
  900: "#222222",
  950: "#000000",
} as const;

/**
 * 배경색
 */
export const BACKGROUND = {
  default: "#ffffff",
  light: NEUTRAL[50],
  paper: "#ffffff",
  disabled: NEUTRAL[200],
} as const;

/**
 * 텍스트 색상
 */
export const TEXT = {
  primary: NEUTRAL[900],
  secondary: NEUTRAL[600],
  disabled: NEUTRAL[500],
  hint: "#757575",
} as const;

/**
 * 투명도 레벨 (Opacity Levels)
 */
export const OPACITY = {
  light: 0.04,
  medium: 0.15,
  dark: 0.23,
  disabled: 0.6,
  text: 0.87,
} as const;

/**
 * RGBA 헬퍼 함수
 */
export const rgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * 자주 사용되는 RGBA 색상
 */
export const RGBA = {
  // Primary with opacity
  primaryLight: rgba(PRIMARY.main, OPACITY.light),
  primaryMedium: rgba(PRIMARY.main, OPACITY.medium),
  primaryDark: rgba(PRIMARY.main, OPACITY.dark),

  // Black with opacity
  blackLight: `rgba(0, 0, 0, ${OPACITY.light})`,
  blackMedium: `rgba(0, 0, 0, ${OPACITY.medium})`,
  blackDark: `rgba(0, 0, 0, ${OPACITY.dark})`,
  blackDisabled: `rgba(0, 0, 0, ${OPACITY.disabled})`,
  blackText: `rgba(0, 0, 0, ${OPACITY.text})`,

  // White with opacity
  white: "rgba(255, 255, 255, 1)",
  whiteDisabled: "rgba(255, 255, 255, 0.7)",
} as const;

/**
 * Gradient 색상
 */
export const GRADIENT = {
  circularProgress: {
    start: "#73a8ff",
    end: "#3b70c4",
  },
} as const;

/**
 * MUI-aligned status colors (Chip 컴포넌트 등에서 사용)
 */
export const MUI_COLORS = {
  primary: "#1976d2",
  success: "#2e7d32",
  error: "#d32f2f",
  warning: "#ed6c02",
  info: "#0288d1",
  secondary: "#9c27b0",
  default: "#999",
} as const;

/**
 * 기타 UI 요소 색상
 */
export const UI = {
  border: NEUTRAL[300],
  divider: NEUTRAL[300],
  hover: NEUTRAL[100],
  selected: INFO.light,
  focus: PRIMARY.main,
  switch: {
    active: PRIMARY.main,
    inactive: "#E9E9EA",
    thumb: "#ffffff",
  },
} as const;
