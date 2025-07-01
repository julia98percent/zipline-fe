import { Typography } from "@mui/material";
import {
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
} from "../styles/AgentPropertyDetailPage.styles";

interface PropertyDetailsSectionProps {
  details: string;
}

const PropertyDetailsSection = ({ details }: PropertyDetailsSectionProps) => {
  if (!details) return null;

  return (
    <InfoCard
      sx={{
        flex: 4,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "230px",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        상세 정보
      </Typography>
      <InfoItem>
        <InfoLabel>특이사항</InfoLabel>
        <InfoValue>{details || "-"}</InfoValue>
      </InfoItem>
    </InfoCard>
  );
};

export default PropertyDetailsSection;
