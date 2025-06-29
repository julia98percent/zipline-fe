import apiClient from "@apis/apiClient";
import { ApiResponse } from "@ts/apiResponse";
import { Schedule } from "@ts/schedule";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";

const SCHEDULE_ERROR_MESSAGES = {
  FETCH_FAILED: "스케줄을 가져오는데 실패했습니다.",
  UPDATE_FAILED: "스케줄 업데이트에 실패했습니다.",
};

// 날짜 범위로 스케줄 조회
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

// 스케줄 업데이트
export const updateSchedule = async (
  scheduleUid: number,
  updatedSchedule: Partial<Schedule>
): Promise<void> => {
  try {
    const { data: response } = await apiClient.patch<ApiResponse<void>>(
      `/schedules/${scheduleUid}`,
      updatedSchedule
    );

    return handleApiResponse(response, SCHEDULE_ERROR_MESSAGES.UPDATE_FAILED);
  } catch (error) {
    return handleApiError(error, "updating schedule");
  }
};

// 모든 스케줄 조회 (페이지네이션)
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
