import { Typography } from "@mui/material";
import {
  InfoCard,
  InfoItem,
  InfoValue,
} from "../styles/AgentPropertyDetailPage.styles";

interface PropertyDetailsSectionProps {
  details: string;
}

const PropertyDetailsSection = ({ details }: PropertyDetailsSectionProps) => {
  if (!details) return null;

  return (
    <InfoCard className="flex-[4] flex flex-col h-full min-h-58">
      <Typography className="text-primary text-xl font-bold">
        특이 사항
      </Typography>
      <InfoItem>
        <InfoValue>{details || "-"}</InfoValue>
      </InfoItem>
    </InfoCard>
  );
};

export default PropertyDetailsSection;
