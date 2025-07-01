import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import ScheduleDetailModal from "@components/ScheduleDetailModal/ScheduleDetailModal";
import PreCounselDetailModal from "@components/PreCounselDetailModal";
import RecentCustomersModal from "../components/statisticsModal/RecentCustomersModal";
import RecentContractsModal from "../components/statisticsModal/RecentContractsModal";
import OngoingContractsModal from "../components/statisticsModal/OngoingContractsModal";
import CompletedContractsModal from "../components/statisticsModal/CompletedContractsModal";
import { Schedule } from "@ts/schedule";
import { Contract } from "@ts/contract";
import { PreCounsel } from "@ts/counsel";

interface DashboardModalsProps {
  // 일정 모달
  selectedSchedule: Schedule | null;
  isDetailModalOpen: boolean;
  handleCloseDetailModal: () => void;
  handleSaveSchedule: (updatedSchedule: Schedule) => Promise<void>;
  handleScheduleClick: (schedule: Schedule) => void;

  // 신규 설문 상세 모달
  selectedSurveyId: number | null;
  isSurveyDetailModalOpen: boolean;
  handleCloseSurveyDetailModal: () => void;
  surveyResponses: PreCounsel[];
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
  recentContracts: Contract[];
  recentContractsLoading: boolean;
  recentContractsCount: number;
  recentContractsPage: number;
  setRecentContractsPage: React.Dispatch<React.SetStateAction<number>>;
  recentContractsRowsPerPage: number;
  setRecentContractsRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  fetchRecentContracts: (page: number) => Promise<void>;

  // 진행중 계약 모달
  ongoingContractsOpen: boolean;
  setOngoingContractsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ongoingContractsList: Contract[];
  ongoingContractsLoading: boolean;
  ongoingContractsTotalCount: number;
  ongoingContractsPage: number;
  setOngoingContractsPage: React.Dispatch<React.SetStateAction<number>>;
  ongoingContractsRowsPerPage: number;
  setOngoingContractsRowsPerPage: React.Dispatch<React.SetStateAction<number>>;

  // 완료 계약 모달
  completedContractsOpen: boolean;
  setCompletedContractsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  completedContractsList: Contract[];
  completedContractsLoading: boolean;
  completedContractsTotalCount: number;
  completedContractsPage: number;
  setCompletedContractsPage: React.Dispatch<React.SetStateAction<number>>;
  completedContractsRowsPerPage: number;
  setCompletedContractsRowsPerPage: React.Dispatch<
    React.SetStateAction<number>
  >;
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
  surveyResponses,
  handleSurveyClick,
  moreModalOpen,
  setMoreModalOpen,
  selectedDaySchedules,
  selectedDayStr,
  isRecentCustomersModalOpen,
  setIsRecentCustomersModalOpen,
  recentContractsModalOpen,
  setRecentContractsModalOpen,
  recentContracts,
  recentContractsLoading,
  recentContractsCount,
  recentContractsPage,
  setRecentContractsPage,
  recentContractsRowsPerPage,
  setRecentContractsRowsPerPage,
  fetchRecentContracts,
  ongoingContractsOpen,
  setOngoingContractsOpen,
  ongoingContractsList,
  ongoingContractsLoading,
  ongoingContractsTotalCount,
  ongoingContractsPage,
  setOngoingContractsPage,
  ongoingContractsRowsPerPage,
  setOngoingContractsRowsPerPage,
  completedContractsOpen,
  setCompletedContractsOpen,
  completedContractsList,
  completedContractsLoading,
  completedContractsTotalCount,
  completedContractsPage,
  setCompletedContractsPage,
  completedContractsRowsPerPage,
  setCompletedContractsRowsPerPage,
}) => {
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
      {/* 신규 설문 상세 모달 */}
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>시간</TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>고객명</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDaySchedules.map((schedule) => (
                  <TableRow
                    key={schedule.uid}
                    hover
                    onClick={() => handleScheduleClick(schedule)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      {dayjs(schedule.startDate).format("HH:mm")}
                    </TableCell>
                    <TableCell>{schedule.title}</TableCell>
                    <TableCell>{schedule.customerName || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoreModalOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
      {/* Recent Customers Modal */}
      <RecentCustomersModal
        open={isRecentCustomersModalOpen}
        onClose={() => setIsRecentCustomersModalOpen(false)}
        surveyResponses={surveyResponses}
        onSurveyClick={handleSurveyClick}
      />
      {/* Recent Contracts Modal */}
      <RecentContractsModal
        open={recentContractsModalOpen}
        onClose={() => {
          setRecentContractsModalOpen(false);
          setRecentContractsPage(0);
          setRecentContractsRowsPerPage(10);
        }}
        contracts={recentContracts}
        loading={recentContractsLoading}
        totalCount={recentContractsCount}
        page={recentContractsPage}
        rowsPerPage={recentContractsRowsPerPage}
        onPageChange={(newPage) => {
          setRecentContractsPage(newPage);
          fetchRecentContracts(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRecentContractsRowsPerPage(newRowsPerPage);
          setRecentContractsPage(0);
          fetchRecentContracts(0);
        }}
      />
      {/* Ongoing Contracts Modal */}
      <OngoingContractsModal
        open={ongoingContractsOpen}
        onClose={() => {
          setOngoingContractsOpen(false);
          setOngoingContractsPage(0);
          setOngoingContractsRowsPerPage(10);
        }}
        contracts={ongoingContractsList}
        loading={ongoingContractsLoading}
        totalCount={ongoingContractsTotalCount}
        page={ongoingContractsPage}
        rowsPerPage={ongoingContractsRowsPerPage}
        onPageChange={(newPage) => {
          setOngoingContractsPage(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setOngoingContractsRowsPerPage(newRowsPerPage);
          setOngoingContractsPage(0);
        }}
      />
      {/* Completed Contracts Modal */}
      <CompletedContractsModal
        open={completedContractsOpen}
        onClose={() => {
          setCompletedContractsOpen(false);
          setCompletedContractsPage(0);
          setCompletedContractsRowsPerPage(10);
        }}
        contracts={completedContractsList}
        loading={completedContractsLoading}
        totalCount={completedContractsTotalCount}
        page={completedContractsPage}
        rowsPerPage={completedContractsRowsPerPage}
        onPageChange={(newPage) => {
          setCompletedContractsPage(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setCompletedContractsRowsPerPage(newRowsPerPage);
          setCompletedContractsPage(0);
        }}
      />
    </>
  );
};

export default DashboardModals;
