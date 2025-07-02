import { Chip } from "@mui/material";
import { PublicPropertyItem } from "@ts/property";

// 연한 파스텔톤 색상 매핑
const colorMap: Record<string, string> = {
  SALE: "#e8f5e9", // 연한 초록
  DEPOSIT: "#e3f2fd", // 연한 파랑
  MONTHLY: "#fff3e0", // 연한 주황
};

const textColorMap: Record<string, string> = {
  SALE: "#388e3c", // 진한 초록
  DEPOSIT: "#1976d2", // 진한 파랑
  MONTHLY: "#f57c00", // 진한 주황
};

const translateType = (type: string) => {
  switch (type) {
    case "SALE":
      return "매매";
    case "DEPOSIT":
      return "전세";
    case "MONTHLY":
      return "월세";
    default:
      return "-";
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

  Price: ({ price }: { price: number }) => <span>{formatPrice(price)}</span>,

  MonthlyRent: ({ monthlyRent }: { monthlyRent: number }) => (
    <span>{monthlyRent === 0 ? "-" : `${monthlyRent}만`}</span>
  ),

  Area: ({ area, useMetric }: { area: number; useMetric: boolean }) => (
    <span>{useMetric ? `${area}m²` : `${(area / 3.3).toFixed(1)}평`}</span>
  ),
};

export default PropertyCellRenderer;
