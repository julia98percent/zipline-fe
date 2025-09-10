import apiClient from "@/apis/apiClient";
import { ApiResponse } from "@/types/apiResponse";
import { handleApiResponse, handleApiError } from "@/utils/apiUtil";

const STATISTICS_ERROR_MESSAGES = {
  FETCH_FAILED: "통계 데이터를 가져오는데 실패했습니다.",
};

export interface StatisticsData {
  recentCustomers: number;
  recentContractsCount: number;
  ongoingContracts: number;
  completedContracts: number;
}

export const fetchRecentCustomersCount = async (): Promise<number> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<number>>(
      "/statics/recent-customers"
    );

    return handleApiResponse(response, STATISTICS_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching recent customers count");
  }
};

export const fetchRecentContractsCount = async (): Promise<number> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<number>>(
      "/statics/recent-contracts"
    );

    return handleApiResponse(response, STATISTICS_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching recent contracts count");
  }
};

export const fetchOngoingContractsCount = async (): Promise<number> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<number>>(
      "/statics/ongoing-contracts"
    );

    return handleApiResponse(response, STATISTICS_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching ongoing contracts count");
  }
};

export const fetchCompletedContractsCount = async (): Promise<number> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<number>>(
      "/statics/completed-contracts"
    );

    return handleApiResponse(response, STATISTICS_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching completed contracts count");
  }
};

export const fetchDashboardStatistics = async (): Promise<StatisticsData> => {
  try {
    const [
      recentCustomers,
      recentContractsCount,
      ongoingContracts,
      completedContracts,
    ] = await Promise.all([
      fetchRecentCustomersCount(),
      fetchRecentContractsCount(),
      fetchOngoingContractsCount(),
      fetchCompletedContractsCount(),
    ]);

    return {
      recentCustomers,
      recentContractsCount,
      ongoingContracts,
      completedContracts,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard statistics:", error);
    throw error;
  }
};
