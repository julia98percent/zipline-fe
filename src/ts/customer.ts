export interface CustomerData {
  name: string;
  phoneNo: string;
  [key: string]: string | number;
}

export interface Label {
  uid: number;
  name: string;
}

export interface Customer {
  uid: number;
  name: string;
  phoneNo: string;
  trafficSource: string;
  labels: { uid: number; name: string }[];
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  birthday: string;
  legalDistrictCode: string;
}

export interface CustomerListData {
  customers: Customer[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
