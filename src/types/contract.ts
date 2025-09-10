import { PaginatedResponse } from "./apiResponse";
import { CONTRACT_STATUS_OPTION_LIST } from "@/constants/contract";

export interface ContractDocument {
  fileName: string;
  fileUrl: string;
}

export interface ContractPartyInfo {
  name: string;
  uid: number;
  phoneNo: string;
}

export interface Contract {
  uid: number;
  lessorOrSellerNames: string[];
  lesseeOrBuyerNames: string[];
  category: ContractCategoryType | null;
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status: string;
  address: string;
}

export interface ContractDetail extends Contract {
  deposit: number | null;
  monthlyRent: number | null;
  price: number | null;
  expectedContractEndDate: string | null;
  documents: ContractDocument[];
  propertyAddress: string;
  lessorOrSellerInfo: ContractPartyInfo[];
  lesseeOrBuyerInfo: ContractPartyInfo[];
  propertyUid: number;
  other: string | null;
}

export interface ContractHistory {
  prevStatus: string;
  currentStatus: string;
  changedAt: string;
}

export interface ContractListSearchParams {
  category?: string;
  customerName?: string;
  address?: string;
  period?: string;
  status?: string;
  sort?: string;
  page: number;
  size: number;
}

export type ContractListData = PaginatedResponse<"contracts", Contract[]>;

export const ContractCategory = {
  SALE: "매매",
  DEPOSIT: "전세",
  MONTHLY: "월세",
} as const;

export type ContractCategoryType = keyof typeof ContractCategory;

export const ContractCategoryKeys = {
  SALE: "SALE" as const,
  DEPOSIT: "DEPOSIT" as const,
  MONTHLY: "MONTHLY" as const,
} satisfies Record<ContractCategoryType, ContractCategoryType>;

export const ContractCategoryColors: Record<ContractCategoryType, string> = {
  SALE: "#388e3c",
  DEPOSIT: "#1976d2",
  MONTHLY: "#f57c00",
};

export type ContractResponse = PaginatedResponse<"contracts", Contract[]>;

export interface FormErrors {
  category?: string;
  status?: string;
  propertyUid?: string;
  contractDate?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  expectedContractEndDate?: string;
  deposit?: string;
  monthlyRent?: string;
  price?: string;
  lessorUids?: string;
  lesseeUids?: string;
}

export type ContractStatus =
  (typeof CONTRACT_STATUS_OPTION_LIST)[number]["value"];
