# CollabBoard — Collaborative Kanban Platform

CollabBoard is a collaborative Kanban-style task management application developed as part of the Full Stack Application project.

This repository contains the **Week 3 implementation**, extending the Week 2 REST API application by introducing **MongoDB database persistence using Mongoose** and improving the application's **offline caching and data recovery capabilities**.

The Week 3 milestone focuses on replacing temporary server-side mock data with persistent MongoDB data, implementing Mongoose models, connecting the Express backend to MongoDB Atlas, seeding the database with initial data, maintaining authenticated API access, and supporting frontend data caching for offline use.

---

# Week 3 — MongoDB Persistence and Offline Support

## Week 3 Objectives

The main objectives completed during Week 3 are:

* Extend the Week 2 REST API implementation
* Connect the backend to MongoDB Atlas
* Configure Mongoose
* Create MongoDB/Mongoose data models
* Replace temporary mock data with persistent database data
* Implement persistent users
* Implement persistent projects
* Implement persistent tasks
* Implement persistent activities
* Implement persistent calendar events
* Maintain JWT authentication with MongoDB users
* Protect authenticated API routes
* Implement database-backed CRUD operations
* Implement MongoDB references between collections
* Populate related users and project data
* Seed the MongoDB database with initial CollabBoard data
* Integrate MongoDB-backed APIs with the React frontend
* Implement frontend local caching
* Support offline access using cached application data
* Refresh cached data when the application reconnects
* Preserve cached data when the backend is temporarily unavailable
* Test MongoDB-backed REST APIs using Postman
* Verify frontend-backend-database integration
* Maintain the GitHub branch and commit workflow

The Week 3 implementation corresponds to the **Assignment 03 — MongoDB/Mongoose Database Integration and Persistence** milestone.

---

# Technical Stack

## Frontend

* **React 18**
* **Vite**
* **React Router v6**
* **Tailwind CSS**
* **Lucide React**
* **Framer Motion**
* **React Context API**
* **Axios**
* **localStorage**
* **Session/Local Storage authentication token persistence**

## Backend

* **Node.js**
* **Express.js**
* **Mongoose**
* **MongoDB Atlas**
* **JWT**
* **bcryptjs**
* **CORS**
* **dotenv**

## Database

* **MongoDB Atlas**
* **MongoDB database:** `CollabBoard`
* Mongoose schemas and models
* Persistent MongoDB collections

## API Testing

* **Postman**

---

# Week 3 Architecture

The Week 3 architecture extends the Week 2 client-server system by adding MongoDB persistence.

```text
                         CollabBoard
                              │
                ┌─────────────┴─────────────┐
                │                           │
           Frontend                     Backend
          React/Vite                 Node/Express
                │                           │
                │ Axios                     │
                └────────── API ────────────┘
                                            │
                                     Authentication
                                            │
                                      JWT Middleware
                                            │
                                      Controllers
                                            │
                                        Mongoose
                                            │
                                      MongoDB Atlas
                                            │
                         ┌──────────────────┼──────────────────┐
                         │                  │                  │
                       Users            Projects             Tasks
                         │                  │                  │
                         └──────────── Activities ─────────────┘
                                            │
                                      Calendar Events
```

The React frontend communicates with the Express REST API.

The Express backend uses Mongoose to communicate with MongoDB Atlas.

MongoDB provides persistent storage for application data.

---

# Database Architecture

Week 3 introduces MongoDB as the permanent data persistence layer.

The main database collections are:

```text
CollabBoard
│
├── users
├── projects
├── tasks
├── activities
└── calendarevents
```

These collections replace the temporary in-memory/mock server-side data used during Week 2.

---

# MongoDB Atlas

The project uses **MongoDB Atlas** for cloud database hosting.

The backend connects to MongoDB Atlas through the environment variable:

```env
MONGODB_URI=your_mongodb_connection_string
```

The database connection is handled through:

```text
server/src/config/db.js
```

The application uses Mongoose to establish the database connection.

