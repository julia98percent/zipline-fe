export interface RegionHierarchy {
  sidoCode: number;
  sigunguCode?: number | null;
  dongCode?: number | null;
}

export const parseRegionCode = (regionCode: string): RegionHierarchy => {
  if (!regionCode || regionCode.length !== 10) {
    return { sidoCode: 0 };
  }

  const sidoCode = parseInt(regionCode.substring(0, 2) + "00000000", 10); // 1100000000

  // 시군구 코드 확인
  const sigunguPart = regionCode.substring(2, 5);
  const sigunguCode =
    sigunguPart !== "000"
      ? parseInt(regionCode.substring(0, 5) + "00000", 10) // 1168000000
      : null;

  // 동 코드 확인
  const dongPart = regionCode.substring(5, 8);
  const dongCode =
    dongPart !== "000" && sigunguCode
      ? parseInt(regionCode.substring(0, 8) + "00", 10) // 1168010100
      : null;

  return {
    sidoCode,
    sigunguCode,
    dongCode,
  };
};

export const getRegionLevel = (regionCode: string): number => {
  const { sigunguCode, dongCode } = parseRegionCode(regionCode);

  if (dongCode) return 3;
  if (sigunguCode) return 2;
  return 1;
};

export const getParentRegionCode = (regionCode: string): string | null => {
  const level = getRegionLevel(regionCode);

  if (level === 3) {
    return regionCode.substring(0, 5) + "00000";
  } else if (level === 2) {
    return regionCode.substring(0, 2) + "00000000";
  }

  return null;
};

export const padRegionCode = (regionCode: string): number => {
  if (regionCode.length === 2) {
    return parseInt(regionCode + "00000000", 10); // 시도: 12 -> 1200000000
  } else if (regionCode.length === 5) {
    return parseInt(regionCode + "00000", 10); // 시군구: 12345 -> 1234500000
  } else if (regionCode.length === 8) {
    return parseInt(regionCode + "00", 10); // 동: 12345678 -> 1234567800
  }
  return parseInt(regionCode, 10);
};
