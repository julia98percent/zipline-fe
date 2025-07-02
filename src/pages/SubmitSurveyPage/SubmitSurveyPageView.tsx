import Button from "@components/Button";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
  Paper,
  Radio,
} from "@mui/material";
import { formatPhoneNumber } from "@utils/numberUtil";
import { AnswerType, ValidationErrors } from "@apis/preCounselService";
import { PreCounselQuestion } from "@ts/counsel";

interface SubmitSurveyPageViewProps {
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

const SubmitSurveyPageView = ({
  loading,
  surveyQuestions,
  answers,
  validationErrors,
  onAnswerChange,
  onFileChange,
  onFileRemove,
  onSubmit,
}: SubmitSurveyPageViewProps) => {
  console.log(surveyQuestions);
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        설문 답변 제출
      </Typography>

      {Object.keys(validationErrors).length > 0 && (
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#FFEBEE",
            border: "1px solid #FFCDD2",
          }}
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
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
              border: isError ? "1px solid #f44336" : "none",
            }}
          >
            <Typography variant="h6">
              {question.title}
              {question.required && (
                <Box component="span" sx={{ color: "#f44336", ml: 1 }}>
                  *
                </Box>
              )}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {question.description}
            </Typography>

            {isError && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mb: 2 }}
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
              <Box sx={{ mt: 2 }}>
                {!answers[questionIndex]?.file ? (
                  <input
                    type="file"
                    onChange={(e) => onFileChange(questionIndex, e)}
                    style={{ marginTop: "8px" }}
                  />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Typography variant="body2">
                      선택된 파일: {answers[questionIndex].file?.name}
                    </Typography>
                    <Button
                      text="파일 변경"
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
                      sx={{
                        ml: 2,
                        backgroundColor: "#164F9E",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0d3b7e",
                        },
                      }}
                    />
                    <Button
                      text="제거"
                      onClick={() => onFileRemove(questionIndex)}
                      sx={{
                        ml: 1,
                        backgroundColor: "#f44336",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#d32f2f",
                        },
                      }}
                    />
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

      <Button
        text="답변 제출"
        onClick={onSubmit}
        sx={{
          backgroundColor: "#164F9E",
          color: "white",
        }}
      />
    </Box>
  );
};

export default SubmitSurveyPageView;
