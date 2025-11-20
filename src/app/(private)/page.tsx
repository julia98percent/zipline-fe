import { Metadata } from "next";
import dayjs from "dayjs";
import { Counsel } from "@/types/counsel";
import { fetchDashboardStatistics } from "@/apis/statisticsService";
import { fetchSchedulesByDateRange } from "@/apis/scheduleService";
import { fetchSubmittedSurveyResponses } from "@/apis/preCounselService";
import { fetchDashboardCounsels } from "@/apis/counselService";
import {
  fetchExpiringContractsForDashboard,
  fetchRecentContractsForDashboard,
} from "@/apis/contractService";
import DashboardContainer from "./_components/DashboardContainer";

export const metadata: Metadata = {
  title: "대시보드",
  description: "부동산 중개 업무 현황 대시보드",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const today = new Date();
  const startDate = dayjs(today).startOf("week").toISOString();
  const endDate = dayjs(today).endOf("week").toISOString();

  const [
    statisticsData,
    schedules,
    surveyResponsesData,
    dueDateCounsels,
    latestCounsels,
    expiringContractsData,
    recentContractsData,
  ] = await Promise.all([
    fetchDashboardStatistics(),
    fetchSchedulesByDateRange({ startDate, endDate }),
    fetchSubmittedSurveyResponses(0, 10),
    fetchDashboardCounsels({ sortType: "DUE_DATE", page: 0, size: 5 }),
    fetchDashboardCounsels({ sortType: "LATEST", page: 0, size: 5 }),
    fetchExpiringContractsForDashboard(0, 5),
    fetchRecentContractsForDashboard(0, 5),
  ]);

  const surveyResponses = surveyResponsesData.surveyResponses.map(
    (response) => ({
      uid: response.surveyResponseUid,
      name: response.name,
      phoneNo: response.phoneNumber,
      phoneNumber: response.phoneNumber,
      createdAt: response.submittedAt,
      submittedAt: response.submittedAt,
      surveyResponseUid: response.surveyResponseUid,
    })
  );

  return (
    <DashboardContainer
      initialStatistics={{
        recentCustomers: statisticsData.recentCustomers,
        recentContractsCount: statisticsData.recentContractsCount,
        ongoingContracts: statisticsData.ongoingContracts,
        completedContracts: statisticsData.completedContracts,
      }}
      initialSchedules={schedules}
      initialSurveyResponses={surveyResponses}
      initialCounselListByDueDate={
        (dueDateCounsels as { counsels?: Counsel[] })?.counsels || []
      }
      initialCounselListByLatest={
        (latestCounsels as { counsels?: Counsel[] })?.counsels || []
      }
      initialExpiringContracts={expiringContractsData.contracts || []}
      initialRecentContracts={recentContractsData.contracts || []}
    />
  );
}
