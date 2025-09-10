import { SelectChangeEvent } from "@mui/material";
import TextField from "@/components/TextField";
import Chip from "@/components/Chip";
import RegionSelector from "@/components/RegionSelector";
import { Label } from "@/types/customer";
import { RegionState } from "@/types/region";

interface CustomerFiltersProps {
  search: string;
  region: RegionState;
  roleFilters: {
    tenant: boolean;
    landlord: boolean;
    buyer: boolean;
    seller: boolean;
    noRole: boolean;
  };
  labelUids: number[];
  labels: Label[];
  onSearchChange: (value: string) => void;
  onRegionChange: (
    type: "sido" | "sigungu" | "dong"
  ) => (event: SelectChangeEvent<number>) => void;
  onRoleFilterChange: (role: string) => void;
  onLabelFilterChange: (labelUid: number) => void;
}

const ROLE_LABELS: Record<string, string> = {
  tenant: "임차인",
  landlord: "임대인",
  buyer: "매수인",
  seller: "매도인",
  noRole: "역할없음",
};

const CustomerFilters = ({
  search,
  region,
  roleFilters,
  labelUids,
  labels,
  onSearchChange,
  onRegionChange,
  onRoleFilterChange,
  onLabelFilterChange,
}: CustomerFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 p-3 card mt-4">
      <TextField
        size="small"
        placeholder="이름, 전화번호 검색"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-[180px]"
        fullWidth
      />

      {/* 지역 선택 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-10">
        <h6 className="whitespace-nowrap font-medium text-gray-800">지역</h6>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <RegionSelector
            value={region.selectedSido || ""}
            regions={region.sido}
            onChange={onRegionChange("sido")}
            label="시/도"
          />
          <RegionSelector
            value={region.selectedSigungu || ""}
            regions={region.sigungu}
            onChange={onRegionChange("sigungu")}
            disabled={!region.selectedSido}
            label="시/군/구"
          />
          <RegionSelector
            value={region.selectedDong || ""}
            regions={region.dong}
            onChange={onRegionChange("dong")}
            disabled={!region.selectedSigungu}
            label="읍/면/동"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* 역할 필터 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h6 className="font-medium text-gray-800">고객 역할</h6>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
            {(Object.keys(roleFilters) as (keyof typeof roleFilters)[]).map(
              (role) => (
                <Chip
                  key={role}
                  text={ROLE_LABELS[role]}
                  onClick={() => onRoleFilterChange(role)}
                  color={roleFilters[role] ? "primary" : "default"}
                />
              )
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h6 className="font-medium text-gray-800">고객 라벨</h6>
          <div>
            {labels.map((label) => (
              <Chip
                key={label.uid}
                text={label.name}
                onClick={() => onLabelFilterChange(label.uid)}
                color={labelUids.includes(label.uid) ? "primary" : "default"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFilters;
