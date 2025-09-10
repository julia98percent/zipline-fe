import { ApiResponse } from "@/types/apiResponse";

export function handleApiResponse<T>(
  response: ApiResponse<T>,
  errorMessage: string
): T;

// void 응답용
export function handleApiResponse(
  response: ApiResponse<void>,
  errorMessage: string
): void;

export function handleApiResponse<T>(
  response: ApiResponse<T>,
  errorMessage: string
): T {
  if (response.success) {
    return response.data as T;
  }

  const serverMessage = response.message || errorMessage;

  throw new Error(serverMessage);
}

export const handleApiError = (error: unknown, context: string): never => {
  console.error(`Error ${context}:`, error);
  throw error;
};
