# Placement Eligibility Predictor

## Project Overview
Placement Eligibility Predictor is a React + Vite frontend project enhanced with a Node.js + Express + MongoDB backend for managing placement opportunities.

## Backend Architecture
- Express server entry point: backend/server.js
- Application setup: backend/app.js
- Routes: backend/routes/opportunityRoutes.js
- Controllers: backend/controllers/opportunityController.js
- Mongoose model: backend/models/Opportunity.js
- Database config: backend/config/db.js

## MongoDB Schema
The Opportunity model stores:
- title: String (required)
- company: String (required)
- category: String (required)
- description: String (required)
- status: String (default: Open)
- eligibility: String (required)
- location: String (required)
- deadline: String (required)
- package: String (required)
- timestamps: true

## REST Endpoints
- GET /api/opportunities
- GET /api/opportunities/:id
- POST /api/opportunities
- PUT /api/opportunities/:id
- DELETE /api/opportunities/:id
- GET /api/opportunities/search?name=tech

## Environment Setup
1. Create a MongoDB Atlas cluster and copy the connection string.
2. Create a backend/.env file with:
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/placement-eligibility-predictor?retryWrites=true&w=majority
3. Install backend dependencies: npm install
4. Start the backend: npm run dev

## Postman Testing
The API can be tested in Postman with the above endpoints. Add screenshots of successful GET/POST/PUT/DELETE responses to your documentation.

## Frontend Run Instructions
1. Install dependencies: npm install
2. Start the development server: npm run dev
3. Open the local Vite URL shown in the terminal
