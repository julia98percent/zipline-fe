import { ChangeEvent, useEffect, useState } from "react";
import Button from "@components/Button";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SingleChoiceAdd from "./SingleChoiceAdd";
import MultipleChoiceAdd from "./MultipleChoiceAdd";
import apiClient from "@apis/apiClient";
import useUserStore from "@stores/useUserStore";
import PageHeader from "@components/PageHeader/PageHeader";

type ChoiceType = { text: string };

export interface QuestionType {
  id?: number;
  title: string;
  description: string;
  type: (typeof QUESTION_TYPE)[number]["value"];
  required: boolean;
  choices?: ChoiceType[];
}

interface SurveyType {
  id?: number;
  userId?: number;
  title: string;
  status?: string;
  createdAt?: string;
  questions: QuestionType[];
}

interface FormattedChoice {
  content: string;
}

interface FormattedQuestion {
  title: string;
  description: string;
  type: string;
  isRequired: boolean;
  choices?: FormattedChoice[];
}

const QUESTION_TYPE = [
  { value: "SUBJECTIVE", label: "주관식" },
  { value: "SINGLE_CHOICE", label: "객관식 (단일 선택)" },
  { value: "MULTIPLE_CHOICE", label: "객관식 (복수 선택)" },
  { value: "FILE_UPLOAD", label: "파일 업로드" },
] as const;

const DEFAULT_QUESTION_TEMPLATE: QuestionType = {
  title: "",
  description: "",
  type: "SUBJECTIVE",
  required: false,
};

const EditSurveyPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [survey, setSurvey] = useState<SurveyType>({
    title: "",
    questions: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSurveyData = () => {
    setLoading(true);
    apiClient
      .get(`/surveys/${user?.url}`)
      .then((res) => {
        const surveyData = res?.data?.data;
        if (surveyData) {
          setSurvey(surveyData);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const handleSurveyTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSurvey({ ...survey, title: e.target.value });
  };

  const handleQuestionChange = (
    index: number,
    field: keyof QuestionType,
    value: string | boolean
  ) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...survey.questions];
    if (updatedQuestions[questionIndex].choices) {
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        choices: updatedQuestions[questionIndex].choices?.map((choice, index) =>
          index === choiceIndex ? { ...choice, text: value } : choice
        ),
      };
      setSurvey({ ...survey, questions: updatedQuestions });
    }
  };

  const handleAddChoice = (questionIndex: number) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      choices: [
        ...(updatedQuestions[questionIndex].choices || []),
        { text: "" },
      ],
    };
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleDeleteChoice = (questionIndex: number, choiceIndex: number) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[questionIndex].choices =
      updatedQuestions[questionIndex].choices?.filter(
        (_, index) => index !== choiceIndex
      ) || [];
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      ...DEFAULT_QUESTION_TEMPLATE,
      id: Math.max(...survey.questions.map(q => q.id || 0), 0) + 1
    };
    
    const updatedQuestions = [...survey.questions, newQuestion].sort((a, b) => {
      if (!a.id) return 1;
      if (!b.id) return -1;
      return a.id - b.id;
    });
    
    setSurvey({
      ...survey,
      questions: updatedQuestions,
    });
  };

  const handleDeleteQuestion = (index: number) => {
    if (index < 2) {
      return;
    }

    const updatedQuestions = survey.questions.filter((_, i) => i !== index);
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleRequiredChange = (index: number, checked: boolean) => {
    handleQuestionChange(index, "required", checked);
  };

  const requestUpdateSurvey = () => {
    const formatSurveyData = () => {
      return {
        title: survey.title,
        questions: survey.questions.map((question) => {
          const formattedQuestion = {
            title: question.title,
            description: question.description,
            type: question.type,
            isRequired: question.required,
          } as FormattedQuestion;

          if (
            question.type !== "SUBJECTIVE" &&
            question.type !== "FILE_UPLOAD"
          ) {
            formattedQuestion.choices = question.choices?.map((choice) => ({
              content: choice.text, // `text`를 `content`로 변환
            }));
          }

          return formattedQuestion;
        }),
      };
    };

    apiClient
      .post(`/surveys`, formatSurveyData())
      .then((res) => {
        if (res.status === 201) {
          alert("설문을 변경했습니다!");
          navigate("/my", { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 100); // 페이지 이동 후 약간의 지연을 두고 새로고침
        }
      })
      .catch((error) => {
        console.log(error);
        alert("설문 수정 중 오류가 발생했습니다.");
      });
  };

  const isQuestionDeletable = (index: number): boolean => {
    return index >= 2;
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
      <PageHeader title="설문 수정" userName={user?.name || ""} />

      {/* Content */}
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <Button
            text="질문 추가"
            onClick={handleAddQuestion}
            sx={{
              mr: 2,
              border: "1px solid #164F9E",
              color: "#164F9E",
            }}
          />
          <Button
            text="설문 저장"
            onClick={requestUpdateSurvey}
            sx={{
              backgroundColor: "#164F9E",
              color: "white",
            }}
          />
        </Box>

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
                  handleQuestionChange(
                    questionIndex,
                    "title",
                    event.target.value
                  )
                }
                sx={{ mb: 2 }}
              />
              <TextField
                disabled={questionIndex < 2}
                fullWidth
                label="질문 설명"
                value={question.description}
                onChange={(event) =>
                  handleQuestionChange(
                    questionIndex,
                    "description",
                    event.target.value
                  )
                }
                sx={{ mb: 2 }}
              />
              <Select
                disabled={questionIndex < 2}
                fullWidth
                value={question.type}
                onChange={(event) =>
                  handleQuestionChange(
                    questionIndex,
                    "type",
                    event.target.value
                  )
                }
                sx={{ mb: 2 }}
              >
                {QUESTION_TYPE.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>

              <FormControlLabel
                control={
                  <Checkbox
                    disabled={questionIndex < 2}
                    checked={question.required}
                    onChange={(_, checked) =>
                      handleRequiredChange(questionIndex, checked)
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
                    handleChoiceChange={handleChoiceChange}
                    questionIndex={questionIndex}
                    handleAddChoice={handleAddChoice}
                    handleDeleteChoice={handleDeleteChoice}
                  />
                )}

                {/* 다중 선택 객관식 */}
                {question.type === "MULTIPLE_CHOICE" && (
                  <MultipleChoiceAdd
                    question={question}
                    handleChoiceChange={handleChoiceChange}
                    questionIndex={questionIndex}
                    handleAddChoice={handleAddChoice}
                    handleDeleteChoice={handleDeleteChoice}
                  />
                )}
              </>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {isQuestionDeletable(questionIndex) ? (
                <Button
                  text="질문 삭제"
                  color="error"
                  onClick={() => handleDeleteQuestion(questionIndex)}
                  sx={{
                    mt: 2,
                    backgroundColor: "#f8f8f8",
                    color: "#d32f2f",
                    "&:hover": {
                      backgroundColor: "#ffebee",
                    },
                  }}
                />
              ) : (
                <Tooltip title="기본 질문은 삭제할 수 없습니다">
                  <span>
                    <Button
                      text="질문 삭제"
                      color="error"
                      disabled
                      sx={{
                        mt: 2,
                        backgroundColor: "#f8f8f8",
                        color: "rgba(0, 0, 0, 0.26)",
                        "&:hover": {
                          backgroundColor: "#f8f8f8",
                        },
                      }}
                    />
                  </span>
                </Tooltip>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default EditSurveyPage;