---

# Mongoose Models

The backend contains Mongoose models for the main application entities.

```text
server/src/models/
│
├── User.js
├── Project.js
├── Task.js
├── Activity.js
└── CalendarEvent.js
```

## User Model

The User model stores authentication and team-member information.

Main fields include:

* name
* email
* passwordHash
* role
* jobTitle
* department
* status
* avatar
* bio
* tasksCompleted
* activeTasks
* isActive
* createdAt
* updatedAt

Email addresses are uniquely indexed to prevent duplicate user accounts.

---

## Project Model

The Project model stores project information.

Main fields include:

* name
* description
* color
* category
* status
* dueDate
* progress
* teamMembers
* createdAt
* updatedAt

The `teamMembers` field contains references to MongoDB User documents.

---

## Task Model

The Task model stores Kanban tasks.

Main fields include:

* projectId
* title
* description
* status
* priority
* dueDate
* assignees
* createdAt
* updatedAt

Tasks reference their related project and assigned users through MongoDB ObjectIds.

Supported task statuses include:

```text
To Do
Doing
Done
```

Supported priorities include:

```text
Low
Medium
High
Urgent
```

---

## Activity Model

The Activity model stores workspace activity history.

Main fields include:

* user
* action
* target
* from
* to
* createdAt
* updatedAt

Activities can reference the user responsible for the activity.

---

## Calendar Event Model

The CalendarEvent model stores authenticated user's calendar and reminder events.

Main fields include:

* userId
* title
* date
* type
* color
* createdAt
* updatedAt

Calendar events are associated with individual users.

---

# Database Relationships

MongoDB references are used to connect related documents.

```text
USER
 │
 ├───────────────┐
 │               │
 │               └── ACTIVITY
 │
 ├───────────────┐
 │               │
 │               └── CALENDAR_EVENT
 │
 ├───────────────┐
 │               │
 │               └── PROJECT
 │                     │
 │                     └── TASK
 │
 └── TASK
```

More specifically:

```text
User
 ├── Projects (team member)
 ├── Tasks (assignee)
 ├── Activities
 └── Calendar Events

Project
 └── Tasks

Task
 ├── Project
 └── Users (assignees)
```

Mongoose `ObjectId` references and `populate()` are used where related document information is required by the API.

---

# Project Structure

The Week 3 project contains both the React frontend and Node/Express backend.

```text
CollabBoard/
│
├── client/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── api/
│       │   ├── apiClient.js
│       │   ├── authApi.js
│       │   ├── projectApi.js
│       │   ├── taskApi.js
│       │   ├── userApi.js
│       │   ├── activityApi.js
│       │   └── calendarApi.js
│       │
│       ├── components/
│       │   ├── layout/
│       │   └── modals/
│       │
│       ├── context/
│       │   ├── AppContext.jsx
│       │   ├── AuthContext.jsx
│       │   └── SocketContext.jsx
│       │
│       ├── hooks/
│       │   ├── useLocalStorage.js
│       │   └── useOnlineStatus.js
│       │
│       ├── pages/
│       │   ├── ActivityPage.jsx
│       │   ├── Boards.jsx
│       │   ├── CalendarPage.jsx
│       │   ├── Dashboard.jsx
│       │   ├── EmployeeDashboard.jsx
│       │   ├── Employees.jsx
│       │   ├── Login.jsx
│       │   ├── ManagerDashboard.jsx
│       │   ├── Projects.jsx
│       │   ├── Register.jsx
│       │   ├── SettingsPage.jsx
│       │   └── Tasks.jsx
│       │
│       ├── data/
│       ├── mocks/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   ├── userController.js
│   │   │   ├── activityController.js
│   │   │   └── calendarController.js
│   │   │
│   │   ├── data/
│   │   │   └── store.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── Activity.js
│   │   │   └── CalendarEvent.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── activityRoutes.js
│   │   │   └── calendarRoutes.js
│   │   │
│   │   └── seed.js
│   │
│   ├── data.json
│   ├── server.js
│   ├── package.json
│   └── .env

```

