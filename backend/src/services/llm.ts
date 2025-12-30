import OpenAI from "openai";
import { Message } from "../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful e-commerce customer support agent. 
You assist customers with their orders, questions, and concerns.

Here is important information to help customers:

Shipping:
- Standard shipping takes 5-7 business days
- Express shipping takes 2-3 business days
- Free shipping on orders over $50

Returns:
- 30-day return policy for most items
- Items must be unused and in original packaging
- Refunds processed within 7-10 business days

Support Hours:
- Monday-Friday: 9 AM - 6 PM EST
- Saturday: 10 AM - 4 PM EST
- Sunday: Closed

Be friendly, concise, and helpful. If you don't know something, be honest about it.`;

export async function generateReply(
  conversationHistory: Message[],
  userMessage: string
): Promise<string> {
  try {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add conversation history
    for (const msg of conversationHistory) {
      messages.push({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      });
    }

    // Add the latest user message
    messages.push({
      role: "user",
      content: userMessage,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = response.choices[0]?.message?.content;

    if (!reply) {
      return "I apologize, but I'm having trouble generating a response right now. Please try again.";
    }

    return reply;
  } catch (error) {
    console.error("LLM API error:", error);
    return "I'm sorry, I'm experiencing technical difficulties. Please try again in a moment, or contact our support team directly.";
  }
}
