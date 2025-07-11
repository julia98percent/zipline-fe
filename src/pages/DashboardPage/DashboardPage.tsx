import PageHeader from "@components/PageHeader/PageHeader";
import { useOutletContext } from "react-router-dom";
import { useDashboard } from "./useDashboard";
import StatisticsCards from "./components/StatisticsCards";
import WeeklyScheduleCalendar from "./components/WeeklyScheduleCalendar";
import {
  CounselList,
  ContractList,
  SurveyList,
  DashboardModals,
} from "./components";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

const DashboardPage = () => {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const dashboardData = useDashboard();

  return (
    <div className="flex-1 h-screen overflow-auto bg-gray-100 p-0">
      <PageHeader title="대시보드" onMobileMenuToggle={onMobileMenuToggle} />

      <div className="p-6 pt-0">
        {/* 통계 카드 영역 */}
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

        {/* 메인 컨텐츠 영역 */}
        <div className="flex flex-col gap-6 h-[calc(100vh-300px)]">
          {/* 상단 영역 - 주간 일정과 설문 목록 */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            {/* 왼쪽 - 주간 일정 캘린더 */}
            <div className="flex-1 lg:flex-[2] flex flex-col">
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

            {/* 오른쪽 - 신규 설문 목록 */}
            <div className="flex-1 lg:flex-1 flex flex-col min-h-[400px]">
              <SurveyList
                surveyResponses={dashboardData.surveyResponses}
                handleSurveyClick={dashboardData.handleSurveyClick}
              />
            </div>
          </div>

          {/* 하단 영역 - 상담 목록과 계약 목록을 한 줄로 */}
          <div className="flex flex-col md:flex-row gap-6 min-h-[400px]">
            {/* 상담 목록 */}
            <div className="flex-1 min-h-[400px]">
              <CounselList
                counselTab={dashboardData.counselTab}
                currentCounselList={dashboardData.currentCounselList}
                counselLoading={dashboardData.counselLoading}
                handleCounselTabChange={dashboardData.handleCounselTabChange}
                handleCounselClick={dashboardData.handleCounselClick}
              />
            </div>

            {/* 계약 목록 */}
            <div className="flex-1 min-h-[400px]">
              <ContractList
                contractTab={dashboardData.contractTab}
                currentContractList={dashboardData.currentContractList}
                contractLoading={dashboardData.contractLoading}
                handleContractTabChange={dashboardData.handleContractTabChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 모든 모달들 */}
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
    </div>
  );
};

export default DashboardPage;
