import apiClient from "@/apis/apiClient";
import {
  ApiResponse,
  CursorPaginatedResponse,
  PaginatedResponse,
} from "@/types/apiResponse";
import { ContractCategoryType } from "@/types/contract";
import {
  PropertyType,
  PropertyCategoryType,
  PublicPropertyItem,
  PublicPropertySearchParams,
  PublicPropertySearchResponse,
  Property,
} from "@/types/property";

export interface AgentPropertyDetail {
  customer: string;
  address: string;
  detailAddress: string;
  legalDistrictCode: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  type: PropertyType;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
  moveInDate: string;
  realCategory: PropertyCategoryType;
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: string;
  parkingCapacity: number;
  netArea: number;
  totalArea: number;
  details: string;
}

export interface ContractCustomer {
  customerUid: number;
  customerName: string;
  customerRole: "LESSOR_OR_SELLER" | "LESSEE_OR_BUYER";
}

export interface ContractHistoryItem {
  contractUid: number;
  contractCategory: ContractCategoryType | null;
  endDate: string;
  contractStatus: string;
  customers: ContractCustomer[];
}

export interface ContractInfo {
  contractUid: number;
  contractCategory: "SALE" | "DEPOSIT" | "MONTHLY";
  contractStartDate: string | null;
  contractEndDate: string | null;
  contractDate: string | null;
  customers: ContractCustomer[];
}

export interface CounselHistory {
  counselUid: number;
  counselTitle: string;
  counselDate: string;
  customerName: string;
  customerPhoneNo: string;
}

export interface PropertyAddData {
  customerUid: number;
  address: string;
  detailAddress: string;
  legalDistrictCode: string;
  deposit: number | null;
  monthlyRent: number | null;
  price: number | null;
  type: PropertyType;
  longitude: number | null;
  latitude: number | null;
  moveInDate: string | null;
  realCategory: string;
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: number | null;
  parkingCapacity: number;
  netArea: number;
  totalArea: number;
  details: string | null;
  createContract: boolean;
}

export interface PropertyUpdateData {
  customerUid: number | null;
  address: string | null;
  detailAddress: string;
  legalDistrictCode: string;
  deposit: number | null;
  monthlyRent: number | null;
  price: number | null;
  type: PropertyType;
  longitude: number | null;
  latitude: number | null;
  moveInDate: string | null;
  realCategory: string;
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: number | null;
  parkingCapacity: number;
  netArea: number;
  totalArea: number;
  details: string;
}

export interface AgentPropertySearchParams {
  page: number;
  size: number;
  sortFields: {
    [key: string]: string;
  };
  customerName?: string;
  address?: string;
  legalDistrictCode?: string;
  type?: PropertyType;
  category?: PropertyCategoryType;
  minDeposit?: number;
  maxDeposit?: number;
  minRent?: number;
  maxRent?: number;
  minPrice?: number;
  maxPrice?: number;
  minMoveInDate?: string;
  maxMoveInDate?: string;
  petsAllowed?: boolean;
  minFloor?: number;
  maxFloor?: number;
  hasElevator?: boolean;
  minConstructionYear?: number;
  maxConstructionYear?: number;
  minParkingCapacity?: number;
  maxParkingCapacity?: number;
  minNetArea?: number;
  maxNetArea?: number;
  minTotalArea?: number;
  maxTotalArea?: number;
}

export const fetchPropertyDetail = async (
  propertyUid: number
): Promise<AgentPropertyDetail> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<AgentPropertyDetail>
    >(`/properties/${propertyUid}`);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || "Failed to fetch property detail");
    }
  } catch (error) {
    console.error("Error fetching property detail:", error);
    throw error;
  }
};

export const fetchPropertyContract = async (
  propertyUid: number
): Promise<ContractInfo | null> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<ContractInfo>>(
      `/properties/${propertyUid}/contract`
    );

    if (response.success) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching property contract:", error);
    return null;
  }
};

