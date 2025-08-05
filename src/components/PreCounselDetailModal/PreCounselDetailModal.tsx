import { useState, useEffect, useCallback } from "react";
import { fetchPreCounselDetail } from "@apis/preCounselService";
import { PreCounselDetail } from "@ts/counsel";
import PreCounselDetailModalView from "./PreCounselDetailModalView";
import { createCustomer } from "@apis/customerService";
import { showToast } from "@components/Toast";

interface PreCounselDetailModalContainerProps {
  open: boolean;
  onClose: () => void;
  surveyResponseUid: number | null;
}

const PreCounselDetailModalContainer = ({
  open,
  onClose,
  surveyResponseUid,
}: PreCounselDetailModalContainerProps) => {
  const [preCounselDetail, setPreCounselDetail] =
    useState<PreCounselDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleOpen = useCallback(async () => {
    if (!surveyResponseUid || !open) return;

    setIsLoading(true);
    try {
      const data = await fetchPreCounselDetail(surveyResponseUid);
      setPreCounselDetail(data);
    } catch (error) {
      console.error("Failed to fetch pre-counsel detail:", error);
      setPreCounselDetail(null);
    } finally {
      setIsLoading(false);
    }
  }, [open, surveyResponseUid]);

  useEffect(() => {
    if (open && surveyResponseUid) {
      handleOpen();
    } else if (!open) {
      setPreCounselDetail(null);
    }
  }, [open, surveyResponseUid, handleOpen]);

  const handleRegisterCustomer = async () => {
    if (!preCounselDetail) return;

    setIsRegistering(true);
    try {
      const result = await createCustomer({
        name: preCounselDetail.answers[0].answer,
        phoneNo: preCounselDetail.answers[1].answer,
      });

      if (result.success) {
        showToast({
          message: result.message,
          type: "success",
        });
        onClose();
      } else {
        showToast({
          message: result.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to register customer:", error);
      showToast({
        message: "고객 등록에 실패했습니다.",
        type: "error",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <PreCounselDetailModalView
      open={open}
      onClose={onClose}
      preCounselDetail={preCounselDetail}
      isLoading={isLoading}
      onRegisterCustomer={handleRegisterCustomer}
      isRegistering={isRegistering}
    />
  );
};

export default PreCounselDetailModalContainer;
