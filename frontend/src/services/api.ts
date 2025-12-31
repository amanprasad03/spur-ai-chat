import axiosInstance from "../lib/axios";
import type {
  ConversationMeta,
  Message,
  SendMessageRequest,
  SendMessageResponse,
} from "../types";

// Get all conversations
export const getConversations = async (): Promise<ConversationMeta[]> => {
  const response = await axiosInstance.get<{
    conversations?: ConversationMeta[];
  }>("/conversations");
  return response.data.conversations ?? [];
};

// Create a new conversation
export const createConversation = async (): Promise<ConversationMeta> => {
  const response = await axiosInstance.post<{
    conversationId: number;
    createdAt?: string;
    updatedAt?: string;
  }>("/conversation");

  if (!response.data.conversationId) {
    throw new Error("Missing conversationId in response");
  }

  return {
    id: response.data.conversationId,
    createdAt: response.data.createdAt ?? new Date().toISOString(),
    updatedAt:
      response.data.updatedAt ??
      response.data.createdAt ??
      new Date().toISOString(),
  };
};

// Get messages for a conversation
export const getMessages = async (
  conversationId: number
): Promise<Message[]> => {
  const response = await axiosInstance.get<{ messages?: Message[] }>(
    `/conversation/${conversationId}/messages`
  );
  return response.data.messages ?? [];
};

// Send a message and get AI reply
export const sendMessage = async (
  data: SendMessageRequest
): Promise<SendMessageResponse> => {
  const response = await axiosInstance.post<SendMessageResponse>(
    "/message",
    data
  );

  return {
    reply:
      response.data.reply?.trim() ||
      "I had trouble generating a response. Please try again.",
    createdAt: response.data.createdAt || new Date().toISOString(),
  };
};
