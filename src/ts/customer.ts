import { PaginatedResponse } from "./apiResponse";

export interface CustomerData {
  name: string;
  phoneNo: string;
  [key: string]: string | number;
}

export interface Label {
  uid: number;
  name: string;
}

export interface CustomerBase {
  name: string;
  phoneNo: string;
  trafficSource: string;
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  birthday: string | null;
  legalDistrictCode: string;
  minPrice: number | null;
  maxPrice: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
  minRent: number | null;
  maxRent: number | null;
  telProvider: string;
}

export interface Customer extends CustomerBase {
  uid: number;
  preferredRegion: string;
  labels: Label[];
}

export interface CustomerUpdateData extends CustomerBase {
  labelUids: number[];
}

export type CustomerListData = PaginatedResponse<"customers", Customer[]>;

export interface CustomerFilter {
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  minRent: number | null;
  maxRent: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
  labelUids: number[];
  telProvider: string;
  legalDistrictCode: string;
  trafficSource: string;
  noRole: boolean;
}

export interface CustomerFormData {
  name: string;
  phoneNo: string;
  birthday: string;
  telProvider: string;
  legalDistrictCode: string;
  trafficSource: string;
  seller: boolean;
  buyer: boolean;
  tenant: boolean;
  landlord: boolean;
  minPrice: string;
  maxPrice: string;
  minRent: string;
  maxRent: string;
  minDeposit: string;
  maxDeposit: string;
  labelUids: number[];
}

export interface FilterSectionProps {
  filtersTemp: CustomerFilter;
  setFiltersTemp: (
    filters: CustomerFilter | ((prev: CustomerFilter) => CustomerFilter)
  ) => void;
}

export interface CustomerRoleFilters {
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  noRole: boolean;
}
