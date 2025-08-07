import { PublicPropertyItem } from "@ts/property";
import { Typography, Chip, Box, Card, CardContent } from "@mui/material";
import { formatKoreanPrice } from "@utils/numberUtil";

interface PublicPropertyCardProps {
  property: PublicPropertyItem;
  useMetric: boolean;
}

const PublicPropertyCard = ({
  property,
  useMetric,
}: PublicPropertyCardProps) => {
  const getPriceText = (property: PublicPropertyItem) => {
    if (property.category === "SALE") {
      return property.price ? formatKoreanPrice(property.price) : "-";
    } else if (property.category === "DEPOSIT") {
      return property.deposit ? formatKoreanPrice(property.deposit) : "-";
    } else {
      const deposit = property.deposit
        ? formatKoreanPrice(property.deposit)
        : "0";
      const monthly = property.monthlyRent
        ? formatKoreanPrice(property.monthlyRent)
        : "0";
      return `${deposit}/${monthly}`;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "SALE":
        return "매매";
      case "DEPOSIT":
        return "전세";
      case "MONTHLY":
        return "월세";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "SALE":
        return { backgroundColor: "#e8f5e9", color: "#388e3c" };
      case "DEPOSIT":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "MONTHLY":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  const convertToKoreanPyeong = (squareMeters: number) => {
    return (squareMeters / 3.3).toFixed(1);
  };

  const formatArea = (area: number) => {
    if (!area) return "-";
    return useMetric ? `${area}㎡` : `${convertToKoreanPyeong(area)}평`;
  };

  const categoryColors = getCategoryColor(property.category);

  return (
    <Card className="mb-4 rounded-lg shadow-sm border border-gray-200">
      <CardContent className="p-4">
        {/* 상단: 플랫폼과 거래 유형 */}
        <Box className="flex gap-2 mb-3 items-center">
          <Chip
            label={property.platform}
            color="success"
            variant="outlined"
            size="small"
            className="font-medium"
          />
          <Chip
            label={getCategoryText(property.category)}
            size="small"
            className="text-xs h-6"
            style={{
              backgroundColor: categoryColors.backgroundColor,
              color: categoryColors.color,
            }}
            sx={{
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
          />
        </Box>

        {/* 건물 정보 */}
        {property.buildingName && (
          <Typography
            variant="subtitle1"
            className="font-semibold mb-1 text-base leading-6"
          >
            {property.buildingName}
          </Typography>
        )}

        {/* 주소 */}
        <Typography variant="body2" className="text-gray-600 mb-3 text-sm">
          {property.address || "-"}
        </Typography>

        {/* 면적과 가격 */}
        <Box className="flex justify-between items-center mb-3">
          <Box>
            <Typography variant="body2" className="text-gray-600 text-sm">
              전용: {formatArea(property.netArea)}
            </Typography>
            {property.totalArea && (
              <Typography variant="body2" className="text-gray-600 text-sm">
                공급: {formatArea(property.totalArea)}
              </Typography>
            )}
          </Box>
          <Typography variant="h6" className="font-bold text-gray-800 text-lg">
            {getPriceText(property)}
          </Typography>
        </Box>

        {/* 설명 */}
        {property.description && (
          <Box className="pt-3 border-t border-gray-200">
            <Typography
              variant="body2"
              className="text-gray-900 text-xs leading-5"
            >
              {property.description.length > 80
                ? property.description.slice(0, 80) + "..."
                : property.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicPropertyCard;
