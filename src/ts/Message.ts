import { ApiResponse } from "./ApiResponse";

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

export interface MessageGroup {
  groupId: string;
  from: string | null;
  type: string | null;
  subject: string | null;
  dateCreated: string;
  dateUpdated: string;
  dateCompleted?: string;
  statusCode: string | null;
  status: string;
  to: string | null;
  text: string | null;
  messageId: string | null;
  count?: MessageCount;
  messageTypeCount?: Record<string, number> | null;
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
  statusCode: string | null;
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
  groupList: Record<string, MessageGroup>;
}>;

export type MessageDetailListResponse = ApiResponse<{
  startKey: string | null;
  nextKey: string | null;
  limit: number;
  messageList: Record<string, MessageDetail>;
}>;
