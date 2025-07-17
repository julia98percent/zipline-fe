import { SelectChangeEvent } from "@mui/material";
import Select, { MenuItem } from "@components/Select";
import TextField from "@components/TextField";

const BUILDING_TYPES = [
  "단독/다가구",
  "사무실",
  "건물",
  "빌라",
  "상가",
  "토지",
  "상가주택",
  "아파트",
  "한옥주택",
  "연립",
  "오피스텔",
  "다세대",
  "원룸",
  "재개발",
  "고시원",
  "공장/창고",
  "지식산업센터",
  "아파트분양권",
  "오피스텔분양권",
  "재건축",
  "전원주택",
];

interface PropertyTypeFilterSectionProps {
  category: string;
  buildingType: string;
  buildingName: string;
  onCategoryChange: (event: SelectChangeEvent<string>) => void;
  onBuildingTypeChange: (event: SelectChangeEvent<string>) => void;
  onBuildingNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PropertyTypeFilterSection({
  category,
  buildingType,
  buildingName,
  onCategoryChange,
  onBuildingTypeChange,
  onBuildingNameChange,
}: PropertyTypeFilterSectionProps) {
  return (
    <>
      <Select
        value={category || ""}
        onChange={onCategoryChange}
        label="매물 유형"
      >
        <MenuItem value="SALE">매매</MenuItem>
        <MenuItem value="MONTHLY">월세</MenuItem>
        <MenuItem value="DEPOSIT">전세</MenuItem>
      </Select>

      {/* Building Type */}
      <Select
        value={buildingType || ""}
        onChange={onBuildingTypeChange}
        label="건물 유형"
      >
        {BUILDING_TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>

      {/* Building Name */}
      <TextField
        value={buildingName || ""}
        onChange={onBuildingNameChange}
        label="건물명"
        fullWidth
      />
    </>
  );
}