> The structure above reflects the Week 3 project structure present in the current implementation. Files that are no longer used for application persistence should be removed or clearly treated as legacy/mock files before final submission.

---

# REST API

The Week 3 backend continues to expose REST API endpoints while changing the underlying data source from mock server-side data to MongoDB.

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

Used to verify that the backend REST API is running.

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

Creates a new MongoDB user document.

Passwords are hashed using bcrypt before being stored.

---

## Login

```text
POST /api/auth/login
```

Authenticates a user against the MongoDB `users` collection.

A successful login returns a JWT authentication token.

---

## Current User

```text
GET /api/auth/me
```

Returns the currently authenticated MongoDB user.

This endpoint requires:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

# Project API

## Get Projects

```text
GET /api/projects
```

Retrieves projects from MongoDB.

Administrators/managers can access the available project data, while employee access is restricted according to project membership.

---

## Get Project

```text
GET /api/projects/:id
```

Retrieves a specific project using its MongoDB ObjectId.

---

## Create Project

```text
POST /api/projects
```

Creates a new project document in MongoDB.

---

## Update Project

```text
PATCH /api/projects/:id
```

Updates an existing MongoDB project document.

---

## Delete Project

```text
DELETE /api/projects/:id
```

Deletes a project from MongoDB.

---

## Add Project Member

```text
POST /api/projects/:id/members
```

Adds a user to a project's team member list.

---

# Task API

## Get Tasks

```text
GET /api/tasks
```

Retrieves tasks stored in MongoDB.

---

## Get Task

```text
GET /api/tasks/:id
```

Retrieves a specific task.

---

## Create Task

```text
POST /api/tasks
```

Creates a new task document in MongoDB.

---

## Update Task

```text
PATCH /api/tasks/:id
```

Updates task information such as:

* title
* description
* status
* priority
* due date
* project
* assignees

---

## Delete Task

```text
DELETE /api/tasks/:id
```

Deletes a task from MongoDB.

---

# User API

## Get Users

```text
GET /api/users
```

Retrieves users from the MongoDB `users` collection.

---

## Update User

```text
PATCH /api/users/:id
```

Updates user information.

---

## Delete User

```text
DELETE /api/users/:id
```

Deletes a user when permitted by the application's authorization rules.

---

# Activity API

## Get Activities

```text
GET /api/activities
```

Retrieves recent activity records from MongoDB.

Activities are generated for important workspace operations such as authentication and project operations.

---

# Calendar API

The calendar API stores authenticated user calendar events in MongoDB.

## Get Calendar Events

```text
GET /api/calendar
```

Retrieves the authenticated user's calendar events.

---

## Create Calendar Event

```text
POST /api/calendar
```

Creates a new calendar event.

---

## Delete Calendar Event

```text
DELETE /api/calendar/:id
```

Deletes a calendar event.

All calendar endpoints require authentication.

---

# Authentication

CollabBoard continues to use JWT bearer authentication.

The Week 3 authentication flow is:

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
 │ Query MongoDB
 ▼
User Document
 │
 │ Verify password
 ▼
JWT Token
 │
 ▼
Frontend
 │
 │ Store token
 ▼
Protected API Request
 │
 │ Authorization: Bearer TOKEN
 ▼
Auth Middleware
 │
 ▼
MongoDB-backed Controller
```

JWT authentication protects application resources while MongoDB provides persistent user data.

---

# MongoDB Persistence

Week 2 used temporary/mock server-side data.

Week 3 replaces the main application data source with MongoDB.

### Week 2

```text
React
  │
  ▼
Express
  │
  ▼
Mock/In-memory data
```

### Week 3

```text
React
  │
  ▼
Express
  │
  ▼
Mongoose
  │
  ▼
