import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Link,
} from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { PreCounselDetail } from "@ts/counsel";
import Button from "@components/Button";
import CircularProgress from "@components/CircularProgress";
import InfoField from "@components/InfoField";

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
      PaperProps={{ width: "90vw", className: "rounded-xl" }}
    >
      <DialogTitle className="pb-2 text-primary font-bold">
        사전 상담 상세
      </DialogTitle>
      <DialogContent className="border-t border-gray-200 bg-neutral-100 flex flex-col sm:flex-row p-3 gap-4">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <CircularProgress />
          </div>
        ) : preCounselDetail ? (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
              <div className="card flex flex-col gap-1 p-5">
                <InfoField
                  label="사전 상담 이름"
                  value={preCounselDetail.title}
                  className="flex-row items-center gap-2"
                />
                <InfoField
                  label="제출일시"
                  value={formatDate(preCounselDetail.submittedAt)}
                  className="flex-row items-center gap-2"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {preCounselDetail.answers.map((item, index) => (
                <div key={item.questionUid} className="card p-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">
                        {index + 1}. {item.questionTitle}
                      </span>
                      {item.required && (
                        <span className="text-red-600 text-xs">(필수)</span>
                      )}
                    </div>
                    {item.description && (
                      <span className="text-gray-600 mb-2">
                        {item.description}
                      </span>
                    )}
                    <Divider className="my-2" />
                    <div className="p-4 bg-gray-50 rounded">
                      <span>
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
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-6">
            사전 상담 내용을 불러올 수 없습니다.
          </p>
        )}
      </DialogContent>
      <DialogActions className="p-4 justify-end">
        <Button onClick={onClose} color="info" variant="text">
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
