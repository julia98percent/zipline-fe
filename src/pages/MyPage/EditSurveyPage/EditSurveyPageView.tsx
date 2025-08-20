import { ChangeEvent } from "react";
import Button from "@components/Button";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
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
import CircularProgress from "@components/CircularProgress";

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
      <Box>
        <PageHeader title="설문 수정" />
        <div className="flex items-center justify-center h-[calc(100vh-72px)]">
          <CircularProgress />
        </div>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="설문 수정" />

      <Box
        className="flex justify-end sticky top-[64px] z-[999] bg-white gap-2
        px-8 py-4 border-b border-[#e0e0e0] shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
      >
        <Button onClick={onAddQuestion} variant="outlined">
          질문 추가
        </Button>
        <Button onClick={onUpdateSurvey}>설문 저장</Button>
      </Box>

      {/* Content */}
      <Box className="p-8">
        <TextField
          fullWidth
          label="설문 제목"
          value={survey.title}
          onChange={handleSurveyTitleChange}
          className="mb-16"
        />

        {survey.questions.map((question, questionIndex) => (
          <Paper
            key={questionIndex}
            elevation={1}
            className="mb-8 p-6 rounded-md bg-[#f9f9f9] relative"
          >
            {questionIndex < 2 && (
              <Box className="inline bg-[#e3f2fd] text-primary mb-4 float-right text-xs px-2 py-1 rounded">
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
                className="mb-4"
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
                className="mb-4"
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
                  <Typography className="font-medium text-[#555]">
                    필수 질문
                  </Typography>
                }
              />
            </Box>

            {(question.type === "SINGLE_CHOICE" ||
              question.type === "MULTIPLE_CHOICE") && (
              <>
                <Divider className="my-4" />

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

            <Box className="flex justify-end mt-4">
              {isQuestionDeletable(questionIndex) ? (
                <Button
                  color="error"
                  onClick={() => onDeleteQuestion(questionIndex)}
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
