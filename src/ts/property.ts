import { PaginatedResponse, CursorPaginatedResponse } from "./apiResponse";
export const PropertyCategory = {
  ONE_ROOM: "원룸",
  TWO_ROOM: "투룸",
  APARTMENT: "아파트",
  VILLA: "빌라",
  HOUSE: "주택",
  OFFICETEL: "오피스텔",
  COMMERCIAL: "상가",
} as const;

export type PropertyCategoryType =
  | "ONE_ROOM"
  | "TWO_ROOM"
  | "APARTMENT"
  | "VILLA"
  | "HOUSE"
  | "OFFICETEL"
  | "COMMERCIAL";

export type PropertyType = "SALE" | "DEPOSIT" | "MONTHLY";

export interface PropertyBase {
  address: string;
  type: PropertyType;
  price: number | null;
  deposit: number | null;
  monthlyRent: number | null;
  netArea: number;
  totalArea: number;
  floor: number;
  constructionYear: string;
  hasElevator: boolean;
  parkingCapacity: number;
  petsAllowed: boolean;
  details?: string;
}

export interface Property extends PropertyBase {
  customer: string;
  detailAddress: string;
  legalDistrictCode: string;
  moveInDate: string;
  realCategory: PropertyCategoryType;
  uid: string;
  longitude: number;
  latitude: number;
}

export interface AgentPropertyFilterParams {
  legalDistrictCode?: string;
  type?: PropertyType;
  category?: PropertyCategoryType;
  minDeposit?: number;
  maxDeposit?: number;
  minMonthlyRent?: number;
  maxMonthlyRent?: number;
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

export interface PublicPropertyItem {
  id: number;
  articleId: string;
  regionCode: string;
  category: string;
  buildingName: string;
  description: string;
  buildingType: string;
  price: number;
  deposit: number;
  monthlyRent: number;
  longitude: number;
  latitude: number;
  totalArea: number;
  netArea: number;
  platform: string;
  platformUrl: string;
  createdAt: string;
  updatedAt: string;
  address: string;
}

export interface PublicPropertySearchParams {
  page: number;
  size: number;
  sortFields: {
    [key: string]: string;
  };
  regionCode?: string;
  buildingName?: string;
  buildingType?: string;
  category?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  minDeposit?: number;
  maxDeposit?: number;
  minMonthlyRent?: number;
  maxMonthlyRent?: number;
  minNetArea?: number;
  maxNetArea?: number;
  minTotalArea?: number;
  maxTotalArea?: number;
}

export type PublicPropertySearchParams =
  | BasePublicPropertySearchParams
  | (BasePublicPropertySearchParams & SortingOption);

export type PublicPropertySearchResponse = CursorPaginatedResponse<
  "content",
  PublicPropertyItem[]
>;

export type PropertyResponse = PaginatedResponse<"agentProperty", Property[]>;
