import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@utils/dateUtil";
import { PreCounsel } from "@ts/counsel";
import { fetchSubmittedSurveyResponses } from "@apis/preCounselService";
import Table, { ColumnConfig } from "@components/Table";

interface RecentCustomersModalProps {
  open: boolean;
  onClose: () => void;
  onSurveyClick: (surveyResponseUid: number) => void;
}

const RecentCustomersModal = ({
  open,
  onClose,
  onSurveyClick,
}: RecentCustomersModalProps) => {
  const [surveyResponses, setSurveyResponses] = useState<PreCounsel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!open) return;

    setLoading(true);
    try {
      const responses = await fetchSubmittedSurveyResponses(0, 10);
      setSurveyResponses(
        responses.surveyResponses.map((response) => ({
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
    } finally {
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 컬럼 설정
  const columns: ColumnConfig<PreCounsel>[] = [
    {
      key: "name",
      label: "고객명",
      align: "left",
      render: (_, survey) => survey.name,
    },
    {
      key: "phoneNumber",
      label: "연락처",
      align: "left",
      render: (_, survey) => survey.phoneNumber,
    },
    {
      key: "submittedAt",
      label: "제출일",
      align: "left",
      render: (_, survey) => formatDate(survey.submittedAt),
    },
  ];

  // 테이블 데이터 변환 (uid를 id로 매핑)
  const tableData = surveyResponses.map((survey) => ({
    id: survey.surveyResponseUid,
    ...survey,
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: "bold", color: "#164F9E", fontSize: "1.25rem" }}
      >
        최근 유입 고객
      </DialogTitle>
      <DialogContent>
        <Table
          columns={columns}
          bodyList={tableData}
          handleRowClick={(survey) => onSurveyClick(survey.surveyResponseUid)}
          pagination={false}
          isLoading={loading}
          noDataMessage="신규 설문이 없습니다"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#164F9E",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#0D3B7A",
              boxShadow: "none",
            },
          }}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecentCustomersModal;
