export interface ContractDocument {
  fileName: string;
  fileUrl: string;
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
  deposit: number;
  monthlyRent: number;
  price: number;
  expectedContractEndDate: string | null;
  documents: ContractDocument[];
  propertyAddress: string;
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

export interface ContractListData {
  contracts: Contract[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

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
