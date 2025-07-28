import { SelectChangeEvent } from "@mui/material";
import Select, { MenuItem } from "@components/Select";

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
  onCategoryChange: (event: SelectChangeEvent<string>) => void;
  onBuildingTypeChange: (event: SelectChangeEvent<string>) => void;
}

export default function PropertyTypeFilterSection({
  category,
  buildingType,
  onCategoryChange,
  onBuildingTypeChange,
}: PropertyTypeFilterSectionProps) {
  return (
    <div>
      <h6 className="text-base font-medium mb-2">유형</h6>
      <div className="flex gap-4 flex-col md:flex-row max-w-fit">
        <Select
          value={category || ""}
          onChange={onCategoryChange}
          label="매물 유형"
        >
          <MenuItem value="SALE">매매</MenuItem>
          <MenuItem value="MONTHLY">월세</MenuItem>
          <MenuItem value="DEPOSIT">전세</MenuItem>
        </Select>

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
      </div>
    </div>
  );
}