export const fetchPropertyContractHistory = async (
  propertyUid: number
): Promise<ContractHistoryItem[]> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<ContractHistoryItem[]>
    >(`/properties/${propertyUid}/contract-history`);

    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.message || "Failed to fetch contract history");
    }
  } catch (error) {
    console.error("Error fetching contract history:", error);
    throw error;
  }
};

export const fetchPropertyCounselHistory = async (
  propertyUid: number
): Promise<CounselHistory[]> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<{ counsels: CounselHistory[] }>
    >(`/properties/${propertyUid}/counsels`);

    if (response.success) {
      return response.data?.counsels || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching counsel history:", error);
    return [];
  }
};

export const deleteProperty = async (propertyUid: number): Promise<void> => {
  try {
    const { data: response } = await apiClient.delete<ApiResponse>(
      `/properties/${propertyUid}`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete property");
    }
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

export const createProperty = async (
  propertyData: PropertyAddData
): Promise<void> => {
  try {
    const { data: response } = await apiClient.post<ApiResponse>(
      "/properties",
      propertyData
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to create property");
    }
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const updateProperty = async (
  propertyUid: number,
  propertyData: PropertyUpdateData
): Promise<void> => {
  try {
    const { data: response } = await apiClient.patch<ApiResponse>(
      `/properties/${propertyUid}`,
      propertyData
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to update property");
    }
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

export const getPublicProperties = async (
  searchParams: PublicPropertySearchParams
): Promise<
  CursorPaginatedResponse<"content", PublicPropertySearchResponse>
> => {
  try {
    const queryParams = new URLSearchParams();

    if (searchParams.cursorId !== undefined && searchParams.cursorId !== null) {
      queryParams.append("cursorId", searchParams.cursorId);
    }

    queryParams.append("size", searchParams.size.toString());

    if ("sortField" in searchParams && "isAscending" in searchParams) {
      queryParams.append("sortField", searchParams.sortField);
      queryParams.append("isAscending", searchParams.isAscending.toString());
    }

    if (searchParams.regionCode)
      queryParams.append("regionCode", searchParams.regionCode);
    if (searchParams.buildingName)
      queryParams.append("buildingName", searchParams.buildingName);
    if (searchParams.buildingType)
      queryParams.append("buildingType", searchParams.buildingType);
    if (searchParams.category)
      queryParams.append("category", searchParams.category);
    if (searchParams.address)
      queryParams.append("address", searchParams.address);

    if (searchParams.minPrice)
      queryParams.append("minPrice", searchParams.minPrice.toString());
    if (searchParams.maxPrice)
      queryParams.append("maxPrice", searchParams.maxPrice.toString());
    if (searchParams.minDeposit)
      queryParams.append("minDeposit", searchParams.minDeposit.toString());
    if (searchParams.maxDeposit)
      queryParams.append("maxDeposit", searchParams.maxDeposit.toString());
    if (searchParams.minMonthlyRent)
      queryParams.append(
        "minMonthlyRent",
        searchParams.minMonthlyRent.toString()
      );
    if (searchParams.maxMonthlyRent)
      queryParams.append(
        "maxMonthlyRent",
        searchParams.maxMonthlyRent.toString()
      );
    if (searchParams.minNetArea)
      queryParams.append("minNetArea", searchParams.minNetArea.toString());
    if (searchParams.maxNetArea)
      queryParams.append("maxNetArea", searchParams.maxNetArea.toString());
    if (searchParams.minTotalArea)
      queryParams.append("minTotalArea", searchParams.minTotalArea.toString());
    if (searchParams.maxTotalArea)
      queryParams.append("maxTotalArea", searchParams.maxTotalArea.toString());

    const response = await apiClient.get(
      `/public-properties?${queryParams.toString()}`
    );
    const data = response?.data?.data;

    if (!data) {
      throw new Error("서버 응답에 data 필드 없음");
    }

    const normalizedData = (data.content ?? []).map(
      (item: PublicPropertyItem) => ({
        ...item,
        totalArea: item.totalArea == null ? 0 : item.totalArea,
      })
    );

    return {
      ...data,
      content: normalizedData,
    };
  } catch (error) {
    console.error("Error searching public properties:", error);
    throw error;
  }
};

export const searchAgentProperties = async (
  searchParams: AgentPropertySearchParams
): Promise<ApiResponse<PaginatedResponse<"agentProperty", Property[]>>> => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("page", searchParams.page.toString());
    queryParams.append("size", searchParams.size.toString());

    // sortFields가 존재하고 비어있지 않을 때만 추가
    if (
      searchParams.sortFields &&
      Object.keys(searchParams.sortFields).length > 0
    ) {
      queryParams.append("sortFields", JSON.stringify(searchParams.sortFields));
    }

    if (searchParams.customerName)
      queryParams.append("customerName", searchParams.customerName);
    if (searchParams.address)
      queryParams.append("address", searchParams.address);
    if (searchParams.legalDistrictCode)
      queryParams.append("legalDistrictCode", searchParams.legalDistrictCode);
    if (searchParams.type) queryParams.append("type", searchParams.type);
    if (searchParams.category)
      queryParams.append("category", searchParams.category);

    if (searchParams.minPrice)
      queryParams.append("minPrice", searchParams.minPrice.toString());
    if (searchParams.maxPrice)
      queryParams.append("maxPrice", searchParams.maxPrice.toString());
    if (searchParams.minDeposit)
      queryParams.append("minDeposit", searchParams.minDeposit.toString());
    if (searchParams.maxDeposit)
      queryParams.append("maxDeposit", searchParams.maxDeposit.toString());
    if (searchParams.minRent)
      queryParams.append("minRent", searchParams.minRent.toString());
    if (searchParams.maxRent)
      queryParams.append("maxRent", searchParams.maxRent.toString());
    if (searchParams.minNetArea)
      queryParams.append("minNetArea", searchParams.minNetArea.toString());
    if (searchParams.maxNetArea)
      queryParams.append("maxNetArea", searchParams.maxNetArea.toString());
    if (searchParams.minTotalArea)
      queryParams.append("minTotalArea", searchParams.minTotalArea.toString());
    if (searchParams.maxTotalArea)
      queryParams.append("maxTotalArea", searchParams.maxTotalArea.toString());
    if (searchParams.minFloor)
      queryParams.append("minFloor", searchParams.minFloor.toString());
    if (searchParams.maxFloor)
      queryParams.append("maxFloor", searchParams.maxFloor.toString());
    if (searchParams.minConstructionYear)
      queryParams.append(
        "minConstructionYear",
        searchParams.minConstructionYear.toString()
      );
    if (searchParams.maxConstructionYear)
      queryParams.append(
        "maxConstructionYear",
        searchParams.maxConstructionYear.toString()
      );
    if (searchParams.minParkingCapacity)
      queryParams.append(
        "minParkingCapacity",
        searchParams.minParkingCapacity.toString()
      );
    if (searchParams.maxParkingCapacity)
      queryParams.append(
        "maxParkingCapacity",
        searchParams.maxParkingCapacity.toString()
      );
    if (searchParams.minMoveInDate)
      queryParams.append("minMoveInDate", searchParams.minMoveInDate);
    if (searchParams.maxMoveInDate)
      queryParams.append("maxMoveInDate", searchParams.maxMoveInDate);
    if (searchParams.petsAllowed !== undefined)
      queryParams.append("petsAllowed", searchParams.petsAllowed.toString());
    if (searchParams.hasElevator !== undefined)
      queryParams.append("hasElevator", searchParams.hasElevator.toString());

    const { data } = await apiClient.get(
      `/properties?${queryParams.toString()}`
    );

    return data;
  } catch (error) {
    console.error("Error searching agent properties:", error);
    throw error;
  }
};

export const uploadPropertiesBulk = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data: response } = await apiClient.post<ApiResponse>(
      "/properties/bulk",
      formData
    );

    if (!response.success) {
      throw new Error(response.message || "파일 업로드에 실패했습니다.");
    }
  } catch (error) {
    console.error("Error uploading properties bulk:", error);
    throw error;
  }
};
