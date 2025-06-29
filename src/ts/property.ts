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

export interface Property {
  address: string;
  type: string;
  price: number | null;
  deposit: number | null;
  monthlyRent: number | null;
  exclusiveArea: number;
  supplyArea: number;
  floor: number;
  constructionYear: string;
  hasElevator: boolean;
  parkingCapacity: number;
  hasPet: boolean;
  description?: string;
}
