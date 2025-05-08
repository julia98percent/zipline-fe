import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import apiClient from "@apis/apiClient";

interface Region {
  cortarNo: number;
  cortarName: string;
  centerLat: number;
  centerLon: number;
  level: number;
  parentCortarNo: number;
}

interface RegionState {
  sido: Region[];
  sigungu: Region[];
  dong: Region[];
  selectedSido: number | null;
  selectedSigungu: number | null;
  selectedDong: number | null;
  [key: string]: Region[] | number | null;
}

interface RegionSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function RegionSelect({
  value,
  onChange,
  disabled = false,
}: RegionSelectProps) {
  const [region, setRegion] = useState<RegionState>({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedDong: null,
  });

  useEffect(() => {
    // 시/도 데이터 로드
    apiClient.get("/regions/sido").then((response) => {
      if (response.data?.data) {
        setRegion((prev) => ({
          ...prev,
          sido: response.data.data,
        }));

        // 초기값이 있는 경우 처리
        if (value) {
          const parts = value.split(" ");
          const sido = response.data.data.find(
            (item: Region) => item.cortarName === parts[0]
          );
          if (sido) {
            setRegion((prev) => ({
              ...prev,
              selectedSido: sido.cortarNo,
            }));
          }
        }
      }
    });
  }, [value]);

  useEffect(() => {
    // 시/군/구 데이터 로드
    if (region.selectedSido) {
      apiClient
        .get(`/regions/sigungu/${region.selectedSido}`)
        .then((response) => {
          if (response.data?.data) {
            setRegion((prev) => ({
              ...prev,
              sigungu: response.data.data,
              selectedSigungu: null,
              selectedDong: null,
              dong: [],
            }));

            // 초기값이 있는 경우 처리
            if (value) {
              const parts = value.split(" ");
              if (parts.length > 1) {
                const sigungu = response.data.data.find(
                  (item: Region) => item.cortarName === parts[1]
                );
                if (sigungu) {
                  setRegion((prev) => ({
                    ...prev,
                    selectedSigungu: sigungu.cortarNo,
                  }));
                }
              }
            }
          }
        });
    }
  }, [region.selectedSido, value]);

  useEffect(() => {
    // 동 데이터 로드
    if (region.selectedSigungu) {
      apiClient
        .get(`/regions/dong/${region.selectedSigungu}`)
        .then((response) => {
          if (response.data?.data) {
            setRegion((prev) => ({
              ...prev,
              dong: response.data.data,
              selectedDong: null,
            }));

            // 초기값이 있는 경우 처리
            if (value) {
              const parts = value.split(" ");
              if (parts.length > 2) {
                const dong = response.data.data.find(
                  (item: Region) => item.cortarName === parts[2]
                );
                if (dong) {
                  setRegion((prev) => ({
                    ...prev,
                    selectedDong: dong.cortarNo,
                  }));
                }
              }
            }
          }
        });
    }
  }, [region.selectedSigungu, value]);

  const handleRegionChange =
    (type: "sido" | "sigungu" | "dong") => (event: SelectChangeEvent) => {
      const value = Number(event.target.value);
      const key = `selected${
        type.charAt(0).toUpperCase() + type.slice(1)
      }` as keyof RegionState;

      setRegion((prev) => ({
        ...prev,
        [key]: value,
      }));

      // 선택된 지역의 이름을 찾아서 onChange로 전달
      const selectedRegion = region[type].find(
        (item) => item.cortarNo === value
      );
      if (selectedRegion) {
        let regionPath = "";
        if (type === "sido") {
          regionPath = selectedRegion.cortarName;
        } else if (type === "sigungu") {
          const sido = region.sido.find(
            (item) => item.cortarNo === region.selectedSido
          );
          regionPath = `${sido?.cortarName} ${selectedRegion.cortarName}`;
        } else if (type === "dong") {
          const sido = region.sido.find(
            (item) => item.cortarNo === region.selectedSido
          );
          const sigungu = region.sigungu.find(
            (item) => item.cortarNo === region.selectedSigungu
          );
          regionPath = `${sido?.cortarName} ${sigungu?.cortarName} ${selectedRegion.cortarName}`;
        }
        onChange(regionPath);
      }
    };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>시/도</InputLabel>
        <Select
          value={String(region.selectedSido || "")}
          onChange={handleRegionChange("sido")}
          label="시/도"
          disabled={disabled}
        >
          <MenuItem value="">
            <em>선택</em>
          </MenuItem>
          {region.sido.map((item) => (
            <MenuItem key={item.cortarNo} value={item.cortarNo}>
              {item.cortarName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>시/군/구</InputLabel>
        <Select
          value={String(region.selectedSigungu || "")}
          onChange={handleRegionChange("sigungu")}
          label="시/군/구"
          disabled={disabled || !region.selectedSido}
        >
          <MenuItem value="">
            <em>선택</em>
          </MenuItem>
          {region.sigungu.map((item) => (
            <MenuItem key={item.cortarNo} value={item.cortarNo}>
              {item.cortarName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>읍/면/동</InputLabel>
        <Select
          value={String(region.selectedDong || "")}
          onChange={handleRegionChange("dong")}
          label="읍/면/동"
          disabled={disabled || !region.selectedSigungu}
        >
          <MenuItem value="">
            <em>선택</em>
          </MenuItem>
          {region.dong.map((item) => (
            <MenuItem key={item.cortarNo} value={item.cortarNo}>
              {item.cortarName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default RegionSelect;
