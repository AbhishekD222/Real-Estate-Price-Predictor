# 🏙️ UrbanSquare — Real Estate Price Predictor

A premium real estate price prediction SaaS platform built with **Next.js 15** (frontend) and **FastAPI** (backend), powered by a **Random Forest Regressor** trained on the Mumbai House Prices dataset.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Framer Motion |
| Backend | FastAPI, Python 3.11 |
| ML Model | scikit-learn (Random Forest Regressor) |
| Data | Mumbai House Prices (Kaggle) |

---

## 📁 Project Structure

```
real-estate-predictor/
├── backend/          # FastAPI backend + ML model
│   ├── main.py
│   ├── requirements.txt
│   └── MumbaiHousePrices.csv
├── frontend/         # Next.js frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Run

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🌐 Deployment

- **Backend**: Deploy on [Render](https://render.com)
- **Frontend**: Deploy on [Vercel](https://vercel.com)

Set the environment variable `NEXT_PUBLIC_API_URL` in Vercel to your Render backend URL.

---

## 📊 Features

- 🔮 Real-time property price prediction
- 📍 Location-based search with autocomplete
- 💰 Indian numbering system formatting
- 📈 Investment score & market insights
- 🎨 Premium glassmorphism UI with animations