export type Sender = "user" | "ai";

export interface Message {
  id: number;
  conversation_id: number;
  sender: Sender;
  text: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  created_at: string;
}
