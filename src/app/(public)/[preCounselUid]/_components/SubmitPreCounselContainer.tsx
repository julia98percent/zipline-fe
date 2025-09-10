"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/components/Toast";
import {
  getSurveyQuestions,
  submitSurveyAnswers,
  QuestionType as Question,
  AnswerType,
  ValidationErrors,
} from "@/apis/preCounselService";
import SubmitPreCounselView from "./SubmitPreCounselView";

const SubmitPreCounselContainer = () => {
  const { preCounselUid } = useParams();
  const router = useRouter();
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const fetchSurveyQuestions = async () => {
    if (!preCounselUid) return;

    setLoading(true);
    try {
      const questions = await getSurveyQuestions(preCounselUid as string);
      setSurveyQuestions(questions);
      setAnswers(
        questions.map((question: Question) => ({
          questionId: question.id,
          choiceIds: [],
          answer: "",
          file: null,
        }))
      );
    } catch (error) {
      console.error(error);
      router.replace("/error");
    } finally {
      setLoading(false);
    }
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
      const file = event.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        showToast({
          message: "파일 크기는 10MB를 초과할 수 없습니다.",
          type: "error",
        });

        // 파일 선택 초기화
        event.target.value = "";
        handleAnswerChange(questionIndex, null);
        return;
      }

      handleAnswerChange(questionIndex, file);
    }
  };

  const handleFileRemove = (questionIndex: number) => {
    handleAnswerChange(questionIndex, null);
  };

  const validateRequiredFields = (): boolean => {
    const errors: ValidationErrors = {};
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

  const requestSubmitAnswers = async () => {
    if (!validateRequiredFields()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!preCounselUid) {
      console.error("Survey ID is missing");
      return;
    }

    setLoading(true);

    try {
      await submitSurveyAnswers(
        preCounselUid as string,
        answers,
        surveyQuestions
      );
      router.replace("/appreciate");
    } catch (error) {
      console.error(error);
      showToast({
        message: "답변 제출 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubmitPreCounselView
      loading={loading}
      surveyQuestions={surveyQuestions}
      answers={answers}
      validationErrors={validationErrors}
      onAnswerChange={handleAnswerChange}
      onFileChange={handleFileChange}
      onFileRemove={handleFileRemove}
      onSubmit={requestSubmitAnswers}
    />
  );
};

export default SubmitPreCounselContainer;
