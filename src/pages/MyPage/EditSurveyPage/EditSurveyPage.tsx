import { ChangeEvent, useEffect, useState } from "react";
import Button from "@components/Button";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SingleChoiceAdd from "./SingleChoiceAdd";
import MultipleChoiceAdd from "./MultipleChoiceAdd";
import apiClient from "@apis/apiClient";

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

const DUMMY_SURVEY_ID = 2;

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
  const [survey, setSurvey] = useState<SurveyType>({
    title: "",
    questions: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSurveyData = () => {
    setLoading(true);
    apiClient
      .get(`/surveys/${DUMMY_SURVEY_ID}`)
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
      choices: [...(updatedQuestions[questionIndex].choices || [])],
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
    setSurvey({
      ...survey,
      questions: [...survey.questions, DEFAULT_QUESTION_TEMPLATE],
    });
  };

  const handleDeleteQuestion = (index: number) => {
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
          navigate("/my");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("설문 수정 중 오류가 발생했습니다.");
      });
  };

  if (loading) {
    return <div>설문 정보를 불러오는 중...</div>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <TextField
        fullWidth
        label="설문 제목"
        value={survey.title}
        onChange={handleSurveyTitleChange}
        sx={{ mb: 4 }}
      />

      {survey.questions.map((question, questionIndex) => (
        <Box
          key={questionIndex}
          sx={{
            mb: 4,
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <TextField
            fullWidth
            label="질문 제목"
            value={question.title}
            onChange={(event) =>
              handleQuestionChange(questionIndex, "title", event.target.value)
            }
            sx={{ mb: 2 }}
          />
          <TextField
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
            fullWidth
            value={question.type}
            onChange={(event) =>
              handleQuestionChange(questionIndex, "type", event.target.value)
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
                checked={question.required}
                onChange={(_, checked) =>
                  handleRequiredChange(questionIndex, checked)
                }
              />
            }
            label="필수 질문"
          />

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

          <Button
            text="질문 삭제"
            color="error"
            onClick={() => handleDeleteQuestion(questionIndex)}
            sx={{ mt: 2 }}
          />
        </Box>
      ))}

      <Button text="질문 추가" onClick={handleAddQuestion} sx={{ mr: 2 }} />
      <Button text="설문 저장" color="success" onClick={requestUpdateSurvey} />
    </Box>
  );
};

export default EditSurveyPage;
