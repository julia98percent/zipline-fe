import { Chip } from "@mui/material";
import { PublicPropertyItem } from "@ts/property";
import {
  getPropertyTypeColors,
  getPropertyCategoryColors,
} from "@constants/property";

// 색상을 가져오는 유틸리티 함수
const getColors = (type: string) => {
  // 거래 유형인 경우
  if (["SALE", "DEPOSIT", "MONTHLY"].includes(type)) {
    return getPropertyTypeColors(type);
  }
  // 매물 카테고리인 경우
  return getPropertyCategoryColors(type);
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

  Category: ({ category }: { category: string }) => {
    const colors = getColors(category);
    return (
      <Chip
        label={translateType(category)}
        sx={{
          backgroundColor: colors.background,
          color: colors.text,
          fontWeight: 500,
          fontSize: "0.95em",
        }}
        size="small"
      />
    );
  },

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
