# CollabBoard — Collaborative Kanban Platform

## Week 2 — Working REST APIs with Mock Data Integrated with Frontend

CollabBoard is a collaborative Kanban-style task management application developed as part of the Full Stack Application project.

This repository contains the **Week 2 implementation**, extending the Week 1 static React frontend with a working **Node.js + Express REST API** using temporary/mock server-side data.

The Week 2 milestone focuses on connecting the frontend application with the backend API, implementing authentication, protected API routes, project and task operations, user management, activity data, calendar operations, and frontend-backend integration.

---

# Week 2 Objectives

The main objectives completed during Week 2 are:

* Extend the Week 1 React frontend
* Create a Node.js backend
* Create an Express REST API
* Implement authentication endpoints
* Implement JWT-based authentication
* Implement authentication middleware
* Create protected API routes
* Create project REST API endpoints
* Create task REST API endpoints
* Create user REST API endpoints
* Create activity REST API endpoints
* Create calendar REST API endpoints
* Integrate frontend API services with the backend
* Connect the React application to the REST API
* Replace frontend-only operations with API requests where implemented
* Handle API authentication using JWT bearer tokens
* Implement manager/admin authorization for project management operations
* Use temporary/mock server-side data for Assignment 02
* Test REST APIs using Postman
* Test frontend-backend integration
* Maintain the GitHub branch and commit workflow

The Week 2 implementation corresponds to the **Assignment 02 — Working REST APIs (with mock data) Integrated with Frontend** milestone.

---

# Technical Stack

## Frontend

**React 18** — Frontend framework
**Vite** — Development and build tool
**React Router v6** — Frontend routing
**Tailwind CSS** — Styling
**Lucide React** — Icons
**Framer Motion** — Animations
**React Context API** — Application state
**Axios** — Frontend HTTP/API communication
**localStorage** — Client-side token/session persistence

## Backend

**Node.js** — Backend runtime
**Express.js** — REST API framework
**JWT** — Authentication
**CORS** — Frontend-backend communication
**dotenv** — Environment variable configuration

## API Testing

**Postman** — REST API testing and endpoint verification

## Data

The Assignment 02 implementation uses **temporary/mock server-side data**.

MongoDB/Mongoose database persistence is outside the current Assignment 02 scope and is planned for a later milestone.

---

# Week 2 Architecture

The application now follows a client-server architecture.

```text
                    CollabBoard
                         │
              ┌──────────┴──────────┐
              │                     │
          Frontend              Backend
          React/Vite            Node/Express
              │                     │
              │ Axios               │
              └──────────API─────────┘
                                    │
                              REST Endpoints
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
             Authentication      Projects           Tasks
                 │                  │                  │
               Users            Activities         Calendar
                                    │
                              Mock Server Data
```

The React frontend communicates with the Express backend through REST API endpoints.

JWT bearer authentication is used to protect application endpoints.

---

# Project Structure

The Week 2 project contains both the frontend and backend applications.

```text
CollabBoard/
│
├── client/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── api/
│       │   ├── api.js
│       │   ├── authApi.js
│       │   ├── projectApi.js
│       │   ├── taskApi.js
│       │   ├── userApi.js
│       │   └── activityApi.js
│       │
│       ├── components/
│       │   ├── layout/
│       │   └── modals/
│       │
│       ├── context/
│       │   ├── AppContext.jsx
│       │   └── AuthContext.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── Projects.jsx
│       │   ├── Tasks.jsx
│       │   ├── Kanban.jsx
│       │   ├── Team.jsx
│       │   ├── Calendar.jsx
│       │   ├── Activity.jsx
│       │   └── Settings.jsx
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   ├── activityController.js
│   │   └── calendarController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   ├── activityRoutes.js
│   │   └── calendarRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Activity.js
│   │
│   ├── store.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── docs/
│
├── package.json
├── README.md
└── .gitignore
```

> The exact directory structure should be kept synchronized with the actual repository. If a file or folder is not present in the final GitHub repository, remove it from this README.

---

# REST API

The backend provides REST API endpoints for the main CollabBoard functionality.

## API Base URL

During local development:

```text
http://localhost:5000/api
```

---

# API Health Check

### GET

```text
GET /api
```

This endpoint is used to verify that the backend server and REST API are running correctly.

Example:

```text
http://localhost:5000/api
```

---

# Authentication API

## Register

```text
POST /api/auth/register
```

Creates a new user account.

## Login

```text
POST /api/auth/login
```

Authenticates a user and returns an authentication token.

## Current User

```text
GET /api/auth/me
```

Returns information about the currently authenticated user.

This endpoint requires a valid JWT bearer token.

---

# Project API

## Get Projects

```text
GET /api/projects
```

Retrieves available projects.

## Create Project

```text
POST /api/projects
```

Creates a new project.

Project management operations are protected using authentication and the appropriate manager/admin authorization.

---

# Task API

## Get Tasks

```text
GET /api/tasks
```

Retrieves tasks.

## Create Task

```text
POST /api/tasks
```

Creates a new task.

Task operations support the Kanban workflow and frontend task management interface.

The frontend communicates task changes through the task API service.

---

