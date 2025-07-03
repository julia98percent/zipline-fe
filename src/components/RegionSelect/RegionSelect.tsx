import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { fetchSido, fetchSigungu, fetchDong } from "@apis/regionService";
import { Region } from "@ts/region";

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
  value: {
    code: string | null;
    name: string;
    legalDistrictCode?: string; // 8자리 법정동 코드
  };
  onChange: (value: { code: number | null; name: string }) => void;
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

  // 법정동 코드로부터 각 레벨의 코드 추출
  const extractRegionCodes = (legalDistrictCode: string) => {
    if (!legalDistrictCode || legalDistrictCode.length !== 8) return null;

    return {
      sidoCode: Number(legalDistrictCode.slice(0, 2).padEnd(8, "0")),
      sigunguCode: Number(legalDistrictCode.slice(0, 5).padEnd(8, "0")),
      dongCode: Number(legalDistrictCode),
    };
  };

  // 시도 데이터 초기 로드 및 초기 지역 설정
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const sidoList = await fetchSido();
        setRegion((prev) => ({ ...prev, sido: sidoList }));

        // 법정동 코드가 있는 경우 처리
        if (value.legalDistrictCode) {
          const codes = extractRegionCodes(value.legalDistrictCode);

          if (codes) {
            const matchedSido = sidoList.find(
              (sido: Region) => sido.cortarNo === codes.sidoCode
            );

            if (matchedSido) {
              setRegion((prev) => ({
                ...prev,
                selectedSido: matchedSido.cortarNo,
              }));

              // 시도 선택 및 시군구 데이터 로드
              try {
                const sigunguList = await fetchSigungu(matchedSido.cortarNo);
                const matchedSigungu = sigunguList.find(
                  (sigungu: Region) => sigungu.cortarNo === codes.sigunguCode
                );

                if (matchedSigungu) {
                  setRegion((prev) => ({
                    ...prev,
                    sigungu: sigunguList,
                    selectedSigungu: matchedSigungu.cortarNo,
                  }));

                  // 시군구 선택 및 동 데이터 로드
                  try {
                    const dongList = await fetchDong(matchedSigungu.cortarNo);
                    const matchedDong = dongList.find(
                      (dong: Region) => dong.cortarNo === codes.dongCode
                    );

                    if (matchedDong) {
                      setRegion((prev) => ({
                        ...prev,
                        dong: dongList,
                        selectedDong: matchedDong.cortarNo,
                      }));

                      const regionPath = `${matchedSido.cortarName} ${matchedSigungu.cortarName} ${matchedDong.cortarName}`;
                      onChange({
                        code: matchedDong.cortarNo,
                        name: regionPath,
                      });
                    }
                  } catch (error) {
                    console.error("동 데이터 로드 실패:", error);
                  }
                }
              } catch (error) {
                console.error("시군구 데이터 로드 실패:", error);
              }
            }
          }
        } else if (value.name) {
          const [sidoName, sigunguName, dongName] = value.name.split(" ");

          const matchedSido = sidoList.find(
            (sido: Region) => sido.cortarName === sidoName
          );

          if (matchedSido) {
            // 시도 선택 및 시군구 데이터 로드
            try {
              const sigunguList = await fetchSigungu(matchedSido.cortarNo);
              const matchedSigungu = sigunguList.find(
                (sigungu: Region) => sigungu.cortarName === sigunguName
              );

              setRegion((prev) => ({
                ...prev,
                selectedSido: matchedSido.cortarNo,
                sigungu: sigunguList,
              }));

              if (matchedSigungu) {
                // 시군구 선택 및 동 데이터 로드
                try {
                  const dongList = await fetchDong(matchedSigungu.cortarNo);
                  const matchedDong = dongList.find(
                    (dong: Region) => dong.cortarName === dongName
                  );

                  // 동 데이터와 선택 상태를 한 번에 업데이트
                  setRegion((prev) => ({
                    ...prev,
                    selectedSigungu: matchedSigungu.cortarNo,
                    dong: dongList,
                    selectedDong: matchedDong?.cortarNo || null,
                  }));

                  // 최종 선택된 지역 정보 전달
                  if (matchedDong) {
                    onChange({
                      code: matchedDong.cortarNo,
                      name: value.name,
                    });
                  }
                } catch (error) {
                  console.error("동 데이터 로드 실패:", error);
                }
              }
            } catch (error) {
              console.error("시군구 데이터 로드 실패:", error);
            }
          }
        }
      } catch (error) {
        console.error("시도 데이터 로드 실패:", error);
      }
    };

    loadInitialData();
  }, [value.legalDistrictCode, value.name, value.code, onChange]);

  // 시도 선택 시 군구 로드
  useEffect(() => {
    if (!region.selectedSido) return;

    const loadSigunguData = async () => {
      try {
        const sigunguList = await fetchSigungu(region.selectedSido as number);
        setRegion((prev) => ({
          ...prev,
          sigungu: sigunguList,
          // 시도가 변경되면 하위 선택값들만 초기화
          selectedSigungu: null,
          selectedDong: null,
          dong: [],
        }));
      } catch (error) {
        console.error("시군구 데이터 로드 실패:", error);
      }
    };

    loadSigunguData();
  }, [region.selectedSido]);

  // 군구 선택 시 동 로드
  useEffect(() => {
    if (!region.selectedSigungu) return;

    const loadDongData = async () => {
      try {
        const dongList = await fetchDong(region.selectedSigungu as number);
        setRegion((prev) => ({
          ...prev,
          dong: dongList,
          // 시군구가 변경되면 동 선택값만 초기화
          selectedDong: null,
        }));
      } catch (error) {
        console.error("동 데이터 로드 실패:", error);
      }
    };

    loadDongData();
  }, [region.selectedSigungu]);

  const handleRegionChange =
    (type: "sido" | "sigungu" | "dong") => (event: SelectChangeEvent) => {
      const selectedValue = Number(event.target.value) || null;

      // 상위 지역이 선택되지 않은 경우 하위 지역 선택 불가
      if (type === "sigungu" && !region.selectedSido) return;
      if (type === "dong" && !region.selectedSigungu) return;

      setRegion((prev) => {
        const key = `selected${
          type.charAt(0).toUpperCase() + type.slice(1)
        }` as keyof RegionState;

        return {
          ...prev,
          [key]: selectedValue,
        };
      });

      // 선택된 지역의 이름과 코드를 찾아서 onChange로 전달
      if (!selectedValue) {
        // 선택 해제된 경우
        if (type === "sido") {
          onChange({ code: null, name: "" });
        } else if (type === "sigungu" && region.selectedSido) {
          const sido = region.sido.find(
            (item) => item.cortarNo === region.selectedSido
          );
          onChange({ code: region.selectedSido, name: sido?.cortarName || "" });
        } else if (type === "dong" && region.selectedSigungu) {
          const sido = region.sido.find(
            (item) => item.cortarNo === region.selectedSido
          );
          const sigungu = region.sigungu.find(
            (item) => item.cortarNo === region.selectedSigungu
          );
          onChange({
            code: region.selectedSigungu,
            name: `${sido?.cortarName} ${sigungu?.cortarName}`,
          });
        }
      } else {
        // 새로운 지역이 선택된 경우
        const selectedRegion = region[type].find(
          (item) => item.cortarNo === selectedValue
        );
        if (selectedRegion) {
          let regionPath = "";
          const regionCode = selectedValue;

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
          onChange({ code: regionCode, name: regionPath });
        }
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
