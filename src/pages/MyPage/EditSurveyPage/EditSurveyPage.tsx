import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSurvey,
  updateSurvey,
  SurveyType,
  QuestionType,
} from "@apis/preCounselService";
import useAuthStore from "@stores/useAuthStore";
import EditSurveyPageView from "./EditSurveyPageView";
import { showToast } from "@components/Toast";

const DEFAULT_QUESTION_TEMPLATE: QuestionType = {
  id: 0,
  title: "",
  description: "",
  type: "SUBJECTIVE",
  required: false,
  choices: [],
};

const EditSurveyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [survey, setSurvey] = useState<SurveyType>({
    title: "",
    questions: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSurveyData = useCallback(async () => {
    if (!user?.url) return;

    setLoading(true);
    try {
      const surveyData = await getSurvey(String(user.url));
      if (surveyData) {
        setSurvey(surveyData);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.url]);

  useEffect(() => {
    fetchSurveyData();
  }, [fetchSurveyData]);

  const handleSurveyTitleChange = (value: string) => {
    setSurvey({ ...survey, title: value });
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
        { id: Date.now(), text: "" },
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
      id: Math.max(...survey.questions.map((q) => q.id || 0), 0) + 1,
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

  const requestUpdateSurvey = async () => {
    try {
      await updateSurvey(survey);
      showToast({
        message: "설문을 변경했습니다.",
        type: "success",
      });

      navigate("/my", { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch {
      showToast({
        message: "설문 수정 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const isQuestionDeletable = (index: number): boolean => {
    return index >= 2;
  };

  return (
    <EditSurveyPageView
      survey={survey}
      loading={loading}
      onSurveyTitleChange={handleSurveyTitleChange}
      onQuestionChange={handleQuestionChange}
      onChoiceChange={handleChoiceChange}
      onAddChoice={handleAddChoice}
      onDeleteChoice={handleDeleteChoice}
      onAddQuestion={handleAddQuestion}
      onDeleteQuestion={handleDeleteQuestion}
      onRequiredChange={handleRequiredChange}
      onUpdateSurvey={requestUpdateSurvey}
      isQuestionDeletable={isQuestionDeletable}
    />
  );
};

export default EditSurveyPage;
