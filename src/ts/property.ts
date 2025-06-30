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
  customerName: string;
  detailAddress: string;
  legalDistrictCode: string;
  moveInDate: string;
  realCategory: PropertyCategoryType;
  uid: string;
}
