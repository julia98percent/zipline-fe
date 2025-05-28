import { useState, useCallback } from "react";
import { fetchPreCounselDetail } from "@apis/preCounselService";
import { PreCounselDetail } from "@ts/Counsel";

export const useNotification = () => {
  const [isSurveyDetailModalOpen, setIsSurveyDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreCounsel, setSelectedPreCounsel] =
    useState<PreCounselDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePreCounselClick = useCallback(async (uid: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPreCounselDetail(uid);
      setSelectedPreCounsel(data);
      setIsSurveyDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching pre-counsel data", error);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsSurveyDetailModalOpen(false);
    setTimeout(() => {
      setSelectedPreCounsel(null);
      setError(null);
    }, 300);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSurveyDetailModalOpen,
    isLoading,
    selectedPreCounsel,
    error,
    handlePreCounselClick,
    handleCloseModal,
    resetError,
  };
};
