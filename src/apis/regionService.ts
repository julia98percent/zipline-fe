import apiClient from "@apis/apiClient";

export interface Region {
  cortarNo: number;
  cortarName: string;
  centerLat: number;
  centerLon: number;
  level: number;
  parentCortarNo: number;
}

export interface RegionResponse {
  success: boolean;
  code: number;
  message: string;
  data: Region[];
}

export const fetchRegions = async (parentCortarNo: number): Promise<Region[]> => {
  try {
    const { data: response } = await apiClient.get<RegionResponse>(
      `/region/${parentCortarNo}`
    );

    if (response.success && response.code === 200 && response.data) {
      return response.data;
    } else {
      console.error("Failed to fetch regions:", response.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

export const fetchSido = async (): Promise<Region[]> => {
  return fetchRegions(0);
};

export const fetchSigungu = async (sidoCortarNo: number): Promise<Region[]> => {
  return fetchRegions(sidoCortarNo);
};

export const fetchDong = async (sigunguCortarNo: number): Promise<Region[]> => {
  return fetchRegions(sigunguCortarNo);
};
