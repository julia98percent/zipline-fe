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
    <div className="mb-8">
      <h6 className="text-lg font-bold mb-4">부가 정보</h6>
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">관심 지역</div>
        <div className="flex flex-col gap-4">
          <RegionSelector
            value={regionState.selectedSido || ""}
            regions={regionState.sido}
            onChange={(event) =>
              onRegionChange("sido")(event as unknown as SelectChangeEvent)
            }
            label="시/도"
          />

          <RegionSelector
            value={regionState.selectedSigungu || ""}
            regions={regionState.sigungu}
            onChange={(event) =>
              onRegionChange("sigungu")(event as unknown as SelectChangeEvent)
            }
            disabled={!regionState.selectedSido}
            label="시/군/구"
          />

          <RegionSelector
            value={regionState.selectedDong || ""}
            regions={regionState.dong}
            onChange={(event) =>
              onRegionChange("dong")(event as unknown as SelectChangeEvent)
            }
            disabled={!regionState.selectedSigungu}
            label="읍/면/동"
          />
        </div>
      </div>
      <div>
        <div className="text-sm font-medium mb-2">유입경로</div>
        <TextField
          name="trafficSource"
          value={trafficSource}
          onChange={onFieldChange}
          fullWidth
          placeholder="유입경로를 입력하세요"
          size="small"
        />
      </div>
    </div>
  );
}
