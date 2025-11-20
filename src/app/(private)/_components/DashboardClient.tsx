"use client";

import dynamic from "next/dynamic";
import { useDashboard } from "./useDashboard";
import StatisticsCards from "./StatisticsCards";
import WeeklyScheduleCalendar from "./WeeklyScheduleCalendar";
import CounselList from "./CounselList";
import ContractList from "./ContractList";
import SurveyList from "./SurveyList";

const DashboardModals = dynamic(() => import("./DashboardModals"), {
  ssr: false,
});

const DashboardClient = () => {
  const dashboardData = useDashboard();

  return (
    <>
      <StatisticsCards
        recentCustomers={dashboardData.recentCustomers}
        recentContractsCount={dashboardData.recentContractsCount}
        ongoingContracts={dashboardData.ongoingContracts}
        completedContracts={dashboardData.completedContracts}
        isLoading={dashboardData.isLoading}
        onRecentCustomersClick={() =>
          dashboardData.setIsRecentCustomersModalOpen(true)
        }
        onRecentContractsClick={dashboardData.handleRecentContractsClick}
        onOngoingContractsClick={() =>
          dashboardData.setOngoingContractsOpen(true)
        }
        onCompletedContractsClick={() =>
          dashboardData.setCompletedContractsOpen(true)
        }
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 lg:flex-[2] flex flex-col min-h-96 xl:w-full">
            <WeeklyScheduleCalendar
              schedules={dashboardData.schedules}
              handlePrevWeek={dashboardData.handlePrevWeek}
              handleNextWeek={dashboardData.handleNextWeek}
              currentWeekRange={dashboardData.currentWeekRange}
              getWeekDates={dashboardData.getWeekDates}
              getDayName={dashboardData.getDayName}
              getScheduleColor={dashboardData.getScheduleColor}
              handleScheduleClick={dashboardData.handleScheduleClick}
              handleMoreClick={dashboardData.handleMoreClick}
              onViewAllSchedules={dashboardData.handleViewAllSchedules}
            />
          </div>

          <SurveyList
            surveyResponses={dashboardData.surveyResponses}
            handleSurveyClick={dashboardData.handleSurveyClick}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-h-96">
            <CounselList
              counselTab={dashboardData.counselTab}
              currentCounselList={dashboardData.currentCounselList}
              counselLoading={dashboardData.counselLoading}
              handleCounselTabChange={dashboardData.handleCounselTabChange}
              handleCounselClick={dashboardData.handleCounselClick}
            />
          </div>

          <div className="flex-1 min-h-96">
            <ContractList
              contractTab={dashboardData.contractTab}
              currentContractList={dashboardData.currentContractList}
              contractLoading={dashboardData.contractLoading}
              handleContractTabChange={dashboardData.handleContractTabChange}
            />
          </div>
        </div>
      </div>

      <DashboardModals
        selectedSchedule={dashboardData.selectedSchedule}
        isDetailModalOpen={dashboardData.isDetailModalOpen}
        handleCloseDetailModal={dashboardData.handleCloseDetailModal}
        handleSaveSchedule={dashboardData.handleSaveSchedule}
        handleScheduleClick={dashboardData.handleScheduleClick}
        selectedSurveyId={dashboardData.selectedSurveyId}
        isSurveyDetailModalOpen={dashboardData.isSurveyDetailModalOpen}
        handleCloseSurveyDetailModal={
          dashboardData.handleCloseSurveyDetailModal
        }
        handleSurveyClick={dashboardData.handleSurveyClick}
        moreModalOpen={dashboardData.moreModalOpen}
        setMoreModalOpen={dashboardData.setMoreModalOpen}
        selectedDaySchedules={dashboardData.selectedDaySchedules}
        selectedDayStr={dashboardData.selectedDayStr}
        isRecentCustomersModalOpen={dashboardData.isRecentCustomersModalOpen}
        setIsRecentCustomersModalOpen={
          dashboardData.setIsRecentCustomersModalOpen
        }
        recentContractsModalOpen={dashboardData.recentContractsModalOpen}
        setRecentContractsModalOpen={dashboardData.setRecentContractsModalOpen}
        ongoingContractsOpen={dashboardData.ongoingContractsOpen}
        setOngoingContractsOpen={dashboardData.setOngoingContractsOpen}
        completedContractsOpen={dashboardData.completedContractsOpen}
        setCompletedContractsOpen={dashboardData.setCompletedContractsOpen}
      />
    </>
  );
};

export default DashboardClient;
