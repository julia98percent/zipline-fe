import { SelectChangeEvent } from "@mui/material";
import Select, { MenuItem } from "@/components/Select";
import Button from "@/components/Button";

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

const CATEGORY_OPTIONS = [
  { value: "SALE", label: "매매" },
  { value: "MONTHLY", label: "월세" },
  { value: "DEPOSIT", label: "전세" },
];

interface PropertyTypeFilterSectionProps {
  category: string;
  buildingType: string;
  onCategoryChange: React.MouseEventHandler<HTMLButtonElement>;
  onBuildingTypeChange: (event: SelectChangeEvent<string>) => void;
}

export default function PropertyTypeFilterSection({
  category,
  buildingType,
  onCategoryChange,
  onBuildingTypeChange,
}: PropertyTypeFilterSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h6 className="font-semibold mb-2">건물 유형</h6>
        <Select
          value={buildingType || ""}
          onChange={onBuildingTypeChange}
          label="건물 유형"
          fullWidth
          size="medium"
        >
          {BUILDING_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div>
        <h6 className="font-semibold mb-2">매물 유형</h6>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button
            variant={category === "" ? "contained" : "outlined"}
            onClick={onCategoryChange}
            size="small"
            value=""
          >
            전체
          </Button>
          {CATEGORY_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={category === opt.value ? "contained" : "outlined"}
              onClick={onCategoryChange}
              size="small"
              value={opt.value}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
