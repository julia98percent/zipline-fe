import { SelectChangeEvent } from "@mui/material";
import { MenuItem, NumberSelect } from "@components/Select";

interface Region {
  cortarNo: number;
  cortarName: string;
}

interface RegionSelectorProps {
  label?: string;
  value: string | number;
  regions: Region[];
  onChange: (event: SelectChangeEvent<number>, child: React.ReactNode) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showEmptyOption?: boolean;
  size?: "small" | "medium";
}

const RegionSelector = ({
  label,
  value,
  regions,
  onChange,
  disabled = false,
  placeholder = "전체",
  className,
  showEmptyOption = true,
  size = "small",
}: RegionSelectorProps) => {
  return (
    <NumberSelect
      label={label || undefined}
      value={String(value || "")}
      onChange={onChange}
      disabled={disabled}
      className={className}
      showEmptyOption={showEmptyOption}
      emptyText={placeholder}
      size={size}
    >
      {regions.map((region) => (
        <MenuItem key={region.cortarNo} value={String(region.cortarNo)}>
          {region.cortarName}
        </MenuItem>
      ))}
    </NumberSelect>
  );
};

export default RegionSelector;
export type { RegionSelectorProps, Region };
