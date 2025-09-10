import Button from "@/components/Button";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Radio,
} from "@mui/material";
import { formatPhoneNumber } from "@/utils/numberUtil";
import { AnswerType, ValidationErrors } from "@/apis/preCounselService";
import { PreCounselQuestion } from "@/types/counsel";
import CircularProgress from "@/components/CircularProgress";

interface SubmitPreCounselViewProps {
  loading: boolean;
  surveyQuestions: PreCounselQuestion[];
  answers: AnswerType[];
  validationErrors: ValidationErrors;
  onAnswerChange: (
    questionIndex: number,
    value: string | number | number[] | File | null
  ) => void;
  onFileChange: (
    questionIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onFileRemove: (questionIndex: number) => void;
  onSubmit: () => void;
}

const SubmitPreCounselView = ({
  loading,
  surveyQuestions,
  answers,
  validationErrors,
  onAnswerChange,
  onFileChange,
  onFileRemove,
  onSubmit,
}: SubmitPreCounselViewProps) => {
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-8">
      <Typography variant="h4" className="mb-8">
        설문 답변 제출
      </Typography>

      {Object.keys(validationErrors).length > 0 && (
        <Paper
          elevation={0}
          className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200"
        >
          <Typography variant="subtitle1" color="error">
            필수 항목을 모두 입력해주세요.
          </Typography>
        </Paper>
      )}

      {surveyQuestions.map((question, questionIndex) => {
        const isError = validationErrors[question.id];

        return (
          <Paper
            key={question.id}
            elevation={1}
            className="mb-8 p-6 rounded-lg bg-gray-50"
            style={{
              border: isError ? "1px solid #f44336" : "none",
            }}
          >
            <Typography variant="h6">
              {question.title}
              {question.required && (
                <Box component="span" className="text-red-600 ml-2">
                  *
                </Box>
              )}
            </Typography>
            <Typography variant="body2" className="mb-4">
              {question.description}
            </Typography>

            {isError && (
              <Typography
                variant="caption"
                color="error"
                className="block mb-4"
              >
                이 항목은 필수입니다.
              </Typography>
            )}

            {question.type === "SUBJECTIVE" && (
              <TextField
                fullWidth
                placeholder="답변을 입력하세요"
                value={answers[questionIndex]?.answer || ""}
                onChange={(e) =>
                  onAnswerChange(
                    questionIndex,
                    questionIndex === 1
                      ? formatPhoneNumber(e.target.value)
                      : e.target.value
                  )
                }
                error={isError}
              />
            )}

            {question.type === "FILE_UPLOAD" && (
              <Box className="mt-4">
                {!answers[questionIndex]?.file ? (
                  <input
                    type="file"
                    onChange={(e) => onFileChange(questionIndex, e)}
                    className="mt-2"
                  />
                ) : (
                  <Box className="flex items-center mt-2 gap-2">
                    <Typography variant="body2">
                      선택된 파일: {answers[questionIndex].file?.name}
                    </Typography>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() => {
                        const fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.onchange = (e: Event) => {
                          const target = e.target as HTMLInputElement;
                          onFileChange(questionIndex, {
                            target,
                          } as React.ChangeEvent<HTMLInputElement>);
                        };
                        fileInput.click();
                      }}
                    >
                      파일 변경
                    </Button>
                    <Button
                      onClick={() => onFileRemove(questionIndex)}
                      color="error"
                    >
                      제거
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {question.type === "SINGLE_CHOICE" &&
              question.choices?.map((choice: { id: number; text: string }) => (
                <FormControlLabel
                  key={choice.id}
                  control={
                    <Radio
                      checked={
                        answers[questionIndex].choiceIds?.[0] === choice.id
                      }
                      onChange={() =>
                        onAnswerChange(questionIndex, [choice.id])
                      }
                    />
                  }
                  label={choice.text}
                />
              ))}

            {question.type === "MULTIPLE_CHOICE" &&
              question.choices?.map((choice: { id: number; text: string }) => (
                <FormControlLabel
                  key={choice.id}
                  control={
                    <Checkbox
                      checked={
                        answers[questionIndex].choiceIds?.includes(choice.id) ||
                        false
                      }
                      onChange={() => {
                        const choiceIds =
                          answers[questionIndex].choiceIds || [];
                        const updatedChoiceIds = choiceIds.includes(choice.id)
                          ? choiceIds.filter((id: number) => id !== choice.id)
                          : [...choiceIds, choice.id];
                        onAnswerChange(questionIndex, updatedChoiceIds);
                      }}
                    />
                  }
                  label={choice.text}
                />
              ))}
          </Paper>
        );
      })}

      <Button onClick={onSubmit}>답변 제출</Button>
    </Box>
  );
};

export default SubmitPreCounselView;
