import { Chip } from "@mui/material";
import { PublicPropertyItem } from "@ts/property";
import {
  getPropertyTypeColors,
  getPropertyCategoryColors,
} from "@constants/property";
import { formatPublicPropertyPrice } from "@utils/numberUtil";

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
      className="font-medium"
    />
  ),

  Category: ({ category }: { category: string }) => {
    const colors = getColors(category);
    return (
      <Chip
        label={translateType(category)}
        className="font-medium text-sm"
        sx={{
          backgroundColor: colors.background,
          color: colors.text,
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

  Price: ({ price }: { price: number }) => (
    <span>{formatPublicPropertyPrice(price)}</span>
  ),

  MonthlyRent: ({ monthlyRent }: { monthlyRent: number }) => (
    <span>{monthlyRent === 0 ? "-" : `${monthlyRent}만`}</span>
  ),

  Area: ({ area, useMetric }: { area: number; useMetric: boolean }) => (
    <span>{useMetric ? `${area}m²` : `${(area / 3.3).toFixed(1)}평`}</span>
  ),
};

export default PropertyCellRenderer;
