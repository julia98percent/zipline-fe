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
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: boolean;
  }>({});

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

    if (question.required) {
      const newValidationErrors = { ...validationErrors };

      if (
        (question.type === "SUBJECTIVE" && (value as string).trim() !== "") ||
        (question.type === "FILE_UPLOAD" && value !== null) ||
        (["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(question.type) &&
          Array.isArray(value) &&
          value.length > 0)
      ) {
        delete newValidationErrors[question.id];
        setValidationErrors(newValidationErrors);
      }
    }
  };

  const handleFileChange = (
    questionIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      handleAnswerChange(questionIndex, event.target.files[0]);
    }
  };

  const handleFileRemove = (questionIndex: number) => {
    handleAnswerChange(questionIndex, null);
  };

  const validateRequiredFields = (): boolean => {
    const errors: { [key: number]: boolean } = {};
    let isValid = true;

    surveyQuestions.forEach((question, index) => {
      if (question.required) {
        const answer = answers[index];
        let hasValue = false;

        if (question.type === "SUBJECTIVE") {
          hasValue = !!answer.answer && answer.answer.trim() !== "";
        } else if (question.type === "FILE_UPLOAD") {
          hasValue = !!answer.file;
        } else if (
          ["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(question.type)
        ) {
          hasValue = !!answer.choiceIds && answer.choiceIds.length > 0;
        }

        if (!hasValue) {
          errors[question.id] = true;
          isValid = false;
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const requestSubmitAnswers = () => {
    if (!validateRequiredFields()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

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
        const originalFileName = answer.file.name;
        const newFileName = `${answer.questionId}$$###${originalFileName}`;
        const newFile = new File([answer.file], newFileName, {
          type: answer.file.type,
        });
        formData.append(`files`, newFile);
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
                  handleAnswerChange(questionIndex, e.target.value)
                }
                error={isError}
              />
            )}

            {question.type === "FILE_UPLOAD" && (
              <Box sx={{ mt: 2 }}>
                {!answers[questionIndex]?.file ? (
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(questionIndex, e)}
                    style={{ marginTop: "8px" }}
                  />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Typography variant="body2">
                      선택된 파일: {answers[questionIndex].file.name}
                    </Typography>
                    <Button
                      text="파일 변경"
                      onClick={() => {
                        const fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.onchange = (e: Event) => {
                          const target = e.target as HTMLInputElement;
                          handleFileChange(questionIndex, {
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
                      onClick={() => handleFileRemove(questionIndex)}
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
                        const choiceIds =
                          answers[questionIndex].choiceIds || [];
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
        );
      })}

      <Button
        text="답변 제출"
        onClick={requestSubmitAnswers}
        sx={{
          backgroundColor: "#164F9E",
          color: "white",
        }}
      />
    </Box>
  );
};

export default SubmitSurveyPage;
