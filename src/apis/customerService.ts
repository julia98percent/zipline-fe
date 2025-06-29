import { AxiosError } from "axios";
import { showToast } from "@components/Toast/Toast";
import apiClient from "@apis/apiClient";

interface CustomerData {
  name: string;
  phoneNo: string;
  [key: string]: string | number;
}

export interface Label {
  uid: number;
  name: string;
}

export interface LabelResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    labels: Label[];
  };
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

export interface CustomerListResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    customers: Customer[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export const addCustomer = async (customerData: CustomerData) => {
  try {
    const response = await apiClient.post("/customers", customerData);

    if (response.data.success) {
      showToast({
        message: "고객을 등록했습니다.",
        type: "success",
      });
      return true;
    }
    return false;
  } catch (e) {
    const error = e as AxiosError<{ message?: string }>;
    showToast({
      message:
        error.response?.data?.message || "고객 등록 중 오류가 발생했습니다.",
      type: "error",
    });
    return false;
  }
};

export const fetchLabels = async (): Promise<Label[]> => {
  try {
    const { data: response } = await apiClient.get<LabelResponse>("/labels");

    if (response.success && response.code === 200) {
      return response.data.labels;
    } else {
      console.error("Failed to fetch labels:", response.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching labels:", error);
    return [];
  }
};

export const searchCustomers = async (
  searchParams: URLSearchParams
): Promise<{ customers: Customer[]; totalCount: number }> => {
  try {
    const { data: response } = await apiClient.get<CustomerListResponse>(
      `/customers?${searchParams.toString()}`
    );

    if (response.success) {
      return {
        customers: response.data.customers,
        totalCount: response.data.totalElements,
      };
    } else {
      console.error("Failed to search customers:", response.message);
      return { customers: [], totalCount: 0 };
    }
  } catch (error) {
    console.error("Error searching customers:", error);
    return { customers: [], totalCount: 0 };
  }
};
