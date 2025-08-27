import { RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface PropertyTypeSectionProps {
  realCategory: string;
  onRealCategoryChange: (category: string) => void;
}

const PropertyTypeSection = ({
  realCategory,
  onRealCategoryChange,
}: PropertyTypeSectionProps) => {
  return (
    <div className="p-5 card">
      <h6 className="font-semibold">부동산 유형 선택</h6>

      <div className="flex flex-col gap-4">
        <RadioGroup
          row
          value={realCategory}
          onChange={(event) => onRealCategoryChange(event.target.value)}
        >
          <FormControlLabel value="ONE_ROOM" control={<Radio />} label="원룸" />
          <FormControlLabel value="TWO_ROOM" control={<Radio />} label="투룸" />
          <FormControlLabel
            value="APARTMENT"
            control={<Radio />}
            label="아파트"
          />
          <FormControlLabel value="VILLA" control={<Radio />} label="빌라" />
          <FormControlLabel value="HOUSE" control={<Radio />} label="주택" />
          <FormControlLabel
            value="OFFICETEL"
            control={<Radio />}
            label="오피스텔"
          />
          <FormControlLabel
            value="COMMERCIAL"
            control={<Radio />}
            label="상가"
          />
        </RadioGroup>
      </div>
    </div>
  );
};

export default PropertyTypeSection;
