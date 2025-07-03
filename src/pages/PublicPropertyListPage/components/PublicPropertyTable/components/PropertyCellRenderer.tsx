import { Chip } from "@mui/material";
import { PublicPropertyItem } from "@ts/property";

// 연한 파스텔톤 색상 매핑
const colorMap: Record<string, string> = {
  // 거래 유형
  SALE: "#e8f5e9", // 연한 초록
  DEPOSIT: "#e3f2fd", // 연한 파랑
  MONTHLY: "#fff3e0", // 연한 주황
  // 건물 유형
  ONE_ROOM: "#f3e5f5", // 연한 보라
  TWO_ROOM: "#e8f5e9", // 연한 초록
  APARTMENT: "#e1f5fe", // 연한 시안
  VILLA: "#fff8e1", // 연한 노랑
  HOUSE: "#fce4ec", // 연한 핑크
  OFFICETEL: "#f1f8e9", // 연한 연두
  COMMERCIAL: "#ede7f6", // 연한 인디고
};

const textColorMap: Record<string, string> = {
  // 거래 유형
  SALE: "#388e3c", // 진한 초록
  DEPOSIT: "#1976d2", // 진한 파랑
  MONTHLY: "#f57c00", // 진한 주황
  // 건물 유형
  ONE_ROOM: "#7b1fa2", // 진한 보라
  TWO_ROOM: "#388e3c", // 진한 초록
  APARTMENT: "#0277bd", // 진한 시안
  VILLA: "#f9a825", // 진한 노랑
  HOUSE: "#c2185b", // 진한 핑크
  OFFICETEL: "#689f38", // 진한 연두
  COMMERCIAL: "#512da8", // 진한 인디고
};

const translateType = (type: string) => {
  switch (type) {
    case "SALE":
      return "매매";
    case "DEPOSIT":
      return "전세";
    case "MONTHLY":
      return "월세";
    // 건물 유형도 처리
    case "ONE_ROOM":
      return "원룸";
    case "TWO_ROOM":
      return "투룸";
    case "APARTMENT":
      return "아파트";
    case "VILLA":
      return "빌라";
    case "HOUSE":
      return "주택";
    case "OFFICETEL":
      return "오피스텔";
    case "COMMERCIAL":
      return "상가";
    default:
      return type || "-";
  }
};

const formatPrice = (value: number) => {
  if (value === 0) return "-";
  return value >= 10000
    ? `${Math.floor(value / 10000)}억 ${
        value % 10000 > 0 ? `${value % 10000}만` : ""
      }`
    : `${value}만`;
};

const formatBuildingInfo = (property: PublicPropertyItem) => {
  if (!property.buildingName && !property.buildingType) return "-";

  const buildingType = property.buildingType
    ? `[${property.buildingType}]`
    : "";
  const buildingName = property.buildingName || "";

  return `${buildingType} ${buildingName}`.trim();
};

const PropertyCellRenderer = {
  Platform: ({ platform }: { platform: string }) => (
    <Chip
      label={platform}
      color="success"
      variant="outlined"
      size="small"
      sx={{ fontWeight: 500 }}
    />
  ),

  Category: ({ category }: { category: string }) => (
    <Chip
      label={translateType(category)}
      sx={{
        backgroundColor: colorMap[category] || "#e0e0e0",
        color: textColorMap[category] || "#222",
        fontWeight: 500,
        fontSize: "0.95em",
      }}
      size="small"
    />
  ),

  BuildingInfo: ({ property }: { property: PublicPropertyItem }) => (
    <span>{formatBuildingInfo(property)}</span>
  ),

  Address: ({ address }: { address: string }) => <span>{address || "-"}</span>,

  Description: ({ description }: { description: string }) => (
    <span>
      {description
        ? description.length > 30
          ? description.slice(0, 30) + "..."
          : description
        : "-"}
    </span>
  ),

  Price: ({ price }: { price: number }) => <span>{formatPrice(price)}</span>,

  MonthlyRent: ({ monthlyRent }: { monthlyRent: number }) => (
    <span>{monthlyRent === 0 ? "-" : `${monthlyRent}만`}</span>
  ),

  Area: ({ area, useMetric }: { area: number; useMetric: boolean }) => (
    <span>{useMetric ? `${area}m²` : `${(area / 3.3).toFixed(1)}평`}</span>
  ),
};

export default PropertyCellRenderer;