MongoDB Atlas
```

This allows application data to remain available after restarting the backend server.

---

# Database Seeding

The project contains:

```text
server/src/seed.js
```

The seed script creates initial CollabBoard database data.

It:

1. Connects to MongoDB Atlas
2. Clears existing seeded data
3. Creates demo users
4. Creates projects
5. Creates tasks
6. Creates activities
7. Creates calendar events

The backend provides the following seed command:

```bash
npm run seed
```

The seed script is intended for development/demo database setup.

---

# Demo Accounts

The seeded development database contains demo accounts.

### Project Manager

```text
Email:
manager@collabboard.com

Password:
password123
```

### Employee

```text
Email:
employee@collabboard.com

Password:
password123
```

These credentials are intended for local development and demonstration only.

---

# Frontend API Integration

The React frontend communicates with the MongoDB-backed Express API using Axios.

The API services include:

```text
authApi
projectApi
taskApi
userApi
activityApi
calendarApi
```

The central API client:

```text
client/src/api/apiClient.js
```

is responsible for:

* Sending HTTP requests
* Setting the API base URL
* Sending JSON data
* Attaching JWT bearer tokens
* Handling API responses
* Handling unauthorized requests
* Clearing invalid authentication sessions

---

# Offline Support

Week 3 introduces frontend caching to improve application behavior when the backend or internet connection is temporarily unavailable.

The application uses localStorage-based caches for user-specific application data.

Examples include:

```text
collabboard_projects_cache
collabboard_tasks_cache
collabboard_activities_cache
collabboard_calendar_cache
```

The cache is scoped to the authenticated user.

---

# Offline Data Flow

The frontend follows this general process:

```text
Application Start
       │
       ▼
Check Authentication
       │
       ▼
Load Cached Data
       │
       ▼
Display Available Data
       │
       ├──────── Online ────────► Fetch MongoDB API Data
       │                                │
       │                                ▼
       │                         Update Application
       │                                │
       │                                ▼
       │                         Update Local Cache
       │
       └──────── Offline ───────► Use Cached Data
```

When the application reconnects, it attempts to retrieve fresh information from the API.

---

# Offline Indicator

The frontend contains an offline status mechanism.

Relevant components/hooks include:

```text
client/src/components/layout/OfflineIndicator.jsx
client/src/hooks/useOnlineStatus.js
```

The application can detect whether the browser is currently online.

If the user is offline, previously cached application data can continue to be displayed.

---

# User-Scoped Caching

Application caches are associated with the authenticated user.

For example:

```text
collabboard_projects_cache_<userId>
collabboard_tasks_cache_<userId>
collabboard_activities_cache_<userId>
collabboard_calendar_cache_<userId>
```

This prevents cached application data from being incorrectly shared between different user accounts on the same browser.

---

# Week 3 Features

## 1. MongoDB Atlas Integration

The Express backend is connected to MongoDB Atlas through Mongoose.

The database connection is configured in:

```text
server/src/config/db.js
```

---

## 2. Persistent Authentication

Users are stored in MongoDB rather than only in mock arrays.

Registration creates a persistent User document.

Login retrieves the user from MongoDB and verifies the stored password hash.

---

## 3. Persistent Projects

Projects are stored in the MongoDB `projects` collection.

Project operations now operate on database documents rather than temporary arrays.

---

## 4. Persistent Tasks

Tasks are stored in the MongoDB `tasks` collection.

Tasks maintain references to their related projects and assigned users.

---

## 5. Persistent Activities

Workspace activities are stored in the MongoDB `activities` collection.

This allows activity history to remain available after server restarts.

---

## 6. Persistent Calendar Events

Calendar events are stored in the MongoDB `calendarevents` collection.

Events are associated with authenticated users.

---

## 7. MongoDB Relationships

Mongoose references connect:

```text
Users
  │
  ├── Projects
  ├── Tasks
  ├── Activities
  └── Calendar Events

Projects
  │
  └── Tasks
