# GENCHAT 🚀  
**AI-Powered Real-Time Collaborative Chat & Code Workspace**

GENCHAT is a full-stack collaborative platform that brings together real-time messaging, project collaboration, browser-based code editing, and AI-powered assistance into a single unified workspace. It enables teams to create projects, collaborate securely, chat in real time, run code in the browser, and use AI to generate content, code, and solutions efficiently.

---

## ✨ Features

- 🔐 **Authentication & Security**
  - User registration & login
  - JWT-based authentication
  - Redis-powered session handling
  - Protected frontend routes and backend APIs

- 👥 **Project & Collaboration**
  - Create and manage projects
  - Add collaborators to projects
  - Fetch users and projects
  - Project-based access control

- 💬 **Real-Time Messaging**
  - Socket.IO based real-time chat
  - Project-specific socket rooms
  - Authenticated socket middleware
  - Reliable message broadcasting and UI updates

- 🤖 **AI Integration**
  - Gemini API integration
  - Prompt engineering for high-quality responses
  - AI-assisted task execution and conversations
  - Structured AI responses with examples

- 🧠 **Modern Frontend Architecture**
  - React with Context API
  - React Router DOM for routing
  - User context and authentication state
  - Clean UI with modals and side panels

- 🧑‍💻 **In-Browser Code Workspace**
  - File tree management
  - Code editor with syntax highlighting
  - WebContainer API integration
  - Run code directly in the browser
  - Iframe-based preview support
  - Run-process management and file updates

---

## 🛠️ Tech Stack

**Frontend**
- React
- React Router DOM
- Context API
- Socket.IO Client
- WebContainer API

**Backend**
- Node.js
- Express.js
- MongoDB & Mongoose
- Redis
- JWT Authentication
- Socket.IO

**AI**
- Gemini API
- Prompt Engineering

---

## 📁 Project Structure

```yaml
GENCHAT/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── socket/
│   └── app.js
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   └── App.jsx
└── README.md
