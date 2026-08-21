# Lesson 3 (BE) — Express + MongoDB + Mongoose

CareerMate AI backend API. Built with Express, Mongoose, and MVC-style layers.

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

## Getting started

```bash
cd "KitmanYiu/Lesson3(BE)"
npm install
cp .env.example .env
npm run dev      # http://localhost:3000
```

## Environment variables

Copy `.env.example` to `.env` and update as needed:

| Variable      | Description                         |
| ------------- | ----------------------------------- |
| `PORT`        | Server port (default: 3000)         |
| `MONGODB_URI` | MongoDB connection string           |
| `JWT_SECRET`  | Secret key for signing login tokens |

## Scripts

| Command       | Description                   |
| ------------- | ----------------------------- |
| `npm run dev` | Start dev server with nodemon |
| `npm start`   | Start production server       |

## API endpoints

| Method | Path                   | Body                  | Success               |
| ------ | ---------------------- | --------------------- | --------------------- |
| `GET`  | `/api/health`          | —                     | `{ status: "ok" }`    |
| `POST` | `/api/register`        | `{ email, password }` | `201` account created |
| `POST` | `/api/login`           | `{ email, password }` | `200` message + token |
| `POST` | `/api/forgot-password` | `{ email }`           | `200` reset message   |

## Example curl commands

```bash
# Health check
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Forgot password
curl -X POST http://localhost:3000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Project structure (MVC + Service)

```text
src/
├── server.js              # Entry point
├── app.js                 # Express app + middleware
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── User.js            # Mongoose schema (Model)
├── controllers/
│   └── authController.js  # Request/response (Controller)
├── services/
│   └── authService.js     # Business logic (Service)
├── routes/
│   └── authRoutes.js      # URL mapping
└── middleware/
    └── errorHandler.js    # Error handling
```

## Layer responsibilities

| Layer          | Job                                        |
| -------------- | ------------------------------------------ |
| **Routes**     | Map URLs to controller functions           |
| **Controller** | Handle HTTP request/response only          |
| **Service**    | Business logic (hash password, login, JWT) |
| **Model**      | Database schema and queries (Mongoose)     |

## Related lessons

- **Lesson 2 (FE)** — React frontend at `KitmanYiu/Lesson2(FE)/`

//Flow backend
// 1. package.json L7 (entry file)
// 2. server.js (startup the server)
// 3. app (application logic)
// 4. authRoutes.js (handles urls and redirect to controller)  
// 5. controllers (handles the request and response)
// 6. services (handles business logic)
// 7. model(database)

==========================================================
GOAL()
Create a resume RESTFUL endpoint

# Restful endpoint standard

Get One Resume

- /resume/:id (1,2,3) , GET

//1. create a endpoint
//2.

Get All resume

- /resume , GET

Create a resume

- /resume, POST

Delete a resume

- /resume/:id, DELETE

Edit a resume

- /resume/:id , POST
