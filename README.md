# 💬 Spur AI Agent - Live Customer Support Agent

[Demo - SPUR-AI-Agent](https://spur-ai-chat-1-1wym.onrender.com/)

A production-ready AI-powered customer support chat system built for e-commerce platforms. This application demonstrates real-time conversation management with persistent chat history, intelligent AI responses, and a polished user experience.

## 🎯 Project Overview

This is a full-stack implementation of an AI live chat agent that simulates a customer support system for a general e-commerce marketplace. The AI agent can handle customer queries about products, shipping, returns, orders, and more - providing helpful, contextual responses in real-time.

### ✨ Key Features

- 🤖 AI responses using OpenAI's GPT-4o-mini
- 💬 Multiple conversations with seamless switching
- 💾 Persistent chat history in SQLite
- 📝 Markdown support (bold, lists, code blocks)
- ⌨️ Typing indicator while AI responds
- 🎨 Message grouping with avatars and timestamps
- 🔄 Optimistic UI updates
- 📱 Responsive design with Tailwind CSS

## 🏗️ Architecture Overview

### Backend Structure

```
backend/
├── src/
│   ├── server.ts           # Express app entry point
│   ├── routes/
│   │   └── chat.ts         # API endpoints for chat operations
│   ├── services/
│   │   ├── chatService.ts  # Business logic for conversations & messages
│   │   └── llm.ts          # OpenAI integration and prompt management
│   ├── db/
│   │   ├── index.ts        # Database initialization
│   │   └── schema.sql      # Database schema definition
│   └── types.ts            # TypeScript type definitions
└── data/
    └── chat.db             # SQLite database file (auto-generated)
```

**Design Decisions:**

- **Layered Architecture**: Clear separation between routes, services, and data layer
- **Service Layer Pattern**: Business logic isolated in services for testability
- **Type Safety**: Comprehensive TypeScript types throughout
- **SQL Over ORM**: Raw SQL with better-sqlite3 for performance and simplicity
- **Error Handling**: Explicit error handling at route level with proper HTTP status codes

### Frontend Structure

```
frontend/
├── src/
│   ├── pages/
│   │   └── ChatPage.tsx           # Main page component
│   ├── components/
│   │   ├── ConversationList.tsx   # Sidebar with chat history
│   │   ├── ChatWindow.tsx         # Main chat container
│   │   ├── MessageList.tsx        # Message display with grouping
│   │   ├── MessageInput.tsx       # Input field with multi-line support
│   │   └── MarkdownRenderer.tsx   # Rich text rendering for AI messages
│   ├── services/
│   │   └── api.ts                 # API client functions
│   ├── lib/
│   │   └── axios.ts               # Axios instance configuration
│   ├── types/
│   │   └── conversation.ts        # TypeScript types
│   └── utils/
│       ├── formatTime.ts          # Time formatting utilities
│       └── formatDateTime.ts      # Date-time formatting utilities
```

**Design Decisions:**

- **Component Composition**: Small, focused components with clear responsibilities
- **Centralized API Layer**: All API calls through a single service module
- **Type Safety**: Shared types between frontend and backend
- **Optimistic UI**: Immediate user feedback before server response
- **State Management**: React hooks only - no external state library needed
- **Clean Architecture**: Clear separation of concerns (UI, API, utils, types)

### Database Schema

```sql
-- Conversations table with activity tracking
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP  -- Updated on every message
);

-- Messages table with foreign key constraint
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  sender TEXT NOT NULL,  -- "user" or "ai"
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend` directory:

   ```env
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Database setup**

   The database is automatically initialized when you first run the server. The schema is applied from `src/db/schema.sql` and creates:
   - `conversations` table
   - `messages` table

   The SQLite database file will be created at `backend/data/chat.db`

5. **Start the server**

   ```bash
   npm run dev
   ```

   The backend will be running at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**

   Create a `.env` file in the `frontend` directory if your backend runs on a different port:

   ```env
   VITE_API_URL=http://localhost:3000/chat
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:5173`

5. **Open the app**

   Visit `http://localhost:5173` in your browser

## 🛠️ Tech Stack

**Backend:** Node.js, Express, TypeScript, SQLite (better-sqlite3), OpenAI API  
**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Axios, react-markdown

## 🎨 Key Implementation Details

### AI Configuration

- **Model**: GPT-4o-mini (fast, cost-effective)
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 500 (concise responses)
- **Context**: Last 20 messages for conversation awareness

### Markdown Rendering

AI responses support GitHub-flavored Markdown:

- Bold, italic text
- Numbered/bulleted lists
- Code blocks with syntax highlighting
- Inline code snippets
- Clickable links

### Smart UI Features

- Message grouping (consecutive same-sender messages)
- Avatars (👤 user, 🤖 AI)
- Timestamps in IST format
- Typing indicator (animated dots)
- Auto-scroll to latest message
- Multi-line input (Shift+Enter for newline)

## 📡 API Endpoints

| Endpoint                          | Method | Description                                       |
| --------------------------------- | ------ | ------------------------------------------------- |
| `/chat/conversations`             | GET    | List all conversations (ordered by last activity) |
| `/chat/conversation`              | POST   | Create new conversation                           |
| `/chat/conversation/:id/messages` | GET    | Get messages for a conversation                   |
| `/chat/message`                   | POST   | Send message and get AI reply                     |

## 🎯 What This Project Demonstrates

✅ **Real LLM Integration** - Not a mock, actual OpenAI API calls  
✅ **Production Patterns** - Proper error handling, validation, type safety  
✅ **Clean Architecture** - Separation of concerns, testable services  
✅ **Persistent State** - Database-backed conversations that survive reloads  
✅ **Polished UX** - Optimistic updates, loading states, markdown rendering  
✅ **Scalable Structure** - Easy to extend with auth, analytics, more channels

## 🔮 If I Had More Time

Here's what I would add next:

- **Delete Conversations** - Add ability to remove old conversations
- **Smart Conversation Titles** - Auto-generate titles based on first message or chat summary
- **Enhanced UI** - More polished animations, better mobile experience, dark/light mode toggle
- **User Authentication** - Login system with personalized chat history
- **Message Search** - Full-text search across conversations
- **File Uploads** - Allow customers to send images/documents
- **Live Agent Handoff** - Escalate complex queries to human support
- **Analytics Dashboard** - Track conversation metrics and AI performance
- **Rate Limiting** - Protect API from abuse
- **WebSocket Support** - Real-time bidirectional communication instead of polling

## 📝 Trade-offs & Decisions

**SQLite vs PostgreSQL**  
Chose SQLite for simplicity and zero config. Perfect for MVP. Would switch to PostgreSQL for production scale.

**Optimistic UI**  
User messages appear instantly before server confirms. Better UX but adds complexity for error handling.

**React Markdown**  
Adds ~50KB to bundle but makes AI responses way more readable with lists, bold text, code blocks.

**No Authentication**  
Focused on core chat functionality. Easy to add later with JWT in Axios interceptor.

**Axios over Fetch**  
Cleaner API, easier error handling, and interceptor support for future auth.

For questions or issues, feel free to open an issue in the repository.
