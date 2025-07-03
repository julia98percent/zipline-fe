import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Divider,
  Link,
} from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { PreCounselDetail } from "@ts/counsel";

interface PreCounselDetailModalProps {
  open: boolean;
  onClose: () => void;
  preCounselDetail: PreCounselDetail | null;
  isLoading: boolean;
  onRegisterCustomer: () => void;
  isRegistering?: boolean;
}

const PreCounselDetailModal = ({
  open,
  onClose,
  preCounselDetail,
  isLoading,
  onRegisterCustomer,
  isRegistering = false,
}: PreCounselDetailModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, color: "#164F9E", fontWeight: 700 }}>
        사전 상담 상세
      </DialogTitle>
      <DialogContent sx={{ pt: "16px !important" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : preCounselDetail ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", width: 100 }}
                  >
                    사전 상담 이름
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {preCounselDetail.title}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", width: 100 }}
                  >
                    제출일시
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(preCounselDetail.submittedAt)}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {preCounselDetail.answers.map((item, index) => (
                <Paper
                  key={item.questionUid}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ color: "#333", fontWeight: 500 }}
                      >
                        {index + 1}. {item.questionTitle}
                      </Typography>
                      {item.required && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#d32f2f",
                            fontSize: "0.75rem",
                          }}
                        >
                          (필수)
                        </Typography>
                      )}
                    </Box>
                    {item.description && (
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        {item.description}
                      </Typography>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#f8f9fa",
                        borderRadius: "4px",
                      }}
                    >
                      <Typography variant="body2">
                        {item.questionType === "SINGLE_CHOICE"
                          ? item.choices.find(
                              (choice) =>
                                choice.choiceUid === Number(item.answer)
                            )?.choiceText || item.answer
                          : item.questionType === "MULTIPLE_CHOICE"
                          ? item.answer
                              .split(",")
                              .map(
                                (uid) =>
                                  item.choices.find(
                                    (choice) => choice.choiceUid === Number(uid)
                                  )?.choiceText
                              )
                              .filter(Boolean)
                              .join(", ")
                          : item.questionType === "FILE_UPLOAD"
                          ? item.answer && (
                              <Link
                                href={item.answer}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: "#164F9E",
                                  textDecoration: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {item.fileName || "파일 다운로드"}
                              </Link>
                            )
                          : item.answer}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: "#666", textAlign: "center", py: 3 }}
          >
            사전 상담 내용을 불러올 수 없습니다.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1, justifyContent: "flex-end" }}>
        <Button
          onClick={onRegisterCustomer}
          variant="outlined"
          disabled={isRegistering || !preCounselDetail}
          sx={{
            borderColor: "#164F9E",
            color: "#164F9E",
            "&:hover": {
              borderColor: "#0D3B7A",
              backgroundColor: "rgba(22, 79, 158, 0.04)",
            },
            "&:disabled": {
              borderColor: "#ccc",
              color: "#ccc",
            },
          }}
        >
          {isRegistering ? "등록 중..." : "고객 등록하기"}
        </Button>
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

export default PreCounselDetailModal;
