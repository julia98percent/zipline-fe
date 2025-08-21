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
    if (value === null || value === undefined || isNaN(value)) return "-";
    return `${value}${suffix}`;
  };

  const formatConstructionYear = (year: string | null | undefined) => {
    if (!year || year.trim() === "") return "-";
    const numYear = Number(year);
    if (isNaN(numYear) || numYear <= 0) return "-";
    return `${numYear}년`;
  };

  return (
    <InfoCard className="rounded-lg bg-white shadow-sm">
      <Typography className="text-xl font-semibold text-primary" gutterBottom>
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
              {formatConstructionYear(property.constructionYear)}
            </InfoValue>
          </InfoItem>
        </Box>
      </Box>
    </InfoCard>
  );
};

export default PropertyDetailSection;
