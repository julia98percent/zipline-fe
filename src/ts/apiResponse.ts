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

export interface PageRequestParams {
  page?: number;
  size?: number;
  sortFields?: Record<string, "ASC" | "DESC">;
}

export interface PaginationBase {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export type PaginatedResponse<K extends string, T> = {
  [P in K]: T;
} & PaginationBase;
