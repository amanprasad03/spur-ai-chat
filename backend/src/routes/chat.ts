import { Router, Request, Response } from "express";
import {
  createConversation,
  getConversation,
  listConversations,
  listMessages,
  saveMessage,
  getRecentMessages,
} from "../services/chatService";
import { generateReply } from "../services/llm";

const router = Router();

router.get("/conversation/:id/messages", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid conversation id" });
    return;
  }

  const conversation = getConversation(id);

  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  const messages = listMessages(conversation.id).map((message) => ({
    id: message.id,
    sender: message.sender,
    text: message.text,
    createdAt: message.created_at,
  }));

  res.json({ messages });
});

router.get("/conversations", (_req: Request, res: Response) => {
  try {
    const conversations = listConversations().map((conversation) => ({
      id: conversation.id,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    }));

    res.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.post("/conversation", (req: Request, res: Response) => {
  try {
    const conversation = createConversation();
    res.status(201).json({
      conversationId: conversation.id,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.post("/message", async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim() === "") {
      res
        .status(400)
        .json({ error: "Message is required and cannot be empty" });
      return;
    }

    const id = conversationId;

    if (typeof id !== "number" || !Number.isFinite(id)) {
      res.status(400).json({ error: "conversationId is required" });
      return;
    }

    const conversation = getConversation(id);

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    // Save user message
    saveMessage(conversation.id, "user", message.trim());

    // Get conversation history
    const history = getRecentMessages(conversation.id);

    // Get API key from header (user-provided) or use env variable
    const apiKey = req.headers["x-openai-key"] as string | undefined;

    // Generate AI reply
    const aiReply = await generateReply(history, message.trim(), apiKey);

    // Save AI reply
    const aiMessage = saveMessage(conversation.id, "ai", aiReply);

    // Return response with message timestamp
    res.json({
      reply: aiReply,
      createdAt: aiMessage.created_at,
    });
  } catch (error) {
    console.error("Error handling chat message:", error);
    res
      .status(500)
      .json({ error: "An error occurred processing your message" });
  }
});

export default router;
