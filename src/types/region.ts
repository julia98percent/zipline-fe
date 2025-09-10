import { FilterSectionProps } from "@/types/customer";
export interface Region {
  cortarNo: number;
  cortarName: string;
  centerLat: number;
  centerLon: number;
  level: number;
  parentCortarNo: number;
}

export interface RegionState {
  sido: Region[];
  sigungu: Region[];
  dong: Region[];
  selectedSido: number | null;
  selectedSigungu: number | null;
  selectedDong: number | null;
  [key: string]: Region[] | number | null;
}

export interface RegionFiltersProps extends FilterSectionProps {
  region: RegionState;
  setRegion: (
    region: RegionState | ((prev: RegionState) => RegionState)
  ) => void;
}
