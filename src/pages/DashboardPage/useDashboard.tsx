import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Schedule } from "@ts/schedule";
import { Contract } from "@ts/contract";
import { Counsel, PreCounsel } from "@ts/counsel";
import { showToast } from "@components/Toast";
import { fetchDashboardStatistics } from "@apis/statisticsService";
import {
  fetchSchedulesByDateRange,
  updateSchedule,
} from "@apis/scheduleService";
import { fetchSubmittedSurveyResponses as fetchSurveyResponsesAPI } from "@apis/preCounselService";
import { fetchDashboardCounsels } from "@apis/counselService";
import {
  fetchExpiringContractsForDashboard,
  fetchRecentContractsForDashboard,
} from "@apis/contractService";

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
  // Computed values
  currentCounselList: Counsel[];
  currentContractList: Contract[];

  // Event handlers
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleCounselTabChange: (
    event: React.SyntheticEvent,
    newValue: "request" | "latest"
  ) => void;
  handleContractTabChange: (
    event: React.SyntheticEvent,
    newValue: "expiring" | "recent"
  ) => void;
  handleMoreClick: (daySchedules: Schedule[], dayStr: string) => void;
  handleScheduleClick: (schedule: Schedule) => void;
  handleCloseDetailModal: () => void;
  handleSaveSchedule: (updatedSchedule: Schedule) => Promise<void>;
  handleSurveyClick: (surveyResponseUid: number) => void;
  handleCloseSurveyDetailModal: () => void;
  handleRecentContractsClick: () => void;
  handleCounselClick: (counselId: number) => void;
  handleViewAllSchedules: () => void;

  // Utility functions
  getWeekDates: () => dayjs.Dayjs[];
  getDayName: (date: dayjs.Dayjs) => string;
  currentWeekRange: () => string;
  getScheduleColor: (customerUid: number | null) => string;
}

export const useDashboard = (): DashboardData => {
  const navigate = useNavigate();

  // State declarations
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [counselTab, setCounselTab] = useState<"request" | "latest">("request");
  const [contractTab, setContractTab] = useState<"expiring" | "recent">(
    "expiring"
  );
  const [recentCustomers, setRecentCustomers] = useState<number>(0);
  const [recentContractsCount, setRecentContractsCount] = useState<number>(0);
  const [ongoingContracts, setOngoingContracts] = useState<number>(0);
  const [completedContracts, setCompletedContracts] = useState<number>(0);
  const [recentContracts, setRecentContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<Schedule[]>(
    []
  );
  const [selectedDayStr, setSelectedDayStr] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState<PreCounsel[]>([]);
  const [expiringContracts, setExpiringContracts] = useState<Contract[]>([]);
  const [contractLoading, setContractLoading] = useState(true);
  const [counselListByDueDate, setCounselListByDueDate] = useState<Counsel[]>(
    []
  );
  const [counselListByLatest, setCounselListByLatest] = useState<Counsel[]>([]);
  const [counselLoading, setCounselLoading] = useState(false);

  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [isSurveyDetailModalOpen, setIsSurveyDetailModalOpen] = useState(false);
  const [isRecentCustomersModalOpen, setIsRecentCustomersModalOpen] =
    useState(false);
  const [recentContractsModalOpen, setRecentContractsModalOpen] =
    useState(false);
  const [ongoingContractsOpen, setOngoingContractsOpen] = useState(false);
  const [completedContractsOpen, setCompletedContractsOpen] = useState(false);

  // API functions
  const fetchSurveyResponses = useCallback(async (): Promise<void> => {
    try {
      const surveyResponses = await fetchSurveyResponsesAPI(
        0,
        SURVEY_PAGE_SIZE
      );
      setSurveyResponses(
        surveyResponses.surveyResponses.map((response) => ({
          uid: response.surveyResponseUid,
          name: response.name,
          phoneNo: response.phoneNumber,
          phoneNumber: response.phoneNumber,
          createdAt: response.submittedAt,
          submittedAt: response.submittedAt,
          surveyResponseUid: response.surveyResponseUid,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch survey responses:", error);
      setSurveyResponses([]);
    }
  }, []);

  const fetchCounselLists = useCallback(async () => {
    setCounselLoading(true);
    try {
      const [dueDateCounsels, latestCounsels] = await Promise.all([
        fetchDashboardCounsels({ sortType: "DUE_DATE", page: 0, size: 5 }),
        fetchDashboardCounsels({ sortType: "LATEST", page: 0, size: 5 }),
      ]);

      setCounselListByDueDate((dueDateCounsels as any)?.counsels || []);
      setCounselListByLatest((latestCounsels as any)?.counsels || []);
    } catch (error) {
      console.error("Error fetching counsel lists:", error);
      setCounselListByDueDate([]);
      setCounselListByLatest([]);
    } finally {
      setCounselLoading(false);
    }
  }, []);

  // Event handlers
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
    (_event: React.SyntheticEvent, newValue: "request" | "latest") => {
      setCounselTab(newValue);
    },
    []
  );

  const handleContractTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: "expiring" | "recent") => {
      setContractTab(newValue);
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
      navigate(`/counsels/general/${counselId}`);
    },
    [navigate]
  );

  const handleViewAllSchedules = useCallback(() => {
    navigate("/schedules");
  }, [navigate]);

  // Utility functions
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

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        setIsLoading(true);

        const statisticsData = await fetchDashboardStatistics();
        setRecentCustomers(statisticsData.recentCustomers);
        setRecentContractsCount(statisticsData.recentContractsCount);
        setOngoingContracts(statisticsData.ongoingContracts);
        setCompletedContracts(statisticsData.completedContracts);
      } catch (error) {
        console.error("Failed to fetch statistics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatisticsData();
  }, []); // 통계 데이터는 날짜와 무관하므로 한번만 로딩

  // Fetch schedules when date changes (독립적으로 실행)
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
  }, [selectedDate]); // selectedDate에만 의존

  // Fetch survey responses
  useEffect(() => {
    fetchSurveyResponses();
  }, [fetchSurveyResponses]);

  // Fetch counsel lists
  useEffect(() => {
    fetchCounselLists();
  }, [fetchCounselLists]);

  // Fetch contracts
  useEffect(() => {
    const fetchAllContracts = async () => {
      setContractLoading(true);
      try {
        const expiringContracts = await fetchExpiringContractsForDashboard(
          0,
          5
        );
        const recentContracts = await fetchRecentContractsForDashboard(0, 5);

        setExpiringContracts(expiringContracts.contracts || []);
        setRecentContracts(recentContracts.contracts || []);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
        setExpiringContracts([]);
      } finally {
        setContractLoading(false);
      }
    };
    fetchAllContracts();
  }, []);

  return {
    // State values
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

    // Utility functions
    getWeekDates,
    getDayName,
    currentWeekRange,
    getScheduleColor,
  };
};
export default useDashboard;
