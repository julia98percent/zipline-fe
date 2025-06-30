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

export interface CustomerListData {
  customers: Customer[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