```

---

## 8. Offline Data Caching

The frontend stores successfully retrieved API data in localStorage.

Cached data can be used when the application temporarily loses network connectivity.

---

## 9. Automatic Data Refresh

When connectivity is restored, the application attempts to retrieve fresh data from the MongoDB-backed API.

Fresh API responses replace the existing cached data.

---

# Mock Data Migration

Week 2 used temporary server-side mock data.

Week 3 changes the primary persistence mechanism to MongoDB.

```text
WEEK 2

Express
  │
  ▼
Mock Store
  │
  └── Temporary data


WEEK 3

Express
  │
  ▼
Mongoose
  │
  ▼
MongoDB Atlas
  │
  └── Persistent data
```

The project still contains some legacy/mock data files from the earlier milestone.

These files should not be treated as the primary data source for the Week 3 application.

---

# Postman API Testing

The MongoDB-backed REST APIs are tested using Postman.

Testing includes:

* Health check
* User registration
* User login
* Current authenticated user
* Protected routes
* Project retrieval
* Project creation
* Project update
* Project deletion
* Task retrieval
* Task creation
* Task update
* Task deletion
* User retrieval
* Activity retrieval
* Calendar event creation
* Calendar event retrieval
* Calendar event deletion
* Invalid authentication
* Invalid ObjectId handling
* Validation errors

---

# Database Testing

MongoDB Atlas is used to verify that API operations are actually persisted.

The following collections should be available:

```text
users
projects
tasks
activities
calendarevents
```

After creating or updating data through the API, the corresponding MongoDB document should reflect the change.

---

# Running the Application

## Prerequisites

Install:

* Node.js
* npm
* Git
* MongoDB Atlas account
* Postman

---

# Clone the Repository

```bash
git clone https://github.com/CollabBoard-Team-Full-Stack-Development/CollabBoard-Full-Stack-Development-Commits.git
```

Navigate into the project:

```bash
cd CollabBoard-Full-Stack-Development-Commits
```

---

# Backend Installation

Navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

# Configure MongoDB Environment

Create a `.env` file inside:

```text
server/.env
```

Example:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_connection_string
```

Replace the MongoDB URI with the connection string from the MongoDB Atlas cluster.

Do not commit `.env` or private credentials to GitHub.

---

# Seed the MongoDB Database

After configuring the MongoDB connection:

```bash
npm run seed
```

This creates the initial CollabBoard demo data.

---

# Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

The API base URL is:

```text
http://localhost:5000/api
```

---

# Frontend Installation

Open another terminal.

Navigate to:

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

The frontend is normally available at:

```text
http://localhost:5173
```

---

# Running Frontend and Backend Together

Both applications must be running.

```text
Terminal 1
──────────

cd server
npm run dev

        │
        ▼

localhost:5000


Terminal 2
──────────

cd client
npm run dev

        │
        ▼

localhost:5173
```

The frontend communicates with the MongoDB-backed Express API.

---

# Testing

Week 3 testing focuses on database persistence, API functionality, authentication, and offline behavior.

The team verifies:

* MongoDB Atlas connection works
* MongoDB database is accessible
* Collections are created correctly
* Seed data is inserted successfully
* User registration creates MongoDB documents
* Login retrieves users from MongoDB
* Password verification works
* JWT authentication works
* Protected endpoints reject unauthenticated requests
* Projects are stored in MongoDB
* Projects can be created
* Projects can be updated
* Projects can be deleted
* Tasks are stored in MongoDB
* Tasks can be created
* Tasks can be updated
* Tasks can be deleted
* User information is retrieved from MongoDB
* Activities are persisted
* Calendar events are persisted
* MongoDB references work correctly
* API responses contain the expected data
* Frontend receives MongoDB-backed API data
* Frontend cache is updated
* Cached data remains available offline
* Fresh data is retrieved after reconnection
* No major console errors occur
* No broken API requests remain

---

# Production Build

The frontend production build can be tested using:

```bash
npm run build
```

A successful build confirms that the React application can be compiled successfully.

---

# GitHub Team Workflow

The project continues to use the team's branch-based Git workflow.

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

The repository history should contain visible contributions from all nine team members.

