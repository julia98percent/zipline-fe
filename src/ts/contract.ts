interface ContractDocument {
  fileName: string;
  fileUrl: string;
}

export interface ContractDetail {
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
  contracts: ContractListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
