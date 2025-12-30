import { Router, Request, Response } from "express";
import {
  createConversation,
  saveMessage,
  getRecentMessages,
} from "../services/chatService";
import { generateReply } from "../services/llm";

const router = Router();

router.post("/message", async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim() === "") {
      res
        .status(400)
        .json({ error: "Message is required and cannot be empty" });
      return;
    }

    // Create or reuse conversation
    let conversationId: number;
    if (sessionId && typeof sessionId === "number") {
      conversationId = sessionId;
    } else {
      const conversation = createConversation();
      conversationId = conversation.id;
    }

    // Save user message
    saveMessage(conversationId, "user", message.trim());

    // Get conversation history
    const history = getRecentMessages(conversationId);

    // Generate AI reply
    const aiReply = await generateReply(history, message.trim());

    // Save AI reply
    saveMessage(conversationId, "ai", aiReply);

    // Return response
    res.json({
      reply: aiReply,
      sessionId: conversationId,
    });
  } catch (error) {
    console.error("Error handling chat message:", error);
    res
      .status(500)
      .json({ error: "An error occurred processing your message" });
  }
});

export default router;
