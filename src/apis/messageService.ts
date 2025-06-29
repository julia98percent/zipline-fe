import apiClient from "@apis/apiClient";
import {
  MessageDetail,
  MessageGroup,
  MessageHistoryResponse,
  MessageDetailListResponse,
} from "@ts/Message";

export interface Template {
  uid: number;
  name: string;
  content: string;
  category: string;
}

export interface TemplateResponse {
  success: boolean;
  code: number;
  message: string;
  data: Template[];
}

export interface BulkMessagePayload {
  from: string;
  to: string;
  text: string;
}

export const fetchMessages = async (): Promise<MessageGroup[]> => {
  try {
    const { data: response } = await apiClient.get<MessageHistoryResponse>(
      "/messages"
    );

    if (response.success && response.code === 200 && response.data?.groupList) {
      return Object.values(response.data.groupList || {});
    }
    return [];
  } catch (error: unknown) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
};

export const fetchMessageList = async (
  groupId: string
): Promise<MessageDetail[]> => {
  try {
    const { data: response } = await apiClient.get<MessageDetailListResponse>(
      `/messages/${groupId}`
    );
    console.log(response);
    if (
      response.success &&
      response.code === 200 &&
      response.data?.messageList
    ) {
      return Object.values(response.data.messageList || {});
    }
    return [];
  } catch (error: unknown) {
    console.error("Failed to fetch message list:", error);
    return [];
  }
};

export const fetchTemplates = async (): Promise<Template[]> => {
  try {
    const { data: response } = await apiClient.get<TemplateResponse>(
      "/templates"
    );

    if (response.success && response.code === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch templates:", response.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
};

export const sendBulkMessages = async (
  payload: BulkMessagePayload[]
): Promise<boolean> => {
  try {
    await apiClient.post("/messages", payload);
    return true;
  } catch (error) {
    console.error("Error sending bulk messages:", error);
    return false;
  }
};
