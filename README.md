# KnowDex AI 🧠

**Agentic AI Research Platform**

KnowDex is a modern, intelligent research workspace designed to help researchers, students, and professionals organize papers, manage knowledge, and interact with their documents using advanced AI models. It combines a sleek, ChatGPT-like interface with powerful RAG (Retrieval-Augmented Generation) capabilities.

## ✨ Features

- **Multi-Model AI Support**: Switch seamlessly between **Gemini 3.0**, **Gemini 3.0 Flash**, and **Llama 3 (via Groq)**.
- **Research Workspaces**: Organize your research into dedicated workspaces.
- **Context-Aware Chat**: Chat with your documents. The AI uses the context of uploaded papers to provide accurate answers.
- **Modern UI/UX**:
  - Clean, responsive design built with **React** and **Tailwind CSS**.
  - **Dark/Light Mode** support.
  - Smooth animations with **Framer Motion**.
- **Paper Management**: Upload, tag, and summarize research papers.
- **Secure Authentication**: User accounts and workspace isolation.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons (Heroicons)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (SQLAlchemy + aiosqlite)
- **AI Integration**: Google GenAI SDK, Groq SDK
- **Authentication**: JWT (OAuth2)

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Clone the Repository

```bash
git clone https://github.com/Abhinav087/KnowDex.git
cd KnowDex
```

### 2. Backend Setup

Navigate to the backend directory, create a virtual environment, and install dependencies.

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the root directory (or `backend/` depending on setup) with the following keys:

```ini
# Database
DATABASE_URL=sqlite:///./knowdex.db

# Security (Generate a strong key)
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# AI API Keys
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Run the Application

You can use the provided script to start both backend and frontend:

**Windows:**
```powershell
./run_app.bat
```

**Manual Start:**

*Backend:*
```bash
cd backend
uvicorn app.main:app --reload
```

*Frontend:*
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

```
KnowDex/
├── backend/            # FastAPI Backend
│   ├── app/
│   │   ├── main.py     # Entry point
│   │   ├── models/     # Database models
│   │   ├── routers/    # API endpoints
│   │   └── services/   # Business logic
│   └── requirements.txt
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages (Dashboard, etc.)
│   │   └── services/   # API client
│   └── tailwind.config.js
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
