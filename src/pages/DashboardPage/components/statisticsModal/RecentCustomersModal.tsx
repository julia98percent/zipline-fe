import { Modal, Typography, Box } from "@mui/material";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!open) return;

    setLoading(true);
    try {
      const responses = await fetchSubmittedSurveyResponses(page, rowsPerPage);
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
      setTotalCount(responses.totalItems);
    } catch (error) {
      console.error("Failed to fetch survey responses:", error);
      setSurveyResponses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [open, page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleClose = () => {
    setPage(0);
    onClose();
  };

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

  const tableData = surveyResponses.map((survey) => ({
    id: survey.surveyResponseUid,
    ...survey,
  }));

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-4xl bg-gray-100 shadow-2xl p-6 rounded-lg max-h-4/5 overflow-auto">
        <Typography className="font-bold text-primary text-xl mb-4">
          최근 유입 고객
        </Typography>
        <Table
          columns={columns}
          bodyList={tableData}
          handleRowClick={(survey) => onSurveyClick(survey.surveyResponseUid)}
          pagination={false}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalCount}
          handleChangePage={(_, newPage) => handlePageChange(newPage)}
          handleChangeRowsPerPage={(event) =>
            handleRowsPerPageChange(parseInt(event.target.value, 10))
          }
          isLoading={loading}
          noDataMessage="신규 사전 상담이 없습니다"
        />
      </Box>
    </Modal>
  );
};

export default RecentCustomersModal;
