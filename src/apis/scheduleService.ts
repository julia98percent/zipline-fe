import apiClient from "@apis/apiClient";
import { ApiResponse } from "@ts/apiResponse";
import { Schedule } from "@ts/schedule";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";
import { SCHEDULE_ERROR_MESSAGES } from "@constants/clientErrorMessage";

export const fetchSchedulesByDateRange = async (params: {
  startDate: string;
  endDate: string;
}): Promise<Schedule[]> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<Schedule[]>>(
      `/schedules?startDate=${params.startDate}&endDate=${params.endDate}`
    );

    return handleApiResponse(response, SCHEDULE_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching schedules by date range");
  }
};

export const updateSchedule = async (
  scheduleUid: number,
  updatedSchedule: Partial<Schedule>
) => {
  try {
    const { data: response } = await apiClient.patch(
      `/schedules/${scheduleUid}`,
      updatedSchedule
    );

    return handleApiResponse<ApiResponse<string | null>>(
      response.data,
      SCHEDULE_ERROR_MESSAGES.UPDATE_FAILED
    );
  } catch (error) {
    return handleApiError(error, "failing to update schedule");
  }
};

export const fetchAllSchedules = async (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}): Promise<{
  schedules: Schedule[];
  totalElements: number;
  totalPages: number;
}> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<{
        schedules: Schedule[];
        totalElements: number;
        totalPages: number;
      }>
    >("/schedules", {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sortBy: params.sortBy ?? "startDate",
        sortDirection: params.sortDirection ?? "ASC",
      },
    });

    return handleApiResponse(response, SCHEDULE_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching all schedules");
  }
};

export interface ScheduleCreateData {
  startDateTime: string;
  endDateTime: string;
  title: string;
  description: string;
  customerUid: number | null;
}

export const createSchedule = async (
  scheduleData: ScheduleCreateData
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { data: response } = await apiClient.post<ApiResponse<void>>(
      "/schedules",
      scheduleData
    );

    if (response.success) {
      return { success: true, message: "일정을 등록했습니다." };
    }

    return {
      success: false,
      message: response.message || SCHEDULE_ERROR_MESSAGES.ADD_FAILED,
    };
  } catch (error) {
    console.error("Failed to create schedule:", error);
    return {
      success: false,
      message: SCHEDULE_ERROR_MESSAGES.ADD_FAILED,
    };
  }
};
