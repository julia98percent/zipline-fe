import { ChangeEvent } from "react";
import Button from "@components/Button";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import Select, { MenuItem } from "@components/Select";
import PageHeader from "@components/PageHeader";
import SingleChoiceAdd from "./SingleChoiceAdd";
import MultipleChoiceAdd from "./MultipleChoiceAdd";
import { SurveyType, QuestionType } from "@apis/preCounselService";

const QUESTION_TYPE = [
  { value: "SUBJECTIVE", label: "주관식" },
  { value: "SINGLE_CHOICE", label: "객관식 (단일 선택)" },
  { value: "MULTIPLE_CHOICE", label: "객관식 (복수 선택)" },
  { value: "FILE_UPLOAD", label: "파일 업로드" },
] as const;

interface EditSurveyPageViewProps {
  survey: SurveyType;
  loading: boolean;
  onSurveyTitleChange: (value: string) => void;
  onQuestionChange: (
    index: number,
    field: keyof QuestionType,
    value: string | boolean
  ) => void;
  onChoiceChange: (
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => void;
  onAddChoice: (questionIndex: number) => void;
  onDeleteChoice: (questionIndex: number, choiceIndex: number) => void;
  onAddQuestion: () => void;
  onDeleteQuestion: (index: number) => void;
  onRequiredChange: (index: number, checked: boolean) => void;
  onUpdateSurvey: () => void;
  isQuestionDeletable: (index: number) => boolean;
}

const StringBooleanSelect = Select<string | boolean>;

const EditSurveyPageView = ({
  survey,
  loading,
  onSurveyTitleChange,
  onQuestionChange,
  onChoiceChange,
  onAddChoice,
  onDeleteChoice,
  onAddQuestion,
  onDeleteQuestion,
  onRequiredChange,
  onUpdateSurvey,
  isQuestionDeletable,
}: EditSurveyPageViewProps) => {
  const handleSurveyTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSurveyTitleChange(e.target.value);
  };

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
    <Box>
      <PageHeader title="설문 수정" />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "sticky",
          top: "64px",
          zIndex: 999,
          backgroundColor: "white",
          padding: "16px 32px",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          gap: 2,
        }}
      >
        <Button
          onClick={onAddQuestion}
          variant="outlined"
          className="px-4 py-2"
        >
          질문 추가
        </Button>
        <Button onClick={onUpdateSurvey} className="px-4 py-2">
          설문 저장
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ p: 4 }}>
        <TextField
          fullWidth
          label="설문 제목"
          value={survey.title}
          onChange={handleSurveyTitleChange}
          sx={{ mb: 4 }}
        />

        {survey.questions.map((question, questionIndex) => (
          <Paper
            key={questionIndex}
            elevation={1}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
              position: "relative",
            }}
          >
            {questionIndex < 2 && (
              <Box
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#1565c0",
                  padding: "4px 8px",
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  display: "inline",
                  float: "right",
                  marginBottom: "12px",
                }}
              >
                기본 질문
              </Box>
            )}
            {/* 질문 기본 정보 영역 */}
            <Box>
              <TextField
                disabled={questionIndex < 2}
                fullWidth
                label="질문 제목"
                value={question.title}
                onChange={(event) =>
                  onQuestionChange(questionIndex, "title", event.target.value)
                }
                sx={{ mb: 2 }}
              />
              <TextField
                disabled={questionIndex < 2}
                fullWidth
                label="질문 설명"
                value={question.description}
                onChange={(event) =>
                  onQuestionChange(
                    questionIndex,
                    "description",
                    event.target.value
                  )
                }
                sx={{ mb: 2 }}
              />
              <StringBooleanSelect
                disabled={questionIndex < 2}
                fullWidth
                value={question.type}
                onChange={(event) =>
                  onQuestionChange(questionIndex, "type", event.target.value)
                }
                className="mb-2"
              >
                {QUESTION_TYPE.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </StringBooleanSelect>

              <FormControlLabel
                control={
                  <Checkbox
                    disabled={questionIndex < 2}
                    checked={question.required}
                    onChange={(_, checked) =>
                      onRequiredChange(questionIndex, checked)
                    }
                    color="primary"
                  />
                }
                label={
                  <Typography sx={{ fontWeight: "500", color: "#555" }}>
                    필수 질문
                  </Typography>
                }
              />
            </Box>

            {(question.type === "SINGLE_CHOICE" ||
              question.type === "MULTIPLE_CHOICE") && (
              <>
                <Divider sx={{ my: 2 }} />

                {/* 단일 선택 객관식 */}
                {question.type === "SINGLE_CHOICE" && (
                  <SingleChoiceAdd
                    question={question}
                    handleChoiceChange={onChoiceChange}
                    questionIndex={questionIndex}
                    handleAddChoice={onAddChoice}
                    handleDeleteChoice={onDeleteChoice}
                  />
                )}

                {/* 다중 선택 객관식 */}
                {question.type === "MULTIPLE_CHOICE" && (
                  <MultipleChoiceAdd
                    question={question}
                    handleChoiceChange={onChoiceChange}
                    questionIndex={questionIndex}
                    handleAddChoice={onAddChoice}
                    handleDeleteChoice={onDeleteChoice}
                  />
                )}
              </>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              {isQuestionDeletable(questionIndex) ? (
                <Button
                  color="error"
                  onClick={() => onDeleteQuestion(questionIndex)}
                  className="px-4 py-2"
                >
                  질문 삭제
                </Button>
              ) : (
                <Tooltip title="기본 질문은 삭제할 수 없습니다">
                  <Button color="info" disabled>
                    질문 삭제
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default EditSurveyPageView;
