import { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@apis/apiClient";

interface Question {
  choices: { id: number; text: string }[];
  description: string;
  id: number;
  required: boolean;
  title: string;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "SUBJECTIVE" | "FILE_UPLOAD";
}

interface AnswerType {
  questionId: number;
  choiceIds?: number[];
  answer?: string;
  file?: File | null;
}

const SubmitSurveyPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveyQuestions = () => {
    setLoading(true);
    apiClient
      .get(`/surveys/${surveyId}`)
      .then((res) => {
        const questions = res?.data?.data?.questions;
        if (questions) {
          setSurveyQuestions(questions);
          setAnswers(
            questions.map((question: Question) => ({
              questionId: question.id,
              choiceIds: [],
              answer: "",
              file: null,
            }))
          );
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSurveyQuestions();
  }, []);

  const handleAnswerChange = (
    questionIndex: number,
    value: string | number | number[] | File | null
  ) => {
    const updatedAnswers = [...answers];
    const question = surveyQuestions[questionIndex];

    if (question.type === "SUBJECTIVE") {
      updatedAnswers[questionIndex].answer = value as string;
    } else if (question.type === "FILE_UPLOAD") {
      updatedAnswers[questionIndex].file = value as File;
    } else {
      updatedAnswers[questionIndex].choiceIds = value as number[];
    }

    setAnswers(updatedAnswers);
  };

  const handleFileChange = (
    questionIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      handleAnswerChange(questionIndex, event.target.files[0]);
    }
  };

  const requestSubmitAnswers = () => {
    setLoading(true);

    // FormData 객체 생성
    const formData = new FormData();

    // requestDTO를 JSON 문자열로 변환하여 FormData에 추가
    const requestDTO = answers.map((answer) => ({
      questionId: answer.questionId,
      choiceIds: answer.choiceIds || [],
      answer: answer.answer || "",
    }));

    formData.append("requestDTO", JSON.stringify(requestDTO));

    // 파일 추가
    answers.forEach((answer) => {
      if (answer.file) {
        formData.append(`files`, answer.file);
      }
    });

    apiClient
      .post(`/surveys/${surveyId}/submit`, formData)
      .then((res) => {
        if (res.status === 201) {
          navigate("thank-you");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("답변 제출 중 오류가 발생했습니다.");
      })
      .finally(() => setLoading(false));
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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        설문 답변 제출
      </Typography>
      {surveyQuestions.map((question, questionIndex) => (
        <Paper
          key={question.id}
          elevation={1}
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6">{question.title}</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {question.description}
          </Typography>

          {question.type === "SUBJECTIVE" && (
            <TextField
              fullWidth
              placeholder="답변을 입력하세요"
              value={answers[questionIndex]?.answer || ""}
              onChange={(e) =>
                handleAnswerChange(questionIndex, e.target.value)
              }
            />
          )}

          {question.type === "FILE_UPLOAD" && (
            <Box sx={{ mt: 2 }}>
              <input
                type="file"
                onChange={(e) => handleFileChange(questionIndex, e)}
                style={{ marginTop: "8px" }}
              />
              {answers[questionIndex]?.file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  선택된 파일: {answers[questionIndex].file.name}
                </Typography>
              )}
            </Box>
          )}

          {question.type === "SINGLE_CHOICE" &&
            question.choices?.map((choice) => (
              <FormControlLabel
                key={choice.id}
                control={
                  <Radio
                    checked={
                      answers[questionIndex].choiceIds?.[0] === choice.id
                    }
                    onChange={() =>
                      handleAnswerChange(questionIndex, [choice.id])
                    }
                  />
                }
                label={choice.text}
              />
            ))}

          {question.type === "MULTIPLE_CHOICE" &&
            question.choices?.map((choice) => (
              <FormControlLabel
                key={choice.id}
                control={
                  <Checkbox
                    checked={
                      answers[questionIndex].choiceIds?.includes(choice.id) ||
                      false
                    }
                    onChange={() => {
                      const choiceIds = answers[questionIndex].choiceIds || [];
                      const updatedChoiceIds = choiceIds.includes(choice.id)
                        ? choiceIds.filter((id) => id !== choice.id)
                        : [...choiceIds, choice.id];
                      handleAnswerChange(questionIndex, updatedChoiceIds);
                    }}
                  />
                }
                label={choice.text}
              />
            ))}
        </Paper>
      ))}

      <Button
        text="답변 제출"
        onClick={requestSubmitAnswers}
        sx={{
          backgroundColor: "#2E5D9F",
          color: "white",
        }}
      />
    </Box>
  );
};

export default SubmitSurveyPage;
