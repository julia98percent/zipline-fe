import apiClient from "@apis/apiClient";
import { ApiResponse, API_ERROR_MESSAGES } from "@ts/apiResponse";
import { CUSTOMER_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import {
  Customer,
  CustomerData,
  CustomerListData,
  Label,
  CustomerUpdateData,
  CustomerBase,
} from "@ts/customer";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";
import { Contract } from "@ts/contract";
import { Counsel } from "@ts/counsel";
import { Property } from "@ts/property";

export const addCustomer = async (
  customerData: CustomerData
): Promise<{ success: boolean; message: string }> => {
  try {
    const { data: response } = await apiClient.post<ApiResponse>(
      "/customers",
      customerData
    );

    if (response.success) {
      return { success: true, message: CUSTOMER_ERROR_MESSAGES.ADD_FAILED };
    }
    return {
      success: false,
      message: response.message || CUSTOMER_ERROR_MESSAGES.ADD_FAILED,
    };
  } catch (e) {
    const error = e as API_ERROR_MESSAGES;
    return {
      success: false,
      message:
        error.response?.data?.message || CUSTOMER_ERROR_MESSAGES.ADD_FAILED,
    };
  }
};

export const fetchLabels = async (): Promise<Label[]> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<{ labels: Label[] }>
    >("/labels");

    const data = handleApiResponse(
      response,
      CUSTOMER_ERROR_MESSAGES.LABEL_FETCH_FAILED
    );
    return data.labels;
  } catch (error) {
    return handleApiError(error, "fetching labels");
  }
};

export const searchCustomers = async (
  searchParams: URLSearchParams
): Promise<{ customers: Customer[]; totalCount: number }> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<CustomerListData>
    >(`/customers?${searchParams.toString()}`);

    const data = handleApiResponse(
      response,
      CUSTOMER_ERROR_MESSAGES.SEARCH_FAILED
    );
    return {
      customers: data.customers,
      totalCount: data.totalElements,
    };
  } catch (error) {
    return handleApiError(error, "searching customers");
  }
};

export const fetchCustomerDetail = async (
  customerId: string
): Promise<Customer> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<Customer>>(
      `/customers/${customerId}`
    );

    return handleApiResponse(response, CUSTOMER_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching customer detail");
  }
};

export const updateCustomer = async (
  customerId: string,
  customerData: CustomerBase
): Promise<void> => {
  try {
    const { data: response } = await apiClient.put<
      ApiResponse<CustomerUpdateData>
    >(`/customers/${customerId}`, customerData);

    handleApiResponse(response, CUSTOMER_ERROR_MESSAGES.UPDATE_FAILED);
  } catch (error) {
    return handleApiError(error, "updating customer");
  }
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  try {
    const { data: response } = await apiClient.delete<ApiResponse>(
      `/customers/${customerId}`
    );

    handleApiResponse(response, CUSTOMER_ERROR_MESSAGES.DELETE_FAILED);
  } catch (error) {
    return handleApiError(error, "deleting customer");
  }
};

// Customer consultation, property, contract related functions
export interface ConsultationResponse {
  counsels: Counsel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface PropertyResponse {
  agentProperty: Property[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ContractResponse {
  contracts: Contract[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export const fetchCustomerConsultations = async (
  customerId: string,
  page: number,
  size: number
): Promise<ConsultationResponse> => {
  try {
    const { data: response } = await apiClient.get<{
      data: ConsultationResponse;
    }>(`/customers/${customerId}/counsels`, {
      params: {
        page: page + 1,
        size,
      },
    });

    if (response.data) {
      return response.data;
    }
    throw new Error("No data received");
  } catch (error) {
    return handleApiError(error, "fetching customer consultations");
  }
};

export const fetchCustomerProperties = async (
  customerId: string,
  page: number,
  size: number
): Promise<PropertyResponse> => {
  try {
    const { data: response } = await apiClient.get<{ data: PropertyResponse }>(
      `/customers/${customerId}/properties`,
      {
        params: {
          page: page + 1,
          size,
        },
      }
    );

    if (response.data) {
      return response.data;
    }
    throw new Error("No data received");
  } catch (error) {
    return handleApiError(error, "fetching customer properties");
  }
};

export const fetchCustomerContracts = async (
  customerId: string,
  page: number,
  size: number
): Promise<ContractResponse> => {
  try {
    const { data: response } = await apiClient.get<{ data: ContractResponse }>(
      `/customers/${customerId}/contracts`,
      {
        params: {
          page: page + 1,
          size,
        },
      }
    );

    if (response.data) {
      return response.data;
    }
    throw new Error("No data received");
  } catch (error) {
    return handleApiError(error, "fetching customer contracts");
  }
};
