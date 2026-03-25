# GenChat

**AI-Powered Real-Time Collaborative Code Workspace**

GenChat is a full-stack collaborative platform where teams can create projects, chat in real time, and use AI to generate code — all in one workspace. Built with the MERN stack, Socket.IO for real-time communication, and Groq AI for intelligent code generation.

---

## Features

### Authentication & Security
- Email/password registration with email verification (6-digit OTP)
- Google OAuth login
- JWT dual-token system — short-lived access token (15 min) + long-lived refresh token (7 days) with automatic rotation
- Refresh tokens are SHA256-hashed in the database (safe even if DB is compromised)
- Password reset via email with secure hashed tokens
- Protected routes on both frontend and backend

### Project & Collaboration
- Create, rename, and delete projects
- Add collaborators to any project you belong to
- Project-based access control — only members can view/edit
- Real-time collaborator presence via Socket.IO

### Real-Time Chat
- Socket.IO powered real-time messaging within projects
- Project-specific chat rooms with JWT-authenticated connections
- AI trigger — type `@ai` followed by any question or coding request
- AI typing indicator (bouncing dots) while generating responses
- Message auto-scroll and sender avatars

### AI Assistant
- Powered by Groq (LLaMA 3.3-70B model)
- Answers any question — general knowledge, science, history, math, coding
- For coding requests, generates complete project structures with all files (package.json, config, entry point, components, styles)
- AI responses rendered as formatted markdown with syntax-highlighted code blocks
- Generated code appears directly in the file explorer and code editor

### Code Editor
- Built-in file explorer with color-coded file icons by extension
- Tabbed code editor with syntax highlighting (highlight.js)
- Edit AI-generated code directly in the browser
- Copy single file or all project files to clipboard
- Collapsible file explorer sidebar
- File changes auto-saved to database

### Responsive Design
- Fully responsive — works on mobile, tablet, and desktop
- Mobile: tab-based layout switching between Chat and Code views
- Desktop: side-by-side chat + editor workspace
- Scales smoothly across all common screen sizes (1280px to 1920px+)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool and dev server |
| Tailwind CSS 4 | Styling |
| React Router v7 | Client-side routing |
| Framer Motion | Animations and transitions |
| Socket.IO Client | Real-time communication |
| Axios | HTTP client with interceptors |
| highlight.js | Code syntax highlighting |
| markdown-to-jsx | Rendering AI markdown responses |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | Web framework |
| MongoDB + Mongoose | Database and ODM |
| Socket.IO | Real-time WebSocket server |
| Groq SDK | AI model API (LLaMA 3.3-70B) |
| JSON Web Token | Authentication |
| bcrypt | Password hashing |
| Nodemailer | Email service (Gmail SMTP) |
| Google APIs | OAuth2 authentication |

---

## Project Structure

