import { Box } from "@mui/material";
import "./DashboardPage.css";
import PageHeader from "@components/PageHeader/PageHeader";
import { useDashboard } from "./useDashboard";
import StatisticsCards from "./components/StatisticsCards";
import WeeklyScheduleCalendar from "./components/WeeklyScheduleCalendar";
import {
  CounselList,
  ContractList,
  SurveyList,
  DashboardModals,
} from "./components";

const DashboardPage = () => {
  const dashboardData = useDashboard();

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#f5f5f5",
        p: 0,
      }}
    >
      <PageHeader title="대시보드" />

      <Box sx={{ p: 3, pt: 0 }}>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            height: "calc(100vh - 300px)",
          }}
        >
          {/* 상단 영역 - 주간 일정과 설문 목록 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 3,
              flex: 1,
            }}
          >
            {/* 왼쪽 - 주간 일정 캘린더 */}
            <Box
              sx={{
                flex: { xs: "1", lg: "2" },
                display: "flex",
                flexDirection: "column",
              }}
            >
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
            </Box>

            {/* 오른쪽 - 신규 설문 목록 */}
            <Box
              sx={{
                flex: { xs: "1", lg: "1" },
                display: "flex",
                flexDirection: "column",
                minHeight: "400px",
              }}
            >
              <SurveyList
                surveyResponses={dashboardData.surveyResponses}
                handleSurveyClick={dashboardData.handleSurveyClick}
              />
            </Box>
          </Box>

          {/* 하단 영역 - 상담 목록과 계약 목록을 한 줄로 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              minHeight: "400px",
            }}
          >
            {/* 상담 목록 */}
            <Box
              sx={{
                flex: 1,
                minHeight: "400px",
              }}
            >
              <CounselList
                counselTab={dashboardData.counselTab}
                currentCounselList={dashboardData.currentCounselList}
                counselLoading={dashboardData.counselLoading}
                handleCounselTabChange={dashboardData.handleCounselTabChange}
                handleCounselClick={dashboardData.handleCounselClick}
              />
            </Box>

            {/* 계약 목록 */}
            <Box
              sx={{
                flex: 1,
                minHeight: "400px",
              }}
            >
              <ContractList
                contractTab={dashboardData.contractTab}
                currentContractList={dashboardData.currentContractList}
                contractLoading={dashboardData.contractLoading}
                handleContractTabChange={dashboardData.handleContractTabChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>

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
    </Box>
  );
};

export default DashboardPage;
