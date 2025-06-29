interface ContractDocument {
  fileName: string;
  fileUrl: string;
}

export interface Contract {
  uid: number;
  lessorOrSellerNames: string[];
  lesseeOrBuyerNames: string[];
  category: "SALE" | "DEPOSIT" | "MONTHLY" | null;
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

export interface ContractListItem {
  uid: number;
  category: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  contractStartDate: string | null;
  contractEndDate: string | null;
  expectedContractEndDate: string | null;
  contractDate: string | null;
  status: string;
  lessorOrSellerNames: string[];
  lesseeOrBuyerNames: string[];
  address: string;
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

export const ContractCategory: Record<string, string> = {
  SALE: "매매",
  DEPOSIT: "전세",
  MONTHLY: "월세",
} as const;
