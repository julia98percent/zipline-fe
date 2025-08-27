import { ChangeEvent } from "react";
import Button from "@components/Button";
import {
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import Select, { MenuItem } from "@components/Select";
import PageHeader from "@components/PageHeader";
import SingleChoiceAdd from "./SingleChoiceAdd";
import MultipleChoiceAdd from "./MultipleChoiceAdd";
import { SurveyType, QuestionType } from "@apis/preCounselService";
import CircularProgress from "@components/CircularProgress";
import TextField from "@components/TextField";

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
      <>
        <PageHeader />
        <div className="flex justify-center items-center h-[calc(100vh-72px)]">
          <CircularProgress />
        </div>
      </>
    );
  }

  return (
    <div>
      <PageHeader />

      <div
        className="flex justify-end sticky top-[64px] z-[999] bg-neutral-50 gap-2
       px-5 pb-1 border-b border-neutral-300 items-center"
      >
        <Button onClick={onAddQuestion} color="info" variant="text">
          질문 추가
        </Button>
        <Divider orientation="vertical" className="h-4" />
        <Button onClick={onUpdateSurvey} variant="text">
          설문 저장
        </Button>
      </div>

      <div className="flex flex-col p-5 sm:p-8 gap-4">
        <div className="p-5 card">
          <TextField
            fullWidth
            label="설문 제목"
            value={survey.title}
            onChange={handleSurveyTitleChange}
          />
        </div>

        {survey.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="flex flex-col p-5 card gap-4">
            {questionIndex < 2 && (
              <div className="bg-[#e3f2fd] text-primary float-right text-xs px-2 py-1 rounded max-w-[65px] ml-auto">
                기본 질문
              </div>
            )}

            <div className="flex flex-col gap-4">
              <TextField
                disabled={questionIndex < 2}
                fullWidth
                label="질문 제목"
                value={question.title}
                onChange={(event) =>
                  onQuestionChange(questionIndex, "title", event.target.value)
                }
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
              />
              <StringBooleanSelect
                label="질문 유형"
                disabled={questionIndex < 2}
                fullWidth
                value={question.type}
                onChange={(event) =>
                  onQuestionChange(questionIndex, "type", event.target.value)
                }
                size="medium"
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
            </div>

            {(question.type === "SINGLE_CHOICE" ||
              question.type === "MULTIPLE_CHOICE") && (
              <>
                <Divider />

                {question.type === "SINGLE_CHOICE" && (
                  <SingleChoiceAdd
                    question={question}
                    handleChoiceChange={onChoiceChange}
                    questionIndex={questionIndex}
                    handleAddChoice={onAddChoice}
                    handleDeleteChoice={onDeleteChoice}
                  />
                )}

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

            <div className="ml-auto">
              {isQuestionDeletable(questionIndex) ? (
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => onDeleteQuestion(questionIndex)}
                >
                  질문 삭제
                </Button>
              ) : (
                <Tooltip title="기본 질문은 삭제할 수 없습니다.">
                  <Button color="info" disabled>
                    질문 삭제
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditSurveyPageView;
