import apiClient from "@apis/apiClient";
import { ApiResponse } from "@ts/apiResponse";
import { ContractCategoryType } from "@ts/contract";
import {
  PublicPropertyItem,
  PublicPropertySearchParams,
  PublicPropertySearchResponse,
} from "@ts/property";

export interface AgentPropertyDetail {
  customer: string;
  address: string;
  detailAddress: string;
  legalDistrictCode: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
  moveInDate: string;
  realCategory:
    | "ONE_ROOM"
    | "TWO_ROOM"
    | "APARTMENT"
    | "VILLA"
    | "HOUSE"
    | "OFFICETEL"
    | "COMMERCIAL";
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
  type: "SALE" | "DEPOSIT" | "MONTHLY";
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
  type: "SALE" | "DEPOSIT" | "MONTHLY";
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

export const fetchPropertyDetail = async (
  propertyUid: string
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
  propertyUid: string
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
  propertyUid: string
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
  propertyUid: string
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

export const deleteProperty = async (propertyUid: string): Promise<void> => {
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

export const searchPublicProperties = async (
  searchParams: PublicPropertySearchParams
): Promise<PublicPropertySearchResponse> => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("page", searchParams.page.toString());
    queryParams.append("size", searchParams.size.toString());
    queryParams.append("sortFields", JSON.stringify(searchParams.sortFields));

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
    if (searchParams.minExclusiveArea)
      queryParams.append(
        "minExclusiveArea",
        searchParams.minExclusiveArea.toString()
      );
    if (searchParams.maxExclusiveArea)
      queryParams.append(
        "maxExclusiveArea",
        searchParams.maxExclusiveArea.toString()
      );
    if (searchParams.minSupplyArea)
      queryParams.append(
        "minSupplyArea",
        searchParams.minSupplyArea.toString()
      );
    if (searchParams.maxSupplyArea)
      queryParams.append(
        "maxSupplyArea",
        searchParams.maxSupplyArea.toString()
      );

    const { data } = await apiClient.get(
      `/property-articles/search?${queryParams.toString()}`
    );

    const normalizedData = data.content.map((item: PublicPropertyItem) => ({
      ...item,
      supplyArea: item.supplyArea == null ? 0 : item.supplyArea,
    }));

    return {
      ...data,
      content: normalizedData,
    };
  } catch (error) {
    console.error("Error searching public properties:", error);
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