```
GenChat/
├── backend/
│   ├── config/
│   │   ├── ai-connection.js      # Groq AI client and system prompt
│   │   ├── db-connection.js       # MongoDB connection
│   │   ├── gmail-connection.js    # Nodemailer transporter
│   │   ├── google-connection.js   # Google OAuth2 client
│   │   └── socket.js             # Socket.IO server setup and events
│   ├── controllers/
│   │   ├── ai-controller.js       # AI generation endpoint
│   │   ├── project-controller.js  # Project CRUD operations
│   │   └── user-controller.js     # Auth, profile, user management
│   ├── mail/
│   │   ├── email-templates.js     # HTML email templates
│   │   └── emails.js             # Email sending functions
│   ├── middlewares/
│   │   └── auth-middleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── project-model.js       # Project schema
│   │   └── user-model.js         # User schema
│   ├── routes/
│   │   ├── ai-route.js
│   │   ├── project-route.js
│   │   └── user-route.js
│   ├── utils/
│   │   ├── generateAvatar.js      # Username initials generator
│   │   ├── generateTokenAndSetCookies.js  # JWT token creation
│   │   └── generateVerificationCode.js    # 6-digit OTP generator
│   ├── server.js                  # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── project/
│   │   │   │   ├── ChatPanel.jsx        # Chat messages and input
│   │   │   │   ├── CodeEditor.jsx       # Tabbed code editor
│   │   │   │   ├── CollaboratorModal.jsx # Add collaborators modal
│   │   │   │   ├── CollaboratorPanel.jsx # Collaborator list sidebar
│   │   │   │   └── FileExplorer.jsx     # File tree sidebar
│   │   │   ├── FloatingShape.jsx  # Animated background elements
│   │   │   ├── Input.jsx          # Form input with icon
│   │   │   ├── LoadingSpinner.jsx # Loading state component
│   │   │   ├── Navbar.jsx         # Navigation bar with avatar
│   │   │   └── PasswordCriteria.jsx # Password strength meter
│   │   ├── context/
│   │   │   ├── UserContext.jsx     # Auth context
│   │   │   ├── UserProvider.jsx    # Auth state and axios interceptor
│   │   │   ├── ProjectContext.jsx  # Project context
│   │   │   └── ProjectProvider.jsx # Project state and API calls
│   │   ├── pages/
│   │   │   ├── EmailVerificationPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── GoogleCallback.jsx
│   │   │   ├── Home.jsx            # Project list dashboard
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Project.jsx         # Main workspace (chat + editor)
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   └── SignUpPage.jsx
│   │   ├── services/
│   │   │   ├── api.js             # API endpoint URLs
│   │   │   └── socket.js          # Socket.IO client helpers
│   │   ├── App.jsx                # Routes, guards, layouts
│   │   ├── main.jsx               # Entry point with providers
│   │   └── index.css              # Tailwind import
│   ├── vite.config.js
│   └── package.json
│
├── CLAUDE.md
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key ([console.groq.com](https://console.groq.com))
- Gmail App Password (for email verification)
- Google OAuth credentials (for Google login)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/GenChat.git
cd GenChat
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

AI_KEY=your_groq_api_key
```

Start the backend:

```bash
npm run dev    # development with hot reload (nodemon)
npm start      # production
```

The server runs on `http://localhost:8080`.

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend:

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
```

The app runs on `http://localhost:5173`.

---

## API Endpoints

### Authentication (`/user`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/user/register` | No | Create account |
| POST | `/user/login` | No | Login with email/password |
| POST | `/user/logout` | No | Clear session and cookies |
| POST | `/user/verify-email` | No | Verify 6-digit email code |
| POST | `/user/forgot-password` | No | Request password reset email |
| POST | `/user/reset-password/:token` | No | Set new password |
| POST | `/user/google-login` | No | Google OAuth login |
| POST | `/user/refresh` | No | Rotate access and refresh tokens |
| GET | `/user/profile` | Yes | Get current user profile |
| GET | `/user/all` | Yes | Get all users (for collaboration) |

### Projects (`/projects`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/projects/create` | Yes | Create new project |
| GET | `/projects/all` | Yes | Get user's projects |
| GET | `/projects/get-project/:id` | Yes | Get project with collaborators |
| PUT | `/projects/update/:id` | Yes | Rename project (owner only) |
| DELETE | `/projects/delete/:id` | Yes | Delete project (owner only) |
| PUT | `/projects/add-user` | Yes | Add collaborators |
| PUT | `/projects/remove-user` | Yes | Remove collaborator |
| PUT | `/projects/update-file-tree` | Yes | Save file tree |

### AI (`/ai`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/ai/get-result?prompt=...` | Yes | Get AI response |

---

## How It Works

### Authentication Flow
```
Register → Verification email (6-digit code) → Verify → Logged in
Login → If not verified, resend code → Verify → Logged in
Google OAuth → Redirect to Google → Callback → Auto-verified → Logged in
```

Access tokens expire in 15 minutes. The frontend axios interceptor automatically calls `/user/refresh` to get new tokens without interrupting the user.

### Real-Time Chat + AI
```
User types "@ai create a todo app in react"
  → Socket.IO emits to project room
  → Backend strips "@ai" prefix, sends to Groq API
  → Groq returns JSON: { text: "...", fileTree: { ... } }
  → Backend broadcasts AI response to all room members
  → Frontend parses JSON, shows text in chat, loads files in editor
```

### Project Collaboration
```
User creates project → Invites collaborators via modal
  → All members can chat in real-time
  → AI-generated code is shared with all members
  → File edits are saved to database
```

---

## Deployment

### Frontend (Vercel)
The frontend includes a `vercel.json` for SPA routing. Deploy by connecting the `frontend/` directory to Vercel.

### Backend
Deploy to any Node.js hosting (Railway, Render, Fly.io, etc.). Ensure all environment variables are configured.

---

## License

This project is for educational and personal use.
