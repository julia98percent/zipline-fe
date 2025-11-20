"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
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

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const SURVEY_PAGE_SIZE = 10;

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

interface UseDashboardProps {
  initialStatistics: {
    recentCustomers: number;
    recentContractsCount: number;
    ongoingContracts: number;
    completedContracts: number;
  };
  initialSchedules: Schedule[];
  initialSurveyResponses: PreCounsel[];
  initialCounselListByDueDate: Counsel[];
  initialCounselListByLatest: Counsel[];
  initialExpiringContracts: Contract[];
  initialRecentContracts: Contract[];
}

export const useDashboard = (props: UseDashboardProps): DashboardData => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [counselTab, setCounselTab] = useState<"request" | "latest">("request");
  const [contractTab, setContractTab] = useState<"expiring" | "recent">(
    "expiring"
  );
  // State - 초기 데이터를 서버에서 받은 값으로 설정
  const [recentCustomers] = useState<number>(
    props.initialStatistics.recentCustomers
  );
  const [recentContractsCount] = useState<number>(
    props.initialStatistics.recentContractsCount
  );
  const [ongoingContracts] = useState<number>(
    props.initialStatistics.ongoingContracts
  );
  const [completedContracts] = useState<number>(
    props.initialStatistics.completedContracts
  );
  const [recentContracts] = useState<Contract[]>(props.initialRecentContracts);
  const [isLoading] = useState<boolean>(false); // 서버에서 이미 로딩했으므로 false
  const [schedules, setSchedules] = useState<Schedule[]>(
    props.initialSchedules
  );
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<Schedule[]>(
    []
  );
  const [selectedDayStr, setSelectedDayStr] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [surveyResponses] = useState<PreCounsel[]>(
    props.initialSurveyResponses
  );
  const [expiringContracts] = useState<Contract[]>(
    props.initialExpiringContracts
  );
  const [contractLoading] = useState(false);
  const [counselListByDueDate] = useState<Counsel[]>(
    props.initialCounselListByDueDate
  );
  const [counselListByLatest] = useState<Counsel[]>(
    props.initialCounselListByLatest
  );
  const [counselLoading] = useState(false); // 서버에서 이미 로딩했으므로 false

  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [isSurveyDetailModalOpen, setIsSurveyDetailModalOpen] = useState(false);
  const [isRecentCustomersModalOpen, setIsRecentCustomersModalOpen] =
    useState(false);
  const [recentContractsModalOpen, setRecentContractsModalOpen] =
    useState(false);
  const [ongoingContractsOpen, setOngoingContractsOpen] = useState(false);
  const [completedContractsOpen, setCompletedContractsOpen] = useState(false);

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
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.uid === updatedSchedule.uid ? updatedSchedule : schedule
          )
        );
        setIsDetailModalOpen(false);
        setSelectedSchedule(null);
        showToast({
          message: "일정이 성공적으로 수정되었습니다.",
          type: "success",
        });
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
    if (recentContractsCount > 0) {
      setRecentContractsModalOpen(true);
    }
  }, [recentContractsCount]);

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
    if (!customerUid) return "#f0f0f0";
    const colors = [
      "#e3f2fd",
      "#f3e5f5",
      "#e8f5e8",
      "#fff3e0",
      "#fce4ec",
      "#e0f2f1",
      "#f1f8e9",
      "#fff8e1",
      "#e1f5fe",
      "#f9fbe7",
    ];
    return colors[customerUid % colors.length];
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

  // selectedDate가 변경될 때만 schedules 다시 가져오기
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const startDate = dayjs(selectedDate).startOf("week").toISOString();
        const endDate = dayjs(selectedDate).endOf("week").toISOString();

        const schedules = await fetchSchedulesByDateRange({
          startDate,
          endDate,
        });
        setSchedules(schedules);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    };

    fetchSchedules();
  }, [selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    counselTab,
    contractTab,
    recentCustomers,
    recentContractsCount,
    ongoingContracts,
    completedContracts,
    isLoading,
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
