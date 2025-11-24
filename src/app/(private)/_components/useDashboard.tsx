"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Schedule } from "@/types/schedule";
import { Contract } from "@/types/contract";
import { Counsel, PreCounsel } from "@/types/counsel";
import { showToast } from "@/components/Toast";
import {
  fetchSchedulesByDateRange,
  updateSchedule,
} from "@/apis/scheduleService";
import { fetchDashboardStatistics } from "@/apis/statisticsService";
import { fetchSubmittedSurveyResponses } from "@/apis/preCounselService";
import { fetchDashboardCounsels } from "@/apis/counselService";
import {
  fetchExpiringContractsForDashboard,
  fetchRecentContractsForDashboard,
} from "@/apis/contractService";
import { SCHEDULE_COLORS, NEUTRAL } from "@/constants/colors";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface DashboardData {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  counselTab: "request" | "latest";
  contractTab: "expiring" | "recent";
  recentCustomers: number;
  recentContractsCount: number;
  ongoingContracts: number;
  completedContracts: number;
  isLoading: boolean;
  schedules: Schedule[];
  surveyResponses: PreCounsel[];
  expiringContracts: Contract[];
  contractLoading: boolean;
  counselListByDueDate: Counsel[];
  counselListByLatest: Counsel[];
  counselLoading: boolean;

  moreModalOpen: boolean;
  setMoreModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDaySchedules: Schedule[];
  selectedDayStr: string;
  selectedSchedule: Schedule | null;
  isDetailModalOpen: boolean;
  selectedSurveyId: number | null;
  isSurveyDetailModalOpen: boolean;
  isRecentCustomersModalOpen: boolean;
  setIsRecentCustomersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  recentContractsModalOpen: boolean;
  setRecentContractsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ongoingContractsOpen: boolean;
  setOngoingContractsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  completedContractsOpen: boolean;
  setCompletedContractsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  recentContracts: Contract[];

  currentCounselList: Counsel[];
  currentContractList: Contract[];

  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleCounselTabChange: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleContractTabChange: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMoreClick: (daySchedules: Schedule[], dayStr: string) => void;
  handleScheduleClick: (schedule: Schedule) => void;
  handleCloseDetailModal: () => void;
  handleSaveSchedule: (updatedSchedule: Schedule) => Promise<void>;
  handleSurveyClick: (surveyResponseUid: number) => void;
  handleCloseSurveyDetailModal: () => void;
  handleRecentContractsClick: () => void;
  handleCounselClick: (counselId: number) => void;
  handleViewAllSchedules: () => void;

  getWeekDates: () => dayjs.Dayjs[];
  getDayName: (date: dayjs.Dayjs) => string;
  currentWeekRange: () => string;
  getScheduleColor: (customerUid: number | null) => string;
}

