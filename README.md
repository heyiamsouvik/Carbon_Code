# Carbon Code- AI Infrastructure Cloud Based Optimizerj

## Overview

A service that provides the optimzed code along with the analysis and improvement based on the analysis to optimize the carbon emission and cloud cost

---

## Features

    Optimized Code Generation
    
    Live 3D Analysis
    
    Multi Language Support

    Reduce Carbon Emission

    Estimate Time Complexity
---

## Tech Stack

### Frontend

React (Vite)

Tailwind CSS

Axios

### Backend

Node.js + Express.js

MongoDB Atlas (Mongoose ORM)

JWT Authentication

CLimatiq API



## 📂 Project Structure
```csharp
back/
│
├── config/
│   └── (DB config, env config, constants, etc.)
│
├── controllers/
│   ├── analyze.controller.js
│   ├── auth.controller.js
│   ├── compare.controller.js
│   └── history.controller.js
│
├── middleware/
│   └── (auth middleware, error handler, etc.)
│
├── models/
│   ├── AnalysisHistory.model.js
│   └── User.js
│
├── routes/
│   ├── analyze.routes.js
│   └── auth.routes.js
│
├── services/
│   ├── ai.service.js
│   ├── carbon.service.js
│   ├── codeAnalysis.service.js
│   ├── compareVersions.service.js
│   ├── email.service.js
│   └── greenScore.js
│
├── node_modules/
│
├── server.js / app.js
│
└── package.json

front/
│
├── src/
│   │
│   ├── assets/
│   │   └── (images, icons, static files)
│   │
│   ├── components/
│   │   ├── Analyzer/
│   │   │   └── (analysis-related UI components)
│   │   │
│   │   ├── common/
│   │   │   └── (Navbar, Footer, reusable UI components)
│   │   │
│   │   └── home/
│   │       └── (home page sections & widgets)
│   │
│   ├── pages/
│   │   ├── Analyzer.jsx
│   │   ├── Demo.jsx
│   │   ├── History.jsx
│   │   └── Home.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── AuthContext.jsx
│   ├── AuthForm.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── .gitignore
├── eslint.config.js
├── package.json
└── package-lock.json

AI_Services
├── app.py│
├── requirements.txt
```

---

## Getting Started
### Backend Setup
```bash
cd back
npm install
```
Create a `.env` file and add Environemental Variable, then run: 
```bash
npm run dev
```

### 🎨 Frontend Setup
```bash
cd front
npm install
npm list vite
npm run dev
```
### 🎨 AI Framework Setup
```bash
cd AI_Services
python -m venv .venv
.\.venv\Scripts\activate
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```


Frontend runs at `http://localhost:5173`
Backend runs at  `http://localhost:5000`

---

## Environment Variables
Backend `.env` file should include:
```ini
PORT=5000
CLIMATIQ_API_KEY=climatiq_api_key
MONGO_URI=mongodb_connection_string
JWT_SECRET=jwt_secret
EMAIL_PASS=email_pass
EMAIL_USER=email_user
```

---

## API Endpoints (Backend)
### Auth

`POST /api/auth/register` → Register new user

`POST /api/auth/login` → Login & get token

### Analyze Code and provide Optimized Code

`GET /api/analyzeCode` → Get Analysis and Optimized Code

### Histories

`GET /api/history/:userId` → See all histories

---



