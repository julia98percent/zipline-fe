import { Box, Chip, Typography } from "@mui/material";
import {
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
} from "../styles/AgentPropertyDetailPage.styles";
import { AgentPropertyDetail } from "@apis/propertyService";
import {
  getPropertyTypeColors,
  getPropertyCategoryColors,
} from "@constants/property";
import { formatKoreanPrice } from "@utils/numberUtil";

interface PropertyInfoSectionProps {
  property: AgentPropertyDetail;
}

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

  const getTypeChipColor = (type: string) => {
    return getPropertyTypeColors(type).background;
  };

  const getTypeTextColor = (type: string) => {
    return getPropertyTypeColors(type).text;
  };

  const getCategoryChipColor = (category: string) => {
    return getPropertyCategoryColors(category).background;
  };

  const getCategoryTextColor = (category: string) => {
    return getPropertyCategoryColors(category).text;
  };

  const formatPrice = (price: number | null) => {
    return price ? formatKoreanPrice(price) : "-";
  };

  return (
    <InfoCard className="rounded-lg bg-white shadow-sm">
      <Typography className="text-xl font-semibold text-primary" gutterBottom>
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

            <Chip
              label={getTransactionType(property.type)}
              size="small"
              className="flex w-min font-medium text-sm"
              sx={{
                backgroundColor: getTypeChipColor(property.type),
                color: getTypeTextColor(property.type),
              }}
            />
          </InfoItem>
        </Box>

        {/* 매물 종류 */}
        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>매물 종류</InfoLabel>

            <Chip
              label={getCategoryName(property.realCategory)}
              size="small"
              className="flex w-min font-medium text-sm"
              sx={{
                backgroundColor: getCategoryChipColor(property.realCategory),
                color: getCategoryTextColor(property.realCategory),
              }}
            />
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
