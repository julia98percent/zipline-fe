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
