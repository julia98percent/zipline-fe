import { Box, Typography } from "@mui/material";
import {
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
} from "../styles/AgentPropertyDetailPage.styles";
import { AgentPropertyDetail } from "@apis/propertyService";

interface PropertyDetailSectionProps {
  property: AgentPropertyDetail;
}

const PropertyDetailSection = ({ property }: PropertyDetailSectionProps) => {
  const formatValue = (
    value: number | null | undefined,
    suffix: string = ""
  ) => {
    if (value === null || value === undefined) return "-";
    return `${value}${suffix}`;
  };

  return (
    <InfoCard>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        매물 세부정보
      </Typography>

      <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1}>
        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>공급 면적</InfoLabel>
            <InfoValue>{formatValue(property.totalArea, "m²")}</InfoValue>
          </InfoItem>
        </Box>

        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>전용 면적</InfoLabel>
            <InfoValue>{formatValue(property.netArea, "m²")}</InfoValue>
          </InfoItem>
        </Box>

        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>층수</InfoLabel>
            <InfoValue>{formatValue(property.floor, "층")}</InfoValue>
          </InfoItem>
        </Box>

        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>건축년도</InfoLabel>
            <InfoValue>
              {formatValue(Number(property.constructionYear), "년")}
            </InfoValue>
          </InfoItem>
        </Box>
      </Box>
    </InfoCard>
  );
};

export default PropertyDetailSection;
