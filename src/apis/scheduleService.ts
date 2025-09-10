import apiClient from "@/apis/apiClient";
import { ApiResponse } from "@/types/apiResponse";
import { Schedule } from "@/types/schedule";
import { handleApiResponse, handleApiError } from "@/utils/apiUtil";
import { SCHEDULE_ERROR_MESSAGES } from "@/constants/clientErrorMessage";
import dayjs, { Dayjs } from "dayjs";

export const fetchSchedulesByDateRange = async (params: {
  startDate: string;
  endDate: string;
}): Promise<Schedule[]> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<Schedule[]>>(
      `/schedules?startDate=${params.startDate}&endDate=${params.endDate}`
    );

    const schedules = handleApiResponse(
      response,
      SCHEDULE_ERROR_MESSAGES.FETCH_FAILED
    );

    return schedules.map((schedule: Schedule) => ({
      ...schedule,
      startDate: dayjs(schedule.startDate),
      endDate: dayjs(schedule.endDate),
    }));
  } catch (error) {
    return handleApiError(error, "fetching schedules by date range");
  }
};

export const updateSchedule = async (
  scheduleUid: number,
  updatedSchedule: Partial<Schedule>
): Promise<{ success: boolean; message?: string }> => {
  try {
    const { data: response } = await apiClient.patch<
      ApiResponse<string | null>
    >(`/schedules/${scheduleUid}`, updatedSchedule);

    if (response.success) {
      return { success: true };
    } else {
      return {
        success: false,
        message: response.message || SCHEDULE_ERROR_MESSAGES.UPDATE_FAILED,
      };
    }
  } catch (error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    console.error("Schedule update error:", error);
    return {
      success: false,
      message:
        apiError.response?.data?.message ||
        SCHEDULE_ERROR_MESSAGES.UPDATE_FAILED,
    };
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
  startDateTime: Dayjs | null;
  endDateTime: Dayjs | null;
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
