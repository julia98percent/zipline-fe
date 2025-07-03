import { Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";

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
    <>
      {/* 반려동물 여부 */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        반려동물 여부
      </Typography>
      <RadioGroup
        row
        value={petsAllowed.toString()}
        onChange={(e) => onPetsAllowedChange(e.target.value === "true")}
      >
        <FormControlLabel value={"true"} control={<Radio />} label="허용" />
        <FormControlLabel value={"false"} control={<Radio />} label="불가" />
      </RadioGroup>

      {/* 건물 엘리베이터 여부 */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        건물 엘리베이터 여부
      </Typography>
      <RadioGroup
        row
        value={hasElevator.toString()}
        onChange={(e) => onHasElevatorChange(e.target.value === "true")}
      >
        <FormControlLabel value="true" control={<Radio />} label="있음" />
        <FormControlLabel value="false" control={<Radio />} label="없음" />
      </RadioGroup>
    </>
  );
};

export default PropertyFeaturesSection;
