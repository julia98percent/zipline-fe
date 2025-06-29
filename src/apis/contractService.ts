import apiClient from "@apis/apiClient";
import { ApiResponse } from "@ts/apiResponse";
import { CONTRACT_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import {
  ContractDetail,
  ContractHistory,
  ContractListItem,
  ContractListSearchParams,
  ContractListData,
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
): Promise<{ contracts: ContractListItem[]; totalElements: number }> => {
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