export const useDashboard = (): DashboardData => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [counselTab, setCounselTab] = useState<"request" | "latest">("request");
  const [contractTab, setContractTab] = useState<"expiring" | "recent">(
    "expiring"
  );

  // Modal states
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<Schedule[]>(
    []
  );
  const [selectedDayStr, setSelectedDayStr] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [isSurveyDetailModalOpen, setIsSurveyDetailModalOpen] = useState(false);
  const [isRecentCustomersModalOpen, setIsRecentCustomersModalOpen] =
    useState(false);
  const [recentContractsModalOpen, setRecentContractsModalOpen] =
    useState(false);
  const [ongoingContractsOpen, setOngoingContractsOpen] = useState(false);
  const [completedContractsOpen, setCompletedContractsOpen] = useState(false);

  // 날짜 범위 계산
  const startDate = useMemo(
    () => dayjs(selectedDate).startOf("week").toISOString(),
    [selectedDate]
  );
  const endDate = useMemo(
    () => dayjs(selectedDate).endOf("week").toISOString(),
    [selectedDate]
  );

  // React Query: 통계 데이터
  const { data: statisticsData, isLoading: statisticsLoading } = useQuery({
    queryKey: ["dashboardStatistics"],
    queryFn: fetchDashboardStatistics,
    staleTime: 60 * 1000, // 1분
  });

  // React Query: 일정 데이터
  const { data: schedules = [] } = useQuery({
    queryKey: ["schedules", startDate, endDate],
    queryFn: () => fetchSchedulesByDateRange({ startDate, endDate }),
    staleTime: 30 * 1000, // 30초
  });

  // React Query: 사전 상담 데이터
  const { data: surveyResponsesData } = useQuery({
    queryKey: ["surveyResponses", 0, 10],
    queryFn: () => fetchSubmittedSurveyResponses(0, 10),
    staleTime: 60 * 1000,
  });

  // React Query: 마감일 순 상담
  const { data: dueDateCounselsData, isLoading: dueDateCounselsLoading } =
    useQuery({
      queryKey: ["counsels", "DUE_DATE", 0, 5],
      queryFn: () =>
        fetchDashboardCounsels({ sortType: "DUE_DATE", page: 0, size: 5 }),
      staleTime: 60 * 1000,
    });

  // React Query: 최신 순 상담
  const { data: latestCounselsData, isLoading: latestCounselsLoading } =
    useQuery({
      queryKey: ["counsels", "LATEST", 0, 5],
      queryFn: () =>
        fetchDashboardCounsels({ sortType: "LATEST", page: 0, size: 5 }),
      staleTime: 60 * 1000,
    });

  // React Query: 만료 예정 계약
  const { data: expiringContractsData, isLoading: expiringContractsLoading } =
    useQuery({
      queryKey: ["contracts", "expiring", 0, 5],
      queryFn: () => fetchExpiringContractsForDashboard(0, 5),
      staleTime: 60 * 1000,
    });

  // React Query: 최근 계약
  const { data: recentContractsData, isLoading: recentContractsLoading } =
    useQuery({
      queryKey: ["contracts", "recent", 0, 5],
      queryFn: () => fetchRecentContractsForDashboard(0, 5),
      staleTime: 60 * 1000,
    });

  // 데이터 변환
  const surveyResponses = useMemo(() => {
    if (!surveyResponsesData?.surveyResponses) return [];
    return surveyResponsesData.surveyResponses.map((response) => ({
      uid: response.surveyResponseUid,
      name: response.name,
      phoneNo: response.phoneNumber,
      phoneNumber: response.phoneNumber,
      createdAt: response.submittedAt,
      submittedAt: response.submittedAt,
      surveyResponseUid: response.surveyResponseUid,
    }));
  }, [surveyResponsesData]);

  const counselListByDueDate = useMemo(
    () => (dueDateCounselsData as { counsels?: Counsel[] })?.counsels || [],
    [dueDateCounselsData]
  );

  const counselListByLatest = useMemo(
    () => (latestCounselsData as { counsels?: Counsel[] })?.counsels || [],
    [latestCounselsData]
  );

  const expiringContracts = useMemo(
    () => expiringContractsData?.contracts || [],
    [expiringContractsData]
  );

  const recentContracts = useMemo(
    () => recentContractsData?.contracts || [],
    [recentContractsData]
  );

  // 로딩 상태
  const counselLoading = dueDateCounselsLoading || latestCounselsLoading;
  const contractLoading = expiringContractsLoading || recentContractsLoading;

  // Handlers
  const handlePrevWeek = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  }, [selectedDate]);

  const handleNextWeek = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  }, [selectedDate]);

  const handleCounselTabChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setCounselTab(e.currentTarget.id as "request" | "latest");
    },
    []
  );

  const handleContractTabChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setContractTab(e.currentTarget.id as "expiring" | "recent");
    },
    []
  );

  const handleMoreClick = useCallback(
    (daySchedules: Schedule[], dayStr: string) => {
      setSelectedDaySchedules(daySchedules);
      setSelectedDayStr(dayStr);
      setMoreModalOpen(true);
    },
    []
  );

  const handleScheduleClick = useCallback((schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedSchedule(null);
  }, []);

  const handleSaveSchedule = useCallback(async (updatedSchedule: Schedule) => {
    try {
      const { uid, customerName, ...scheduleForApi } = updatedSchedule;
      void customerName;

      const result = await updateSchedule(uid, scheduleForApi);

      if (result.success) {
        setIsDetailModalOpen(false);
        setSelectedSchedule(null);
        showToast({
          message: "일정이 성공적으로 수정되었습니다.",
          type: "success",
        });
        // React Query가 자동으로 refetch
      } else {
        showToast({
          message: result.message || "일정 수정에 실패했습니다.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to update schedule:", error);
      showToast({
        message: "일정 수정에 실패했습니다.",
        type: "error",
      });
    }
  }, []);

  const handleSurveyClick = useCallback((surveyResponseUid: number) => {
    setSelectedSurveyId(surveyResponseUid);
    setIsSurveyDetailModalOpen(true);
  }, []);

  const handleCloseSurveyDetailModal = useCallback(() => {
    setIsSurveyDetailModalOpen(false);
    setSelectedSurveyId(null);
  }, []);

  const handleRecentContractsClick = useCallback(() => {
    if (statisticsData && statisticsData.recentContractsCount > 0) {
      setRecentContractsModalOpen(true);
    }
  }, [statisticsData]);

  const handleCounselClick = useCallback(
    (counselId: number) => {
      router.push(`/counsels/general/${counselId}`);
    },
    [router]
  );

  const handleViewAllSchedules = useCallback(() => {
    router.push("/schedules");
  }, [router]);

  const getWeekDates = useCallback(() => {
    const startOfWeek = dayjs(selectedDate).startOf("week");
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.add(i, "day"));
    }
    return dates;
  }, [selectedDate]);

  const getDayName = useCallback((date: dayjs.Dayjs) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.day()];
  }, []);

  const currentWeekRange = useCallback(() => {
    const startOfWeek = dayjs(selectedDate).startOf("week");
    const endOfWeek = dayjs(selectedDate).endOf("week");
    return `${startOfWeek.format("YYYY.MM.DD")} - ${endOfWeek.format(
      "YYYY.MM.DD"
    )}`;
  }, [selectedDate]);

  const getScheduleColor = useCallback((customerUid: number | null) => {
    if (!customerUid) return NEUTRAL[200];
    return SCHEDULE_COLORS[customerUid % SCHEDULE_COLORS.length];
  }, []);

  // Computed values
  const currentCounselList = useMemo(() => {
    return counselTab === "request"
      ? counselListByDueDate
      : counselListByLatest;
  }, [counselTab, counselListByDueDate, counselListByLatest]);

  const currentContractList = useMemo(() => {
    return contractTab === "expiring" ? expiringContracts : recentContracts;
  }, [contractTab, expiringContracts, recentContracts]);

  return {
    selectedDate,
    setSelectedDate,
    counselTab,
    contractTab,
    recentCustomers: statisticsData?.recentCustomers || 0,
    recentContractsCount: statisticsData?.recentContractsCount || 0,
    ongoingContracts: statisticsData?.ongoingContracts || 0,
    completedContracts: statisticsData?.completedContracts || 0,
    isLoading: statisticsLoading,
    schedules,
    surveyResponses,
    expiringContracts,
    contractLoading,
    counselListByDueDate,
    counselListByLatest,
    counselLoading,
    moreModalOpen,
    setMoreModalOpen,
    selectedDaySchedules,
    selectedDayStr,
    selectedSchedule,
    isDetailModalOpen,
    selectedSurveyId,
    isSurveyDetailModalOpen,
    isRecentCustomersModalOpen,
    setIsRecentCustomersModalOpen,
    recentContractsModalOpen,
    setRecentContractsModalOpen,
    ongoingContractsOpen,
    setOngoingContractsOpen,
    completedContractsOpen,
    setCompletedContractsOpen,

    currentCounselList,
    currentContractList,
    recentContracts,
    handlePrevWeek,
    handleNextWeek,
    handleCounselTabChange,
    handleContractTabChange,
    handleMoreClick,
    handleScheduleClick,
    handleCloseDetailModal,
    handleSaveSchedule,
    handleSurveyClick,
    handleCloseSurveyDetailModal,
    handleRecentContractsClick,
    handleCounselClick,
    handleViewAllSchedules,

    getWeekDates,
    getDayName,
    currentWeekRange,
    getScheduleColor,
  };
};
export default useDashboard;
