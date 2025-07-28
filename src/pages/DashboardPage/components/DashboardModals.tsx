import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import Table, { ColumnConfig } from "@components/Table";
import ScheduleDetailModal from "@components/ScheduleDetailModal/ScheduleDetailModal";
import PreCounselDetailModal from "@components/PreCounselDetailModal";
import RecentCustomersModal from "../components/statisticsModal/RecentCustomersModal";
import RecentContractsModal from "../components/statisticsModal/RecentContractsModal";
import OngoingContractsModal from "../components/statisticsModal/OngoingContractsModal";
import CompletedContractsModal from "../components/statisticsModal/CompletedContractsModal";
import { Schedule } from "@ts/schedule";
import Button from "@components/Button";

interface DashboardModalsProps {
  // 일정 모달
  selectedSchedule: Schedule | null;
  isDetailModalOpen: boolean;
  handleCloseDetailModal: () => void;
  handleSaveSchedule: (updatedSchedule: Schedule) => Promise<void>;
  handleScheduleClick: (schedule: Schedule) => void;

  // 신규 사전 상담 상세 모달
  selectedSurveyId: number | null;
  isSurveyDetailModalOpen: boolean;
  handleCloseSurveyDetailModal: () => void;
  handleSurveyClick: (surveyResponseUid: number) => void;

  // 일정 더보기 모달
  moreModalOpen: boolean;
  setMoreModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDaySchedules: Schedule[];
  selectedDayStr: string;

  // 최근 유입 고객 모달
  isRecentCustomersModalOpen: boolean;
  setIsRecentCustomersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // 최근 계약 모달
  recentContractsModalOpen: boolean;
  setRecentContractsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // 진행 중 계약 모달
  ongoingContractsOpen: boolean;
  setOngoingContractsOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // 완료 계약 모달
  completedContractsOpen: boolean;
  setCompletedContractsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
  selectedSchedule,
  isDetailModalOpen,
  handleCloseDetailModal,
  handleSaveSchedule,
  handleScheduleClick,
  selectedSurveyId,
  isSurveyDetailModalOpen,
  handleCloseSurveyDetailModal,
  handleSurveyClick,
  moreModalOpen,
  setMoreModalOpen,
  selectedDaySchedules,
  selectedDayStr,
  isRecentCustomersModalOpen,
  setIsRecentCustomersModalOpen,
  recentContractsModalOpen,
  setRecentContractsModalOpen,
  ongoingContractsOpen,
  setOngoingContractsOpen,
  completedContractsOpen,
  setCompletedContractsOpen,
}) => {
  // 일정 테이블을 위한 컬럼 설정
  const scheduleColumns: ColumnConfig<Schedule>[] = [
    {
      key: "time",
      label: "시간",
      align: "left",
      render: (_, schedule) => dayjs(schedule.startDate).format("HH:mm"),
    },
    {
      key: "title",
      label: "제목",
      align: "left",
      render: (_, schedule) => schedule.title,
    },
    {
      key: "customerName",
      label: "고객명",
      align: "left",
      render: (_, schedule) => schedule.customerName || "-",
    },
  ];

  // 테이블 데이터 변환 (uid를 id로 매핑)
  const scheduleTableData = selectedDaySchedules.map((schedule) => ({
    id: schedule.uid,
    ...schedule,
  }));

  return (
    <>
      {/* 일정 상세 모달 */}
      {selectedSchedule && (
        <ScheduleDetailModal
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          schedule={selectedSchedule}
          onSave={handleSaveSchedule}
        />
      )}
      {/* 신규 사전 상담 상세 모달 */}
      <PreCounselDetailModal
        open={isSurveyDetailModalOpen}
        onClose={handleCloseSurveyDetailModal}
        surveyResponseUid={selectedSurveyId}
      />

      {/* 일정 더보기 모달 */}
      <Dialog
        open={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedDayStr} 일정 ({selectedDaySchedules.length}개)
        </DialogTitle>
        <DialogContent>
          <Table
            columns={scheduleColumns}
            bodyList={scheduleTableData}
            handleRowClick={(schedule) => handleScheduleClick(schedule)}
            pagination={false}
            noDataMessage="일정이 없습니다"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoreModalOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
      {/* Recent Customers Modal */}
      <RecentCustomersModal
        open={isRecentCustomersModalOpen}
        onClose={() => setIsRecentCustomersModalOpen(false)}
        onSurveyClick={handleSurveyClick}
      />
      {/* Recent Contracts Modal */}
      <RecentContractsModal
        open={recentContractsModalOpen}
        onClose={() => setRecentContractsModalOpen(false)}
      />
      {/* Ongoing Contracts Modal */}
      <OngoingContractsModal
        open={ongoingContractsOpen}
        onClose={() => setOngoingContractsOpen(false)}
      />
      {/* Completed Contracts Modal */}
      <CompletedContractsModal
        open={completedContractsOpen}
        onClose={() => setCompletedContractsOpen(false)}
      />
    </>
  );
};

export default DashboardModals;
