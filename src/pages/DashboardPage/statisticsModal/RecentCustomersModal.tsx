import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { PreCounsel } from "@ts/counsel";

interface RecentCustomersModalProps {
  open: boolean;
  onClose: () => void;
  surveyResponses: PreCounsel[];
  onSurveyClick: (surveyResponseUid: number) => void;
}

const RecentCustomersModal = ({
  open,
  onClose,
  surveyResponses,
  onSurveyClick,
}: RecentCustomersModalProps) => {
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
        <TableContainer
          sx={{
            maxHeight: 480,
            overflow: "auto",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>고객명</TableCell>
                <TableCell>연락처</TableCell>
                <TableCell>제출일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(surveyResponses) &&
              surveyResponses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    신규 설문이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                Array.isArray(surveyResponses) &&
                surveyResponses.map((res) => (
                  <TableRow
                    key={res.surveyResponseUid}
                    hover
                    onClick={() => onSurveyClick(res.surveyResponseUid)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(22, 79, 158, 0.04)",
                      },
                    }}
                  >
                    <TableCell>{res.name}</TableCell>
                    <TableCell>{res.phoneNumber}</TableCell>
                    <TableCell>{formatDate(res.submittedAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
