import { ApiResponse } from "@ts/apiResponse";

export const handleApiResponse = <T>(
  response: ApiResponse<T>,
  errorMessage: string
): T => {
  if (
    response.success &&
    response.data !== undefined &&
    response.data !== null
  ) {
    return response.data;
  }
  throw new Error(response.message || errorMessage);
};

export const handleApiError = (error: unknown, context: string): never => {
  console.error(`Error ${context}:`, error);
  throw error;
};
