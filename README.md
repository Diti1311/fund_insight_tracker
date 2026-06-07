# Aureva Fund Insight Tracker

## Live Demo

Frontend: https://fund-insight-tracker.vercel.app/

Backend API: https://fitbackend-2w46.onrender.com

---

## Overview

A full-stack MERN application that allows users to:

* Search Indian Mutual Funds
* View fund details and NAV history
* Add funds to a personal watchlist
* Persist watchlist data in MongoDB
* View NAV performance charts
* Authenticate using JWT-based login

The application uses the MFAPI service as a data source while routing all fund-detail requests through a custom Express backend.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Watchlist Routes

### Fund Search

* Search mutual funds by name
* View scheme code and scheme name
* Add funds directly to watchlist

### Watchlist

* Persistent MongoDB storage
* Duplicate prevention
* Remove funds from watchlist

### Fund Dashboard

* Historical NAV data
* NAV trend chart
* Fund metadata display
* Loading and error states

### Backend Enhancements

* RESTful API design
* Input validation
* Proper HTTP status codes
* CORS configuration
* In-memory caching for fund details

---

## Tech Stack

### Frontend

* React
* TypeScript
* React Router
* Tailwind CSS
* Recharts
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Node Cache

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Project Structure

backend/

* config/
* controllers/
* middleware/
* models/
* routes/
* utils/
* server.js

frontend/

* components/
* contexts/
* pages/
* services/
* App.tsx

---

## Environment Variables

### Backend (.env)

PORT=5000

MONGO_URI=YOUR_MONGODB_ATLAS_URI

JWT_SECRET=YOUR_SECRET_KEY

### Frontend (.env)

VITE_API_URL=https://YOUR-RENDER-URL.onrender.com

---

## API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

### Watchlist

GET /api/watchlist

POST /api/watchlist

DELETE /api/watchlist/:schemeCode

### Funds

GET /api/funds/search?q=axis

GET /api/funds/:schemeCode

---

## Running Locally

### Clone Repository

git clone YOUR_REPOSITORY_URL

cd project

### Backend

cd backend

npm install

npm run dev

### Frontend

cd frontend

npm install

npm run dev

---

## Assumptions

* User authentication is required before accessing watchlist features.
* Fund search and fund detail data are sourced from MFAPI.
* Backend proxies all fund-detail requests.
* MongoDB Atlas is used for persistence.

---

## Known Limitations

* No password reset functionality.
* No email verification.
* Free hosting providers may introduce cold starts.
* MFAPI availability depends on the public service.

---

## Bonus Features Implemented

* JWT Authentication
* Duplicate Watchlist Prevention
* Backend Caching
* Protected Routes
* MongoDB Persistence

---
