import { SelectChangeEvent } from "@mui/material";
import TextField from "@components/TextField";
import Chip from "@components/Chip";
import RegionSelector from "@components/RegionSelector";
import { Label } from "@ts/customer";
import { RegionState } from "@ts/region";

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
  buyer: "매수자",
  seller: "매도자",
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
    <div className="mb-6 flex flex-col gap-7">
      <div className="flex gap-7 items-center flex-wrap">
        {/* 검색창 */}
        <TextField
          size="small"
          placeholder="이름, 전화번호 검색"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-w-[180px]"
        />

        {/* 지역 선택 */}
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-600 min-w-[60px]">지역</div>
          <div className="flex gap-2">
            <RegionSelector
              value={region.selectedSido || ""}
              regions={region.sido}
              onChange={onRegionChange("sido")}
              label="시/도"
              className="min-w-[120px]"
            />
            <RegionSelector
              value={region.selectedSigungu || ""}
              regions={region.sigungu}
              onChange={onRegionChange("sigungu")}
              disabled={!region.selectedSido}
              label="시/군/구"
              className="min-w-[120px]"
            />
            <RegionSelector
              value={region.selectedDong || ""}
              regions={region.dong}
              onChange={onRegionChange("dong")}
              disabled={!region.selectedSigungu}
              label="읍/면/동"
              className="min-w-[120px]"
            />
          </div>
        </div>

        {/* 역할 필터 */}
        <div className="flex gap-2 items-center">
          <div className="text-sm text-gray-600 min-w-[60px]">고객 역할</div>
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

        {/* 라벨 필터 */}
        <div className="flex gap-2 items-center">
          <div className="text-sm text-gray-600 min-w-[60px]">고객 라벨</div>
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
  );
};

export default CustomerFilters;
