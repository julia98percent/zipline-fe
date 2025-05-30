import apiClient from "@apis/apiClient";
import {
  MessageDetail,
  MessageGroup,
  MessageHistoryResponse,
  MessageDetailListResponse,
} from "@ts/Message";

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
