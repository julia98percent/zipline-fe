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
    <InfoCard className="flex-[4] flex flex-col h-full min-h-58">
      <Typography variant="h6" className="font-bold mb-2">
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
