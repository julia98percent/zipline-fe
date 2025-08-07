import apiClient from "@apis/apiClient";
import { COUNSEL_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { ApiResponse } from "@ts/apiResponse";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";
import {
  Counsel,
  PreCounselListData,
  ConsultationResponse,
  CounselUpdateRequest,
} from "@ts/counsel";
import { Dayjs } from "dayjs";

type CounselListResponse = ApiResponse<ConsultationResponse>;
interface CounselListParams {
  page: number;
  size: number;
  search?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  type?: string;
  completed?: boolean;
}

interface CreateCounselRequest {
  title: string;
  counselDate: Dayjs | null;
  type: string;
  dueDate?: Dayjs | null;
  propertyUid?: string;
  content: string;
}

export const fetchCounselList = async (params: CounselListParams) => {
  try {
    const { data: response } = await apiClient.get<CounselListResponse>(
      "/counsels",
      {
        params: {
          page: params.page,
          size: params.size,
          search: params.search,
          startDate: params.startDate
            ? params.startDate.format("YYYY-MM-DD")
            : null,
          endDate: params.endDate ? params.endDate.format("YYYY-MM-DD") : null,
          type: params.type || undefined,
          completed: params.completed,
        },
      }
    );

    if (response.success && response.data) {
      return {
        counsels: response.data.counsels,
        totalElements: response.data.totalElements,
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Failed to fetch counsels:", error);
    throw error;
  }
};

export const fetchCounsels = async (page: number, rowsPerPage: number) => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<PreCounselListData>
    >("/surveys/responses", {
      params: { page, size: rowsPerPage },
    });

    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching counsels");
  }
};

export const fetchDashboardCounsels = async (params: {
  sortType: "DUE_DATE" | "LATEST";
  page?: number;
  size?: number;
}) => {
  try {
    const { data: response } = await apiClient.get<ApiResponse>(
      `/dashboard/counsels?sortType=${params.sortType}&page=${
        params.page ?? 0
      }&size=${params.size ?? 5}`
    );

    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(
      error,
      `fetching counsels with sortType ${params.sortType}`
    );
  }
};

export const fetchCounsel = async (counselUid: string) => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<Counsel>>(
      `/counsels/${counselUid}`
    );

    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, `fetching counsel detail ${counselUid}`);
  }
};

export const updateCounsel = async (
  counselUid: string,
  updateData: CounselUpdateRequest
) => {
  try {
    const { data: response } = await apiClient.put<ApiResponse>(
      `/counsels/${counselUid}`,
      updateData
    );

    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.UPDATE_FAILED);
  } catch (error) {
    return handleApiError(error, `updating counsel ${counselUid}`);
  }
};

export const deleteCounsel = async (counselUid: string) => {
  try {
    const { data: response } = await apiClient.delete<ApiResponse>(
      `/counsels/${counselUid}`
    );

    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.DELETE_FAILED);
  } catch (error) {
    return handleApiError(error, `deleting counsel ${counselUid}`);
  }
};

export const fetchCustomersForCounsel = async () => {
  try {
    const { data: response } = await apiClient.get("/customers", {
      params: {
        page: 0,
        size: 100,
      },
    });

    if (response.success) {
      return response.data?.customers || [];
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    throw error;
  }
};

export const fetchPropertiesForCounsel = async () => {
  try {
    const { data: response } = await apiClient.get("/properties", {
      params: {
        page: 0,
        size: 100,
      },
    });

    if (response.success) {
      return response.data?.agentProperty || [];
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    throw error;
  }
};

export const createCounsel = async (
  customerId: string,
  counselData: CreateCounselRequest
) => {
  try {
    const { data: response } = await apiClient.post(
      `/customers/${customerId}/counsels`,
      counselData
    );

    if (response.success) {
      return response;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Failed to create counsel:", error);
    throw error;
  }
};
