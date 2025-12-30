import db from "../db";
import { Message, Conversation, Sender } from "../types";

export function createConversation(): Conversation {
  const stmt = db.prepare("INSERT INTO conversations DEFAULT VALUES");
  const result = stmt.run();

  const conversation = db
    .prepare("SELECT * FROM conversations WHERE id = ?")
    .get(result.lastInsertRowid) as Conversation;

  return conversation;
}

export function saveMessage(
  conversationId: number,
  sender: Sender,
  text: string
): Message {
  const stmt = db.prepare(
    "INSERT INTO messages (conversation_id, sender, text) VALUES (?, ?, ?)"
  );
  const result = stmt.run(conversationId, sender, text);

  const message = db
    .prepare("SELECT * FROM messages WHERE id = ?")
    .get(result.lastInsertRowid) as Message;

  return message;
}

export function getRecentMessages(
  conversationId: number,
  limit: number = 20
): Message[] {
  const stmt = db.prepare(
    "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?"
  );

  return stmt.all(conversationId, limit) as Message[];
}
