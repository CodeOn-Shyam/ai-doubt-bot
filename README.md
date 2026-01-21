# 🤖 AI Doubt Bot – AI-Powered Doubt Solving Platform

An **AI-powered education platform** that allows teachers to upload course materials and enables students to ask doubts, with answers generated **strictly from teacher-provided content** using a **Retrieval-Augmented Generation (RAG)** approach.

---

## 📌 Problem Statement

Students often struggle to clarify doubts from course materials outside classroom hours. Teachers also face repetitive questions that could be answered automatically if grounded in official study material.

There is a need for a system that:
- Answers student doubts accurately
- Uses only verified teacher-provided content
- Avoids hallucinated or unrelated AI responses

---

## 💡 Solution Overview

This project implements a **RAG-based AI system** where:

1. Teachers upload documents (PDF/DOCX)
2. Documents are converted into text and chunked
3. Embeddings are generated using **Google Gemini**
4. FAISS is used for semantic similarity search
5. Student questions retrieve relevant content
6. Gemini generates answers **only from retrieved context**

---

## 🏗️ System Architecture

```

Browser
↓
Flask Application (Render)
├── HTML Frontend (Jinja + JS)
├── JWT Authentication
├── Course & Document APIs
├── Gemini AI (Generation + Embeddings)
├── FAISS Vector Store (Persistent)
└── Database (SQLite / PostgreSQL-ready)

```

---

## 👥 User Roles

### 👨‍🏫 Teacher
- Register and login
- Create courses
- Upload course documents
- Manage course content

### 👨‍🎓 Student
- Register and login
- Enroll in courses
- Ask doubts via AI chat
- Receive context-aware answers

---

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (Teacher / Student)
- Secure password hashing (Werkzeug)
- API keys managed using environment variables

---

## 🧠 AI & RAG Implementation

| Component | Technology |
|---------|-----------|
| Embeddings | `text-embedding-004` (Gemini) |
| Chat Model | `gemini-1.5-flash` |
| Vector Store | FAISS |
| Chunk Size | ~500 characters |
| Similarity Metric | L2 Distance |
| Persistence | Disk-based FAISS storage |

The AI is instructed to:
- Answer **only from retrieved context**
- Respond with *"Not covered in uploaded material"* when no relevant context is found

---

## ⚙️ Tech Stack

### Backend
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended

### Frontend
- Flask Templates (HTML + JavaScript)
- No React (lightweight and deployment-friendly)

### AI & Data
- Google Gemini API
- FAISS
- NumPy

### Database
- SQLite (Development)
- PostgreSQL-ready (Production)

### Deployment
- Render
- Gunicorn
- Persistent Disk for FAISS

---

## 📁 Project Structure

```

ai-doubt-bot/
├── app.py
├── extensions.py
├── requirements.txt
├── render.yaml
├── templates/
├── static/
├── routes/
├── models/
├── utils/
├── ai/
│   ├── embeddings.py
│   ├── loader.py
│   └── rag.py
└── uploads/

```

---

## 🚀 Key Features

- User registration & login
- Role-based dashboards
- Course creation & enrollment
- Document upload & indexing
- AI-powered doubt resolution
- Persistent embeddings across restarts
- Production-ready deployment setup

---

## ☁️ Deployment Details

- Hosted on **Render**
- Environment variables used for secrets
- FAISS index stored using persistent disk
- Gunicorn used as production server

---

## 📈 Future Enhancements

- Switch SQLite → PostgreSQL
- Show document/page citations in AI answers
- Admin role support
- UI enhancements (Tailwind CSS)
- React / Next.js frontend
- Analytics for common doubts
---
## 📎 Conclusion

This project demonstrates:
- Secure backend development
- Practical AI integration
- Real-world RAG implementation
- Cloud deployment readiness
- Clean, scalable architecture
