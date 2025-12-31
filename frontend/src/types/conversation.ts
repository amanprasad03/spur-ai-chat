export type ConversationMeta = {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id?: string;
  sender: string;
  text: string;
  createdAt: string;
};

export type SendMessageRequest = {
  message: string;
  conversationId: number;
};

export type SendMessageResponse = {
  reply: string;
  createdAt: string;
};