# User API

## Get Users

```text
GET /api/users
```

Retrieves CollabBoard users.

The frontend uses the user API to display team member information and related user data.

---

# Activity API

## Get Activities

```text
GET /api/activities
```

Retrieves recent workspace activity.

The frontend loads activity information through the activity API service.

---

# Calendar API

Calendar operations are provided through the calendar REST API.

```text
/api/calendar
```

The calendar API supports the calendar and reminder functionality displayed in the frontend.

---

# Authentication

CollabBoard uses **JWT bearer authentication** for protected API endpoints.

The general authentication flow is:

```text
User
 │
 │ Login
 ▼
React Frontend
 │
 │ POST /api/auth/login
 ▼
Express API
 │
 │ Validate credentials
 ▼
JWT Token
 │
 ▼
Frontend
 │
 │ Store authentication token
 ▼
Protected API Requests
 │
 │ Authorization: Bearer <token>
 ▼
Auth Middleware
 │
 ▼
Protected Controller
```

The authentication middleware verifies the JWT before allowing access to protected resources.

---

# Frontend API Integration

The Week 2 frontend communicates with the backend using Axios-based API services.

The frontend contains separate API service modules for different application areas, including:

```text
authApi
projectApi
taskApi
userApi
activityApi
```

The API client is responsible for:

* Sending HTTP requests
* Communicating with the Express server
* Sending JSON request data
* Attaching JWT authentication tokens
* Handling API responses
* Handling authentication errors

---

# Week 2 Features

## 1. Login and Authentication

The login interface from Week 1 has been integrated with the backend authentication API.

Users can:

* Enter their credentials
* Send login requests to the backend
* Receive an authentication token
* Access protected application functionality
* Retrieve their authenticated user information

---

## 2. Dashboard

The dashboard provides an overview of the workspace.

It includes:

* Navigation sidebar
* Top navigation
* Search interface
* Dashboard statistics
* Projects
* Tasks
* Kanban board
* Team members
* Recent activity

Dashboard data can now be obtained through the backend API where implemented.

---

## 3. Projects

The Projects page provides project management functionality.

The frontend communicates with:

```text
GET /api/projects
POST /api/projects
```

Projects are retrieved from the backend mock data store and new projects can be submitted through the REST API.

---

## 4. Tasks

The task management functionality has been integrated with the backend.

The frontend communicates with:

```text
GET /api/tasks
POST /api/tasks
```

The Kanban interface displays tasks according to their workflow status.

---

## 5. Kanban Board

The Kanban board contains:

```text
TO DO
   │
   ▼
DOING
   │
   ▼
DONE
```

Tasks are displayed using reusable task cards.

The frontend uses the task API to communicate task-related operations with the backend.

---

## 6. Team Members

The Team Members page displays users retrieved through the user API.

```text
GET /api/users
```

This provides the frontend with user information required for the workspace interface.

---

## 7. Workspace Activity

The activity page displays recent workspace activities.

```text
GET /api/activities
```

Activity information is retrieved through the backend API rather than relying only on the original static frontend data.

---

## 8. Calendar and Reminders

The application includes a calendar and reminder interface.

Calendar operations are provided through the backend calendar API.

---

## 9. Settings

The Settings page provides the application's settings interface and user-related options.

---

# Mock Data

Assignment 02 uses **temporary/mock server-side data**.

The backend maintains application data in a server-side store instead of a permanent database.

The current mock data covers areas such as:

* Users
* Projects
* Tasks
* Activities

This approach allows the team to demonstrate working REST API communication before introducing permanent database persistence.

---

# Postman API Testing

The REST APIs are tested using **Postman**.

The Postman collection contains requests for the major backend operations.

Example collection structure:

```text
CollabBoard API
│
├── Health Check
│
├── Authentication
│   ├── Register
│   ├── Login
│   └── Current User
│
├── Projects
│   ├── Get Projects
│   └── Create Project
│
├── Tasks
│   ├── Get Tasks
│   └── Create Task
│
├── Users
│   └── Get Users
│
├── Activities
│   └── Get Activities
│
└── Calendar
    └── Calendar Operations
```

Postman is used to verify:

* HTTP methods
* Request URLs
* Request bodies
* Authentication headers
* Response status codes
* Response JSON data
* Protected endpoints

---

# Running the Application

## Prerequisites

Install the following software:

* Node.js
* npm
* Git

Postman is recommended for API testing.

---

# Clone the Repository

Clone the team's GitHub repository:

```bash
git clone https://github.com/CollabBoard-Team-Full-Stack-Development/CollabBoard-Full-Stack-Development-Commits.git
```

Navigate into the project:

```bash
cd CollabBoard-Full-Stack-Development-Commits
```

---

# Install Backend Dependencies

Open a terminal and navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

# Configure Backend Environment

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Use the actual environment variables required by the final project configuration.

Do not commit private secrets to GitHub.

---

# Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

The API base URL is:

```text
http://localhost:5000/api
```

---

# Install Frontend Dependencies

Open another terminal.

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

---

# Start the Frontend

Run:

```bash
npm run dev
```

Vite will display the local development address.

The frontend is normally available at:

