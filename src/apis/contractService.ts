import apiClient from "@apis/apiClient";
import { ApiResponse } from "@ts/apiResponse";
import { CONTRACT_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import {
  ContractDetail,
  ContractHistory,
  ContractListSearchParams,
  ContractListData,
  Contract,
} from "@ts/contract";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";

export const fetchContractDetail = async (
  contractUid: string
): Promise<ContractDetail> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<ContractDetail>>(
      `/contracts/${contractUid}`
    );

    return handleApiResponse(
      response,
      CONTRACT_ERROR_MESSAGES.DETAIL_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching contract detail");
  }
};

export const fetchContractHistory = async (
  contractUid: string
): Promise<ContractHistory[]> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<ContractHistory[]>
    >(`/contracts/${contractUid}/histories`);

    return handleApiResponse(
      response,
      CONTRACT_ERROR_MESSAGES.HISTORY_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching contract history");
  }
};

export const deleteContract = async (contractUid: string): Promise<void> => {
  try {
    await apiClient.delete(`/contracts/${contractUid}`);
  } catch (error) {
    return handleApiError(error, "deleting contract");
  }
};

export const searchContracts = async (
  searchParams: ContractListSearchParams
): Promise<{ contracts: Contract[]; totalElements: number }> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<ContractListData>
    >("/contracts", {
      params: {
        category: searchParams.category,
        customerName: searchParams.customerName,
        address: searchParams.address,
        period: searchParams.period || "",
        status: searchParams.status,
        sort: searchParams.sort,
        page: searchParams.page,
        size: searchParams.size,
      },
    });

    const data = handleApiResponse(
      response,
      CONTRACT_ERROR_MESSAGES.LIST_FETCH_FAILED
    );
    return {
      contracts: data.contracts || [],
      totalElements: data.totalElements || 0,
    };
  } catch (error) {
    return handleApiError(error, "searching contracts");
  }
};

export const fetchDashboardContracts = async (params: {
  recent?: boolean;
  progress?: boolean;
  page?: number;
  size?: number;
  sortFields?: string;
  period?: string;
}) => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<ContractListData>
    >("/contracts", { params });

    return handleApiResponse(
      response,
      CONTRACT_ERROR_MESSAGES.LIST_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching dashboard contracts");
  }
};

export const fetchRecentContractsForDashboard = async (
  page: number = 0,
  size: number = 10
) => {
  return fetchDashboardContracts({
    recent: true,
    page: page + 1,
    size,
  });
};

export const fetchOngoingContractsForDashboard = async (
  page: number = 0,
  size: number = 10
) => {
  return fetchDashboardContracts({
    progress: true,
    page: page + 1,
    size,
  });
};

export const fetchCompletedContractsForDashboard = async (
  page: number = 0,
  size: number = 10
) => {
  return fetchDashboardContracts({
    progress: false,
    page: page + 1,
    size,
  });
};

export const fetchExpiringContractsForDashboard = async (
  page: number = 0,
  size: number = 5
) => {
  return fetchDashboardContracts({
    page,
    size,
    sortFields: JSON.stringify({ contractEndDate: "DESC" }),
    period: "6개월 이내",
  });
};

export interface ContractRequest {
  category: string | null;
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  expectedContractEndDate: string | null;
  deposit: number;
  monthlyRent: number;
  price: number;
  lessorOrSellerUids: number[];
  lesseeOrBuyerUids: number[];
  propertyUid: number | null;
  status: string;
}

export interface AgentPropertyResponse {
  uid: number;
  address: string;
}

export interface CustomerResponse {
  uid: number;
  name: string;
}

export const updateContract = async (
  contractUid: number,
  formData: FormData
): Promise<void> => {
  try {
    await apiClient.patch(`/contracts/${contractUid}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    return handleApiError(error, "updating contract");
  }
};

export const fetchProperties = async (): Promise<AgentPropertyResponse[]> => {
  try {
    const { data: response } = await apiClient.get("/properties");
    return response.data.agentProperty.map((p: AgentPropertyResponse) => ({
      uid: p.uid,
      address: p.address,
    }));
  } catch (error) {
    return handleApiError(error, "fetching properties");
  }
};

export const fetchCustomers = async (): Promise<CustomerResponse[]> => {
  try {
    const { data: response } = await apiClient.get("/customers");
    return response.data.customers.map((c: CustomerResponse) => ({
      uid: Number(c.uid),
      name: c.name,
    }));
  } catch (error) {
    return handleApiError(error, "fetching customers");
  }
};

export const createContract = async (formData: FormData): Promise<void> => {
  try {
    await apiClient.post("/contracts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    return handleApiError(error, "creating contract");
  }
};