---

# Assignment 03

The Week 3 milestone represents the transition from temporary mock data to persistent database-backed application data.

```text
Assignment 02
     │
     ▼
Working REST APIs
     │
     ▼
Mock Server Data
     │
     ▼
Assignment 03
     │
     ▼
MongoDB + Mongoose
     │
     ▼
Persistent Data
     │
     ▼
Offline Caching
```

---

# Documentation and Evidence

The Week 3 documentation should provide evidence of:

* MongoDB Atlas account/cluster
* MongoDB Atlas connection
* `CollabBoard` database
* `users` collection
* `projects` collection
* `tasks` collection
* `activities` collection
* `calendarevents` collection
* Mongoose models
* Database connection configuration
* Database seed operation
* Persistent API operations
* JWT authentication
* Postman API testing
* MongoDB-backed frontend integration
* Offline caching
* Offline indicator
* Login page
* Manager dashboard
* Employee dashboard
* Projects page
* Tasks page
* Kanban board
* Team Members page
* Calendar and reminders
* Workspace activity
* Settings page
* Final database schema/UML diagram

---

# Final CollabBoard Database Schema

The final Week 3 database contains the following main entities:

```text
                         USER
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ▼             ▼             ▼
        PROJECT          TASK       ACTIVITY
            │             │
            │             │
            └──────► TASK │
                          │
                          ▼
                         USER

USER
 │
 ▼
CALENDAR_EVENT
```

The final database schema should document the relationships between:

```text
USER
PROJECT
TASK
ACTIVITY
CALENDAR_EVENT
```

---

# Week 3 Scope

This repository represents the **Week 3 implementation**.

The primary focus of this milestone is:

```text
MongoDB Atlas
      +
Mongoose
      +
Persistent Database Data
      +
REST API
      +
JWT Authentication
      +
React Integration
      +
Offline Caching
```

The project has moved beyond temporary mock server-side persistence and now uses MongoDB as the primary application data store.

---

# Future Milestones

The following features are planned for later milestones:

* Automated testing and CI pipelines
* Full real-time synchronization using Socket.io
* Docker containerization
* Production deployment
* Additional production-level optimizations

---

# Assignment 03 Completion Checklist

| Requirement                   | Status    |
| ----------------------------- | --------- |
| React frontend                | Completed |
| Node.js backend               | Completed |
| Express REST API              | Completed |
| MongoDB Atlas                 | Completed |
| Mongoose integration          | Completed |
| MongoDB connection            | Completed |
| User model                    | Completed |
| Project model                 | Completed |
| Task model                    | Completed |
| Activity model                | Completed |
| Calendar Event model          | Completed |
| Persistent user data          | Completed |
| Persistent project data       | Completed |
| Persistent task data          | Completed |
| Persistent activity data      | Completed |
| Persistent calendar data      | Completed |
| JWT authentication            | Completed |
| Protected API routes          | Completed |
| MongoDB relationships         | Completed |
| Database seeding              | Completed |
| Frontend API integration      | Completed |
| Offline caching               | Completed |
| Online/offline detection      | Completed |
| Postman API testing           | Completed |
| MongoDB database verification | Completed |
| GitHub repository             | Completed |
| README documentation          | Completed |

---

# Project Status

**Project:** CollabBoard

**Milestone:** Assignment 03 — MongoDB/Mongoose Persistence and Offline Support

**Status:** Week 3 Development Completed

**Architecture:** React + Node.js + Express + MongoDB

**Database:** MongoDB Atlas

**ODM:** Mongoose

**Authentication:** JWT Bearer Authentication

**Password Security:** bcryptjs

**Data Persistence:** MongoDB

**Offline Support:** localStorage-based user-scoped caching

**API Testing:** Postman

**Team Size:** 9 Members

**Previous Milestone:** Assignment 02 — Working REST APIs with Mock Data Integrated with Frontend

**Current Milestone:** Assignment 03 — MongoDB/Mongoose Persistence and Offline Support
