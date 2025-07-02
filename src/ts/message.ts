import { ApiResponse } from "./apiResponse";

interface MessageLog {
  message: string;
  createAt: string;
}

export interface MessageCount {
  total: number;
  sentTotal: number;
  sentFailed: number;
  sentSuccess: number;
  sentPending: number;
  sentReplacement: number;
  refund: number;
  registeredFailed: number;
  registeredSuccess: number;
}

export interface MessageHistory {
  groupId: string;
  status: string;
  count: {
    sentTotal: number;
    sentSuccess: number;
    sentFailed: number;
  };
  dateSent: string;
  dateCompleted: string;
  dateCreated: string;
  log: Array<{
    message: string;
    createAt: string;
  }>;
}
export interface Message {
  from: string;
  to: string;
  text: string;
  statusCode: string;
  dateCreated: string;
}

export interface MessageDetail {
  groupId: string;
  text: string;
  country: string;
  networkName: string;
  from: string;
  type: string;
  subject: string | null;
  dateCreated: string;
  dateUpdated: string;
  dateReceived?: string;
  statusCode: string;
  status: string;
  to: string;
  messageId: string;
  count?: MessageCount;
  messageTypeCount?: Record<string, number> | null;
  log: MessageLog[];
}

export type MessageHistoryResponse = ApiResponse<{
  startKey: string | null;
  nextKey: string | null;
  limit: number;
  groupList: Record<string, MessageHistory>;
}>;

export type MessageDetailListResponse = ApiResponse<{
  startKey: string | null;
  nextKey: string | null;
  limit: number;
  messageList: Record<string, MessageDetail>;
}>;

export type MessageTemplateCategory = "GENERAL" | "BIRTHDAY" | "EXPIRED_NOTI";
export interface MessageTemplate {
  uid: number;
  name: string;
  category: MessageTemplateCategory;
  content: string;
}

export interface MessageTemplateList {
  id: number;
  name: string;
  category: MessageTemplate["category"];
  templates: MessageTemplate[];
}

export interface BulkMessagePayload {
  from: string;
  to: string;
  text: string;
}

export type AllowedVariable = "이름" | "생년월일" | "관심지역";
