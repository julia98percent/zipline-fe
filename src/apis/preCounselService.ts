import apiClient from "@/apis/apiClient";
import {
  PreCounsel,
  PreCounselDetail,
  PreCounselListData,
} from "@/types/counsel";
import { COUNSEL_ERROR_MESSAGES } from "@/constants/clientErrorMessage";
import { ApiResponse } from "@/types/apiResponse";
import { handleApiResponse, handleApiError } from "@/utils/apiUtil";

// Survey related types
export interface ChoiceType {
  id: number;
  text: string;
}

export interface QuestionType {
  id: number;
  title: string;
  description: string;
  type: "SUBJECTIVE" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "FILE_UPLOAD";
  required: boolean;
  choices: ChoiceType[];
}

export interface SurveyType {
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

interface UpdateSurveyRequest {
  title: string;
  questions: FormattedQuestion[];
}

export interface AnswerType {
  questionId: number;
  choiceIds?: number[];
  answer?: string;
  file?: File | null;
}

export interface ValidationErrors {
  [key: number]: boolean;
}

export interface SurveySubmissionAnswer {
  questionId: number;
  choiceIds: number[];
  answer: string;
}

export interface SurveySubmissionRequest {
  requestDTO: SurveySubmissionAnswer[];
  files?: File[];
}

export interface SurveyResponse {
  surveyResponseUid: number;
  name: string;
  phoneNumber: string;
  submittedAt: string;
}

export interface PaginatedSurveyResponsesResponse {
  surveyResponses: SurveyResponse[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export const fetchPreCounselDetail = async (
  surveyResponseUid: number
): Promise<PreCounselDetail> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<PreCounselDetail>
    >(`/surveys/responses/${surveyResponseUid}`);

    return handleApiResponse(
      response,
      COUNSEL_ERROR_MESSAGES.PRE_COUNSEL_DETAIL_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching pre-counsel detail");
  }
};

// 설문 응답 목록 조회
export const fetchSurveyResponses = async (params: {
  page?: number;
  size?: number;
}): Promise<PreCounsel[]> => {
  try {
    const { data: response } = await apiClient.get("/surveys/responses", {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    });

    const result = handleApiResponse<PreCounselListData>(
      response,
      COUNSEL_ERROR_MESSAGES.FETCH_FAILED
    );
    return result.surveyResponses ?? [];
  } catch (error) {
    return handleApiError(error, "fetching survey responses");
  }
};

// 특정 설문 응답 상세 조회
export const fetchSurveyResponseDetail = async (
  surveyResponseUid: number
): Promise<PreCounsel> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<PreCounsel>>(
      `/surveys/responses/${surveyResponseUid}`
    );

    return handleApiResponse(
      response,
      COUNSEL_ERROR_MESSAGES.PRE_COUNSEL_DETAIL_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching survey response detail");
  }
};

// Survey 관련 함수들 (surveyService에서 이동)
export const getSurvey = async (userUrl: string): Promise<SurveyType> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<SurveyType>>(
      `/surveys/${userUrl}`
    );
    return handleApiResponse(response, "설문조사를 가져오는데 실패했습니다.");
  } catch (error) {
    return handleApiError(error, "getting survey");
  }
};

export const getSurveyQuestions = async (
  surveyId: string
): Promise<QuestionType[]> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<{ questions: QuestionType[] }>
    >(`/surveys/${surveyId}`);

    const data = handleApiResponse(
      response,
      "설문조사 질문을 가져오는데 실패했습니다."
    );
    return data?.questions || [];
  } catch (error) {
    return handleApiError(error, "getting survey questions");
  }
};

export const submitSurveyAnswers = async (
  surveyId: string,
  answers: AnswerType[],
  questions: QuestionType[]
): Promise<void> => {
  try {
    const formData = new FormData();

    // requestDTO를 JSON 문자열로 변환하여 FormData에 추가
    const requestDTO = answers
      .filter((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        return question?.type !== "FILE_UPLOAD";
      })
      .map((answer) => ({
        questionId: answer.questionId,
        choiceIds: answer.choiceIds || [],
        answer: answer.answer || "",
      }));

    formData.append("requestDTO", JSON.stringify(requestDTO));

    // 파일 추가 - 파일명에 questionId를 포함
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

    const { data: response } = await apiClient.post<ApiResponse>(
      `/surveys/${surveyId}/submit`,
      formData
    );

    handleApiResponse(response, "답변 제출 중 오류가 발생했습니다.");
  } catch (error) {
    return handleApiError(error, "submitting survey answers");
  }
};

export const updateSurvey = async (surveyData: SurveyType): Promise<void> => {
  try {
    const formatSurveyData = (): UpdateSurveyRequest => {
      return {
        title: surveyData.title,
        questions: surveyData.questions.map((question) => {
          const formattedQuestion: FormattedQuestion = {
            title: question.title,
            description: question.description,
            type: question.type,
            isRequired: question.required,
          };

          if (
            question.type !== "SUBJECTIVE" &&
            question.type !== "FILE_UPLOAD"
          ) {
            formattedQuestion.choices = question.choices?.map((choice) => ({
              content: choice.text,
            }));
          }

          return formattedQuestion;
        }),
      };
    };

    const { data: response } = await apiClient.post<ApiResponse>(
      "/surveys",
      formatSurveyData()
    );

    handleApiResponse(response, "설문조사 업데이트에 실패했습니다.");
  } catch (error) {
    return handleApiError(error, "updating survey");
  }
};

// 제출된 설문 응답 목록 조회 (기존 fetchSubmittedSurveyResponses와 통합)
export const fetchSubmittedSurveyResponses = async (
  page: number,
  size: number
): Promise<PaginatedSurveyResponsesResponse> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<PaginatedSurveyResponsesResponse>
    >("/surveys/responses", {
      params: {
        page,
        size,
      },
    });

    return handleApiResponse(
      response,
      "제출된 설문 응답을 가져오는데 실패했습니다."
    );
  } catch (error) {
    return handleApiError(error, "fetching submitted survey responses");
  }
};
