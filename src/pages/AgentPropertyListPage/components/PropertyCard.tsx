import { Property, PropertyCategory } from "@ts/property";
import { formatDate } from "@utils/dateUtil";
import { Typography, Chip, Box, Card, CardContent } from "@mui/material";
import {
  getPropertyTypeColors,
  getPropertyCategoryColors,
} from "@constants/property";

interface PropertyCardProps {
  property: Property;
  onRowClick?: (property: Property) => void;
}

const PropertyCard = ({ property, onRowClick }: PropertyCardProps) => {
  const getPropertyTypeText = (type: string) => {
    switch (type) {
      case "SALE":
        return "매매";
      case "DEPOSIT":
        return "전세";
      case "MONTHLY":
        return "월세";
      default:
        return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원";
  };

  const getPriceText = (property: Property) => {
    if (property.type === "SALE") {
      return property.price ? formatCurrency(property.price) : "-";
    } else if (property.type === "DEPOSIT") {
      return property.deposit ? formatCurrency(property.deposit) : "-";
    } else {
      const deposit = property.deposit ? formatCurrency(property.deposit) : "0";
      const monthly = property.monthlyRent
        ? formatCurrency(property.monthlyRent)
        : "0";
      return `${deposit}/${monthly}`;
    }
  };

  const getTypeChipColor = (type: string) => {
    return getPropertyTypeColors(type).text;
  };

  const getCategoryChipColor = (category: string) => {
    return getPropertyCategoryColors(category).text;
  };

  const handleClick = () => {
    onRowClick?.(property);
  };

  return (
    <Card
      className="mb-4 rounded-lg shadow-sm"
      style={{
        cursor: onRowClick ? "pointer" : "default",
      }}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {/* 상단: 매물 유형과 거래 유형 */}
        <Box className="flex gap-2 mb-3">
          <Chip
            label={PropertyCategory[property.realCategory]}
            size="small"
            variant="outlined"
            className="text-xs h-6"
            style={{
              borderColor: getCategoryChipColor(property.realCategory),
              color: getCategoryChipColor(property.realCategory),
            }}
            sx={{
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
          />
          <Chip
            label={getPropertyTypeText(property.type)}
            size="small"
            variant="outlined"
            className="text-xs h-6"
            style={{
              borderColor: getTypeChipColor(property.type),
              color: getTypeChipColor(property.type),
            }}
            sx={{
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
          />
        </Box>

        {/* 주소 */}
        <Typography
          variant="subtitle1"
          className="font-semibold mb-1 text-base leading-6"
        >
          {property.address}
        </Typography>
        {property.detailAddress && (
          <Typography variant="body2" className="text-gray-600 mb-3 text-sm">
            {property.detailAddress}
          </Typography>
        )}

        {/* 면적과 가격 */}
        <Box className="flex justify-between items-end">
          <Typography variant="body2" className="text-gray-600 text-sm">
            {property.netArea.toFixed(1)}m²
          </Typography>
          <Typography variant="h6" className="font-bold text-gray-800 text-lg">
            {getPriceText(property)}
          </Typography>
        </Box>

        {/* 기타 정보 (입주일, 상세설명) */}
        {(property.moveInDate || property.details) && (
          <Box className="mt-3 pt-3 border-t border-gray-200">
            {property.moveInDate && (
              <Typography
                variant="caption"
                className="text-gray-600 block text-xs mb-1"
              >
                입주 가능일: {formatDate(property.moveInDate)}
              </Typography>
            )}
            {property.details && (
              <Typography
                variant="body2"
                className="text-gray-900 text-xs leading-6"
              >
                {property.details.length > 50
                  ? property.details.slice(0, 50) + "..."
                  : property.details}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
