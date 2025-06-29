import apiClient from "@apis/apiClient";
import { ApiResponse, API_ERROR_MESSAGES } from "@ts/apiResponse";
import { CUSTOMER_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { Customer, CustomerData, CustomerListData, Label } from "@ts/customer";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";

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
