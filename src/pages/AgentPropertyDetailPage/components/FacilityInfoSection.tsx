import { Box, Chip, Typography } from "@mui/material";
import {
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
} from "../styles/AgentPropertyDetailPage.styles";
import { AgentPropertyDetail } from "@apis/propertyService";
import dayjs from "dayjs";

interface FacilityInfoSectionProps {
  property: AgentPropertyDetail;
}

const FacilityInfoSection = ({ property }: FacilityInfoSectionProps) => {
  return (
    <InfoCard>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        시설 정보
      </Typography>

      <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1}>
        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>엘리베이터</InfoLabel>
            <InfoValue>
              <Chip
                label={property.hasElevator ? "O" : "X"}
                color={property.hasElevator ? "success" : "error"}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600, fontSize: 13 }}
              />
            </InfoValue>
          </InfoItem>
        </Box>

        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>주차</InfoLabel>
            <InfoValue>
              {property.parkingCapacity
                ? `세대당 ${property.parkingCapacity}대`
                : "-"}
            </InfoValue>
          </InfoItem>
        </Box>

        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>반려동물</InfoLabel>
            <InfoValue>
              <Chip
                label={property.petsAllowed ? "O" : "X"}
                color={property.petsAllowed ? "success" : "error"}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600, fontSize: 13 }}
              />
            </InfoValue>
          </InfoItem>
        </Box>

        <Box width="calc(50% - 8px)">
          <InfoItem>
            <InfoLabel>입주가능일</InfoLabel>
            <InfoValue>
              {property.moveInDate
                ? dayjs(property.moveInDate).format("YYYY.MM.DD")
                : "-"}
            </InfoValue>
          </InfoItem>
        </Box>
      </Box>
    </InfoCard>
  );
};

export default FacilityInfoSection;