```text
http://localhost:5173
```

Open the displayed address in a web browser.

---

# Running Frontend and Backend Together

The application requires both services to be running.

```text
Terminal 1
──────────
Backend
npm run dev
        │
        ▼
localhost:5000


Terminal 2
──────────
Frontend
npm run dev
        │
        ▼
localhost:5173
```

The React frontend communicates with the Express backend through the configured API/proxy.

---

# Testing

Week 2 testing focuses on both backend REST APIs and frontend-backend integration.

The team checks:

* Backend server starts successfully
* API health check responds successfully
* User registration works
* User login works
* JWT authentication works
* Protected endpoints reject unauthenticated requests
* Authenticated requests are accepted
* Projects can be retrieved
* Projects can be created
* Tasks can be retrieved
* Tasks can be created
* Users can be retrieved
* Activities can be retrieved
* Calendar functionality works
* Frontend successfully communicates with the backend
* Dashboard loads correctly
* Projects page loads correctly
* Tasks page loads correctly
* Kanban board loads correctly
* Team Members page loads correctly
* Calendar page loads correctly
* Activity page loads correctly
* Settings page loads correctly
* Employee dashboard loads correctly
* No major console errors occur
* No broken API requests remain

---

# Production Build

The frontend production build can be checked using:

```bash
npm run build
```

A successful build confirms that the frontend can be compiled without major build errors.

---

# GitHub Team Workflow

The Week 2 project continues to use a branch-based Git workflow.

```text
main
│
├── member-01
├── member-02
├── member-03
├── member-04
├── member-05
├── member-06
├── member-07
├── member-08
└── member-09
```

Each team member contributes through their assigned branch.

Completed work is committed and pushed to GitHub before integration into the main branch.

The repository history should contain contributions from all nine team members.

---

# Assignment 02 Git Tag

The required Git tag for Assignment 02 is:

```text
assignment-02-rest-api
```

The tag represents:

```text
Assignment 02 - Working REST APIs
(with mock data)
Integrated with Frontend
```

The final tagged commit should contain the integrated frontend and backend implementation.

Before submission, verify that:

* The tag exists on GitHub
* The tag points to the final Assignment 02 commit
* All required frontend and backend files are included
* Each team member has a visible contribution/commit
* The final integrated project can be run successfully

---



# Assignment 02 API Endpoints

| Module       | Method | Endpoint             |
| ------------ | ------ | -------------------- |
| Health       | GET    | `/api`               |
| Register     | POST   | `/api/auth/register` |
| Login        | POST   | `/api/auth/login`    |
| Current User | GET    | `/api/auth/me`       |
| Projects     | GET    | `/api/projects`      |
| Projects     | POST   | `/api/projects`      |
| Tasks        | GET    | `/api/tasks`         |
| Tasks        | POST   | `/api/tasks`         |
| Users        | GET    | `/api/users`         |
| Activities   | GET    | `/api/activities`    |
| Calendar     | API    | `/api/calendar`      |

The documented Assignment 02 report includes the health check, authentication, project, task, user and activity endpoints listed above.

---

# Documentation and Evidence

The Assignment 02 documentation includes evidence of:

* REST API implementation
* Postman API testing
* Authentication
* Project API
* Task API
* User API
* Activity API
* Frontend-backend integration
* Login page
* Manager dashboard
* Projects page
* All Tasks page
* Kanban board
* Team Members page
* Calendar and reminders
* Workspace activity
* Settings page
* Employee dashboard

---

# Week 2 Scope

This repository represents the **Week 2 Assignment 02 implementation**.

The main focus of this milestone is:

```text
Working REST APIs
        +
Mock Server Data
        +
React Frontend Integration
        +
JWT Authentication
        +
API Testing
```

The current implementation deliberately uses temporary/mock server-side data.

The following areas are outside the current Assignment 02 scope and are planned for later milestones:

* MongoDB/Mongoose persistent database
* Automated testing and CI
* Full real-time synchronization
* Other later project milestones

---

# Assignment 02 Completion Checklist

| Requirement                  | Status                     |
| ---------------------------- | -------------------------- |
| React frontend               | Completed                  |
| Node.js backend              | Completed                  |
| Express REST API             | Completed                  |
| Mock server-side data        | Completed                  |
| Authentication API           | Completed                  |
| JWT authentication           | Completed                  |
| Protected API routes         | Completed                  |
| Project API                  | Completed                  |
| Task API                     | Completed                  |
| User API                     | Completed                  |
| Activity API                 | Completed                  |
| Calendar API                 | Completed                  |
| Frontend API integration     | Completed                  |
| Postman API testing          | Completed                  |
| Frontend-backend integration | Completed                  |
| GitHub repository            | Completed                  |
| README documentation         | Completed                  |

---

# Project Status

**Milestone:** Assignment 02 — Working REST APIs (with mock data) Integrated with Frontend

**Status:** Week 2 Development Completed

**Application:** CollabBoard

**Architecture:** React + Node.js + Express REST API

**Authentication:** JWT Bearer Authentication

**Data Source:** Temporary/Mock Server-Side Data

**API Testing:** Postman

**Team Size:** 9 Members
