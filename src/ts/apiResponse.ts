import { AxiosError } from "axios";
export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
}

export const API_STATUS_CODES = {
  SUCCESS: 200,
} as const;

export type API_ERROR_MESSAGES = AxiosError<{ message?: string }>;
