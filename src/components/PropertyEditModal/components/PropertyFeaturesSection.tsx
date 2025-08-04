import { RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface PropertyFeaturesSectionProps {
  petsAllowed: boolean;
  hasElevator: boolean;
  onPetsAllowedChange: (allowed: boolean) => void;
  onHasElevatorChange: (hasElevator: boolean) => void;
}

const PropertyFeaturesSection = ({
  petsAllowed,
  hasElevator,
  onPetsAllowedChange,
  onHasElevatorChange,
}: PropertyFeaturesSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h6 className="font-semibold">반려동물 가능 여부</h6>
        <RadioGroup
          row
          value={petsAllowed.toString()}
          onChange={(e) => onPetsAllowedChange(e.target.value === "true")}
        >
          <FormControlLabel value={"true"} control={<Radio />} label="허용" />
          <FormControlLabel value={"false"} control={<Radio />} label="불가" />
        </RadioGroup>
      </div>
      <div>
        <h6 className="font-semibold">건물 엘리베이터 여부</h6>
        <RadioGroup
          row
          value={hasElevator.toString()}
          onChange={(e) => onHasElevatorChange(e.target.value === "true")}
        >
          <FormControlLabel value="true" control={<Radio />} label="있음" />
          <FormControlLabel value="false" control={<Radio />} label="없음" />
        </RadioGroup>
      </div>
    </div>
  );
};

export default PropertyFeaturesSection;
