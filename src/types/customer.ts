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
  preferredRegion: string;
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
  preferredRegionKR?: string | null;
  labels: Label[];
}

export interface CustomerUpdateData extends CustomerBase {
  labelUids: number[];
}

export type CustomerListData = PaginatedResponse<"customers", Customer[]>;

export interface PriceFilter {
  minPrice: number | null;
  maxPrice: number | null;
  minRent: number | null;
  maxRent: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
}
export interface CustomerBaseFilter {
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  labelUids: number[];
  telProvider: string;
  preferredRegion: string;
  trafficSource: string;
  noRole: boolean;
}

export type CustomerFilter = PriceFilter & CustomerBaseFilter;

export interface CustomerBaseFormData {
  name: string;
  phoneNo: string;
  birthday: string;
  telProvider: string;
  preferredRegion: string;
  trafficSource: string;
  seller: boolean;
  buyer: boolean;
  tenant: boolean;
  landlord: boolean;
  labelUids: number[];
}

export type CustomerFormData = PriceFilter & CustomerBaseFormData;

export interface FilterSectionProps {
  filtersTemp: CustomerBaseFilter;
  setFiltersTemp: (
    filters:
      | CustomerBaseFilter
      | ((prev: CustomerBaseFilter) => CustomerBaseFilter)
  ) => void;
}

export interface CustomerRoleFilters {
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  noRole: boolean;
}
