import { Contract } from "@ts/contract";
import { Counsel } from "@ts/counsel";

// Import specific services
import { fetchDashboardStatistics as fetchStats } from "./statisticsService";
import {
  fetchSchedulesByDateRange as fetchSchedules,
  updateSchedule as updateScheduleAPI,
} from "./scheduleService";
import { fetchSurveyResponses as fetchSurveys } from "./preCounselService";
import { fetchDashboardCounsels } from "./counselService";
import {
  fetchRecentContractsForDashboard,
  fetchOngoingContractsForDashboard,
  fetchCompletedContractsForDashboard,
  fetchExpiringContractsForDashboard,
} from "./contractService";

export type { StatisticsData } from "./statisticsService";

export interface ContractListParams {
  page?: number;
  size?: number;
  recent?: boolean;
  progress?: boolean;
  sortFields?: string;
  period?: string;
}

export interface ScheduleParams {
  startDate: string;
  endDate: string;
}

export interface SurveyParams {
  page?: number;
  size?: number;
}

export interface CounselParams {
  sortType: "DUE_DATE" | "LATEST";
  page?: number;
  size?: number;
}

export const fetchDashboardStatistics = fetchStats;

export const fetchSchedulesByDateRange = fetchSchedules;

export const fetchSurveyResponses = fetchSurveys;

export const fetchCounselsByType = async (
  params: CounselParams
): Promise<Counsel[]> => {
  try {
    const result = (await fetchDashboardCounsels(params)) as {
      counsels?: Counsel[];
    };
    return result?.counsels || [];
  } catch (error) {
    console.error("Failed to fetch counsels:", error);
    return [];
  }
};

// 계약 리스트 조회 함수들 - contractService 사용
export const fetchRecentContracts = async (
  page: number = 0,
  size: number = 10
) => {
  return fetchRecentContractsForDashboard(page, size);
};

export const fetchOngoingContracts = async (
  page: number = 0,
  size: number = 10
) => {
  return fetchOngoingContractsForDashboard(page, size);
};

export const fetchCompletedContracts = async (
  page: number = 0,
  size: number = 10
) => {
  return fetchCompletedContractsForDashboard(page, size);
};

export const fetchExpiringContracts = async (
  page: number = 0,
  size: number = 5
): Promise<Contract[]> => {
  try {
    const result = await fetchExpiringContractsForDashboard(page, size);
    return result.contracts || [];
  } catch (error) {
    console.error("Failed to fetch expiring contracts:", error);
    return [];
  }
};

// 스케줄 업데이트 - scheduleService 사용
export const updateSchedule = updateScheduleAPI;
