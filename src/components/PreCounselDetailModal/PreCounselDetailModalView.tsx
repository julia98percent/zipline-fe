import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Divider,
  Link,
} from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { PreCounselDetail } from "@ts/counsel";
import Button from "@components/Button";

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
        className: "rounded-xl",
      }}
    >
      <DialogTitle className="pb-2 text-primary font-bold">
        사전 상담 상세
      </DialogTitle>
      <DialogContent className="pt-4">
        {isLoading ? (
          <Box className="flex justify-center p-6">
            <CircularProgress />
          </Box>
        ) : preCounselDetail ? (
          <Box className="flex flex-col gap-6">
            <Paper elevation={0} className="p-4 bg-gray-50 rounded-lg">
              <Box className="flex flex-col gap-2">
                <Box className="flex gap-4">
                  <Typography variant="body2" className="text-gray-600 w-24">
                    사전 상담 이름
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {preCounselDetail.title}
                  </Typography>
                </Box>
                <Box className="flex gap-4">
                  <Typography variant="body2" className="text-gray-600 w-24">
                    제출일시
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {formatDate(preCounselDetail.submittedAt)}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Box className="flex flex-col gap-4">
              {preCounselDetail.answers.map((item, index) => (
                <Paper
                  key={item.questionUid}
                  elevation={0}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <Box className="flex flex-col gap-2">
                    <Box className="flex items-center gap-2">
                      <Typography
                        variant="body1"
                        className="text-gray-900 font-medium"
                      >
                        {index + 1}. {item.questionTitle}
                      </Typography>
                      {item.required && (
                        <Typography
                          variant="caption"
                          className="text-red-600 text-xs"
                        >
                          (필수)
                        </Typography>
                      )}
                    </Box>
                    {item.description && (
                      <Typography
                        variant="body2"
                        className="text-gray-600 mb-2"
                      >
                        {item.description}
                      </Typography>
                    )}
                    <Divider className="my-2" />
                    <Box className="p-4 bg-gray-50 rounded">
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
                                className="text-primary no-underline hover:underline"
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
            className="text-gray-600 text-center py-6"
          >
            사전 상담 내용을 불러올 수 없습니다.
          </Typography>
        )}
      </DialogContent>
      <DialogActions className="p-4 gap-2 justify-end">
        <Button
          onClick={onClose}
          color="info"
          variant="outlined"
          className="ml-0"
        >
          닫기
        </Button>
        <Button
          onClick={onRegisterCustomer}
          variant="outlined"
          color="primary"
          disabled={isRegistering || !preCounselDetail}
        >
          {isRegistering ? "등록 중..." : "고객 등록하기"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreCounselDetailModal;
