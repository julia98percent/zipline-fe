import { SelectChangeEvent } from "@mui/material";
import RegionSelector from "@components/RegionSelector";
import TextField from "@components/TextField";
import { Region } from "@ts/region";

interface AdditionalInfoSectionProps {
  regionState: {
    sido: Region[];
    sigungu: Region[];
    dong: Region[];
    selectedSido: number | null;
    selectedSigungu: number | null;
    selectedDong: number | null;
  };
  trafficSource: string;
  onRegionChange: (
    type: "sido" | "sigungu" | "dong"
  ) => (event: SelectChangeEvent) => void;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AdditionalInfoSection({
  regionState,
  trafficSource,
  onRegionChange,
  onFieldChange,
}: AdditionalInfoSectionProps) {
  return (
    <div className="flex flex-col gap-5 my-4 pb-7 border-b border-gray-200">
      <h5 className="text-lg font-bold">부가 정보</h5>
      <div>
        <h6 className="mb-2 font-semibold">관심 지역</h6>
        <div className="grid grid-cols-3 gap-2">
          <RegionSelector
            value={regionState.selectedSido || ""}
            regions={regionState.sido}
            onChange={(event) =>
              onRegionChange("sido")(event as unknown as SelectChangeEvent)
            }
            label="시/도"
            size="medium"
          />

          <RegionSelector
            value={regionState.selectedSigungu || ""}
            regions={regionState.sigungu}
            onChange={(event) =>
              onRegionChange("sigungu")(event as unknown as SelectChangeEvent)
            }
            disabled={!regionState.selectedSido}
            label="시/군/구"
            size="medium"
          />

          <RegionSelector
            value={regionState.selectedDong || ""}
            regions={regionState.dong}
            onChange={(event) =>
              onRegionChange("dong")(event as unknown as SelectChangeEvent)
            }
            disabled={!regionState.selectedSigungu}
            label="읍/면/동"
            size="medium"
          />
        </div>
      </div>
      <div>
        <h6 className="mb-2 font-semibold">유입 경로</h6>
        <TextField
          name="trafficSource"
          value={trafficSource}
          onChange={onFieldChange}
          fullWidth
          placeholder="인터넷 검색, 지인 추천 등"
        />
      </div>
    </div>
  );
}
