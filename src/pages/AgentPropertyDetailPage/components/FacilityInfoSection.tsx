import { Chip } from "@mui/material";

import { AgentPropertyDetail } from "@apis/propertyService";
import dayjs from "dayjs";
import InfoField from "@components/InfoField";

interface FacilityInfoSectionProps {
  property: AgentPropertyDetail;
}

const FacilityInfoSection = ({ property }: FacilityInfoSectionProps) => {
  return (
    <div className="card p-5">
      <h6 className="text-xl font-semibold text-primary mb-2">시설 정보</h6>

      <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2">
        <InfoField
          label="엘리베이터"
          value={
            <Chip
              label={property.hasElevator ? "O" : "X"}
              color={property.hasElevator ? "success" : "error"}
              variant="outlined"
              size="small"
              className="flex w-min font-semibold text-sm"
            />
          }
        />
        <InfoField
          label="주차"
          value={
            property.parkingCapacity
              ? `세대당 ${property.parkingCapacity}대`
              : "-"
          }
        />
        <InfoField
          label="반려동물"
          value={
            <Chip
              label={property.petsAllowed ? "O" : "X"}
              color={property.petsAllowed ? "success" : "error"}
              variant="outlined"
              size="small"
              className="flex w-min font-semibold text-sm"
            />
          }
        />
        <InfoField
          label="입주가능일"
          value={
            property.moveInDate
              ? dayjs(property.moveInDate).format("YYYY.MM.DD")
              : "-"
          }
        />
      </div>
    </div>
  );
};

export default FacilityInfoSection;
