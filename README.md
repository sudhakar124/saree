# Saree Shopping Website

A full-stack e-commerce application for sarees built with FastAPI and Next.js.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Axios, Lucide React
- **Backend**: FastAPI (Python), SQLAlchemy ORM, PostgreSQL, JWT Authentication

## Project Structure
```text
saree/
├── backend/          # FastAPI Backend
│   ├── app/          # Core logic
│   └── requirements.txt
└── frontend/         # Next.js Frontend
    ├── src/          # Source code
    └── package.json
```

## Setup Instructions

### Backend Setup
1. Navigate to the `backend/` folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your PostgreSQL database in `.env`:
   ```text
   DATABASE_URL=postgresql://user:password@localhost:5432/your_db
   SECRET_KEY=your_secret_key
   ```
4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features
- **User Authentication**: Secure register and login flow using JWT.
- **Product Listing**: Browse premium sarees with beautiful card layouts.
- **Product Details**: View detailed descriptions and high-quality images.
- **Shopping Cart**: Add/remove items and calculate total order value.
- **Responsive Design**: Optimized for mobile and desktop screens.
