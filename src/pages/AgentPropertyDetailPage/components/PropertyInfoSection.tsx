import { Box, Chip, Typography } from "@mui/material";
import {
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
} from "../styles/AgentPropertyDetailPage.styles";
import { AgentPropertyDetail } from "@apis/propertyService";

interface PropertyInfoSectionProps {
  property: AgentPropertyDetail;
}

const categoryColors: Record<
  AgentPropertyDetail["realCategory"],
  "primary" | "secondary" | "default" | "success" | "error" | "warning" | "info"
> = {
  ONE_ROOM: "primary",
  TWO_ROOM: "primary",
  APARTMENT: "success",
  VILLA: "info",
  HOUSE: "warning",
  OFFICETEL: "secondary",
  COMMERCIAL: "error",
};

const typeColors: Record<
  AgentPropertyDetail["type"],
  "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info"
> = {
  SALE: "error",
  DEPOSIT: "warning",
  MONTHLY: "success",
};

const PropertyInfoSection = ({ property }: PropertyInfoSectionProps) => {
  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      ONE_ROOM: "원룸",
      TWO_ROOM: "투룸",
      APARTMENT: "아파트",
      VILLA: "빌라",
      HOUSE: "주택",
      OFFICETEL: "오피스텔",
      COMMERCIAL: "상가",
    };
    return categories[category] || category;
  };

  const getTransactionType = (type: string) => {
    const types: { [key: string]: string } = {
      SALE: "매매",
      DEPOSIT: "전세",
      MONTHLY: "월세",
    };
    return types[type] || type;
  };

  const formatPrice = (price: number | null) => {
    return price ? price.toLocaleString() + "원" : "-";
  };

  return (
    <InfoCard>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        매물 정보
      </Typography>

      <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1}>
        {/* 고객명 */}
        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>고객명</InfoLabel>
            <InfoValue>{property.customer || "-"}</InfoValue>
          </InfoItem>
        </Box>

        {/* 거래 유형 */}
        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>거래 유형</InfoLabel>
            <InfoValue>
              <Chip
                label={getTransactionType(property.type)}
                color={typeColors[property.type] || "default"}
                variant="filled"
                size="small"
                sx={{ fontWeight: 500, fontSize: 13 }}
              />
            </InfoValue>
          </InfoItem>
        </Box>

        {/* 매물 종류 */}
        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>매물 종류</InfoLabel>
            <InfoValue>
              <Chip
                label={getCategoryName(property.realCategory)}
                color={categoryColors[property.realCategory] || "default"}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 500, fontSize: 13 }}
              />
            </InfoValue>
          </InfoItem>
        </Box>

        {/* 가격 정보 */}
        {property.type === "SALE" && (
          <Box width="calc(50% - 8px)">
            <InfoItem>
              <InfoLabel>매매가</InfoLabel>
              <InfoValue>{formatPrice(property.price)}</InfoValue>
            </InfoItem>
          </Box>
        )}

        {property.type === "DEPOSIT" && (
          <Box width="calc(50% - 8px)">
            <InfoItem>
              <InfoLabel>보증금</InfoLabel>
              <InfoValue>{formatPrice(property.deposit)}</InfoValue>
            </InfoItem>
          </Box>
        )}

        {property.type === "MONTHLY" && (
          <>
            <Box width="calc(50% - 8px)">
              <InfoItem>
                <InfoLabel>보증금</InfoLabel>
                <InfoValue>{formatPrice(property.deposit)}</InfoValue>
              </InfoItem>
            </Box>
            <Box width="calc(50% - 8px)">
              <InfoItem>
                <InfoLabel>월세</InfoLabel>
                <InfoValue>{formatPrice(property.monthlyRent)}</InfoValue>
              </InfoItem>
            </Box>
          </>
        )}
      </Box>
    </InfoCard>
  );
};

export default PropertyInfoSection;
