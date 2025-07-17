import { Property, PropertyCategory } from "@ts/property";
import { formatDate } from "@utils/dateUtil";
import { Typography, Chip, Box, Card, CardContent } from "@mui/material";

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
    switch (type) {
      case "SALE":
        return "#FF6B6B"; // 빨간색 계열
      case "DEPOSIT":
        return "#FFB84D"; // 주황색 계열
      case "MONTHLY":
        return "#4ECDC4"; // 민트색 계열
      default:
        return "#6C7CE7"; // 보라색 계열
    }
  };

  const getCategoryChipColor = (category: string) => {
    switch (category) {
      case "APARTMENT":
        return "#E8F4FD"; // 연한 파란색
      case "OFFICETEL":
        return "#E8F5E8"; // 연한 초록색
      case "VILLA":
        return "#FFF3E0"; // 연한 주황색
      default:
        return "#F3E5F5"; // 연한 보라색
    }
  };

  const handleClick = () => {
    onRowClick?.(property);
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        cursor: onRowClick ? "pointer" : "default",
        "&:hover": {
          boxShadow: onRowClick
            ? "0 4px 12px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.08)",
        },
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ padding: "16px !important" }}>
        {/* 상단: 매물 유형과 거래 유형 */}
        <Box sx={{ display: "flex", gap: 1, marginBottom: 1.5 }}>
          <Chip
            label={PropertyCategory[property.realCategory]}
            size="small"
            sx={{
              backgroundColor: getCategoryChipColor(property.realCategory),
              color: "#333",
              fontSize: "12px",
              height: "24px",
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
          />
          <Chip
            label={getPropertyTypeText(property.type)}
            size="small"
            sx={{
              backgroundColor: getTypeChipColor(property.type),
              color: "white",
              fontSize: "12px",
              height: "24px",
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
          />
        </Box>

        {/* 주소 */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            marginBottom: 0.5,
            fontSize: "16px",
            lineHeight: 1.4,
          }}
        >
          {property.address}
        </Typography>
        {property.detailAddress && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              marginBottom: 1.5,
              fontSize: "14px",
            }}
          >
            {property.detailAddress}
          </Typography>
        )}

        {/* 면적과 가격 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "14px",
            }}
          >
            {property.netArea.toFixed(1)}m²
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#333",
              fontSize: "18px",
            }}
          >
            {getPriceText(property)}
          </Typography>
        </Box>

        {/* 기타 정보 (입주일, 상세설명) */}
        {(property.moveInDate || property.details) && (
          <Box
            sx={{
              marginTop: 1.5,
              paddingTop: 1.5,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            {property.moveInDate && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                  fontSize: "12px",
                  marginBottom: 0.5,
                }}
              >
                입주: {formatDate(property.moveInDate)}
              </Typography>
            )}
            {property.details && (
              <Typography
                variant="body2"
                sx={{
                  color: "text.primary",
                  fontSize: "13px",
                  lineHeight: 1.4,
                }}
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
