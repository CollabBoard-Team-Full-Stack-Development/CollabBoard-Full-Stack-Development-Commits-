# Project Overview

**CollabBoard** is a full-stack collaborative Kanban task management application designed to help teams create projects, manage tasks, assign responsibilities, monitor progress, and collaborate through a shared workspace.

The application was developed progressively from a React-based frontend into a full-stack system using **React, Node.js, Express.js, MongoDB, Mongoose and JWT authentication**.

The final application provides:

* User registration and secure login
* JWT-based authentication and protected API routes
* Project creation, viewing, updating and deletion
* Task creation, viewing, updating, moving and deletion
* Task assignment to team members
* Kanban board management using To Do, Doing and Done columns
* Activity tracking
* Calendar event management
* Persistent MongoDB database storage
* Client-side localStorage caching
* Offline/online state detection
* REST API integration between frontend and backend
* Real-time collaboration using Socket.IO
* Concurrent task-edit conflict detection
* Docker-based local application setup using Docker Compose
* Publicly accessible application deployment

---

# Final Project Status

**Project:** CollabBoard

**Final Stage:** Full-Stack Collaborative Task Management Application

**Status:** Final Product Development Completed

**Architecture:** React + Node.js + Express + MongoDB

**Database:** MongoDB Atlas

**ODM:** Mongoose

**Authentication:** JWT Bearer Authentication

**Password Security:** bcryptjs

**Data Persistence:** MongoDB

**Client Persistence:** localStorage-based user-scoped caching

**Real-Time Communication:** Socket.IO

**Concurrency Handling:** Optimistic concurrency control with conflict detection

**Containerisation:** Docker + Docker Compose

**API Testing:** Postman

**Deployment:** Existing public Vercel deployment

**Team Size:** 9 Members

---

# Final Product Features

## Authentication

Users can register and log in to the system securely.

Authentication is implemented using JWT bearer tokens. Protected API routes verify the authentication token before allowing access to protected resources.

Passwords are securely hashed using bcryptjs before being stored in MongoDB.

---

## Project Management

Authenticated users can work with projects through the REST API and React frontend.

Project functionality includes:

* View projects
* Create projects
* Update projects
* Delete projects
* View project details
* Manage project members

---

## Task Management

CollabBoard provides a Kanban-style task management system.

Users can:

* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Assign tasks
* Change task status
* Set priorities
* Set due dates
* Move tasks between Kanban columns

The main Kanban workflow is:

```text
To Do → Doing → Done
```

---

# MongoDB Persistence

MongoDB Atlas is used as the persistent database for the application.

Mongoose provides the schema and model layer between the Express backend and MongoDB.

The main collections include:

```text
users
projects
tasks
activities
calendarevents
```

Application data remains available after server restarts because MongoDB is used as the primary persistent data store.

---

# Offline Support

The frontend uses localStorage to maintain user-scoped cached application data.

This provides temporary access to previously loaded information when the backend is temporarily unavailable.

The application also detects online and offline browser states and provides feedback to the user.

MongoDB remains the primary source of persistent application data.

---

# Real-Time Collaboration

CollabBoard uses **Socket.IO** to support real-time communication between connected users.

When a user makes a change to a task, the backend can broadcast the updated task information to other clients connected to the same project.

Examples of real-time events include:

```text
task_created
task_updated
task_moved
task_deleted
```

This allows connected users to see task changes without manually refreshing the page.

Project-specific Socket.IO rooms can be used to ensure that users receive updates related to the project they are currently viewing.

---

# Concurrent Edit Detection

CollabBoard uses optimistic concurrency control to reduce the risk of one user's changes silently overwriting another user's changes.

Each task maintains a version value.

When a user retrieves a task, the current version is also provided.

When the user attempts to update the task, the client sends the version that it originally received.

The backend compares the submitted version with the current database version.

```text
Submitted Version
        │
        ▼
Compare with Database Version
        │
   ┌────┴────┐
   │         │
 Match     Different
   │         │
   ▼         ▼
Update     Conflict
Task       Detected
   │         │
   ▼         ▼
Increment   409 Conflict
Version
```

If another user has already modified the task, the submitted version is no longer valid.

The server returns a `409 Conflict` response instead of silently overwriting the newer data.

The frontend can then notify the user that the task has been changed by another user and that the latest version should be reviewed.

---

# Docker and Docker Compose

The application supports containerised local execution using Docker.

The project separates the main application services into frontend and backend containers.

The Docker Compose configuration allows the services to be started together.

Example:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

This provides a consistent environment for running the application locally without requiring the frontend and backend to be configured independently.

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
* **Socket.IO Client**
* **localStorage**

## Backend

* **Node.js**
* **Express.js**
* **Mongoose**
* **MongoDB Atlas**
* **JWT**
* **bcryptjs**
* **Socket.IO**
* **CORS**
* **dotenv**

## DevOps

* **Docker**
* **Docker Compose**
* **Vercel**

## API Testing

* **Postman**

---

# System Architecture

```text
                    CollabBoard
                         │
          ┌──────────────┴──────────────┐
          │                             │
     React Client                  Express Server
          │                             │
     ┌────┴────┐                  ┌─────┴─────┐
     │         │                  │           │
 REST API  Socket.IO          Controllers  Middleware
     │         │                  │           │
     └────┬────┘                  └─────┬─────┘
          │                             │
          └──────────────┬──────────────┘
                         │
                    Mongoose ODM
                         │
                         ▼
                   MongoDB Atlas
                         │
              ┌──────────┼──────────┐
              │          │          │
            Users     Projects     Tasks
                         │
                    Activities
                         │
                  Calendar Events
```

---

# REST API

The application provides RESTful API endpoints for the main system resources.

The main API areas include:

```text
/api/auth
/api/projects
/api/tasks
/api/users
/api/activities
/api/calendar
```

The complete API contract and endpoint information are available in:

```text
API.md
```

---

# Running the Application

## Prerequisites

Install:

* Node.js
* npm
* Git
* MongoDB Atlas account
* Docker Desktop
* Postman

---

## Backend

```bash
cd server
npm install
npm start
```

The backend runs locally on:

```text
http://localhost:5000
```

---

## Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

---

## Environment Variables

Create:

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

The actual MongoDB connection string and JWT secret should not be committed to GitHub.

---

# Docker Setup

The application can also be started using Docker Compose.

```bash
docker compose up --build
```

To stop the application:

```bash
docker compose down
```

---

# Public Deployment

The existing public deployment is retained for the final project.

**Deployed Application:**

https://collab-board-full-stack-development-sigma.vercel.app

The deployment provides access to the running CollabBoard frontend.

For production real-time functionality, the Socket.IO client must use the configured deployed backend URL rather than the local development address.

---

# Known Limitations

* Offline support uses client-side caching and is not a complete offline-first synchronization system.
* Concurrent editing is handled through conflict detection rather than automatic merging of conflicting changes.
* Real-time synchronization depends on an active Socket.IO backend connection.
* The application is intended primarily as a university full-stack project and is not designed as an enterprise-scale production system.
* MongoDB Atlas is required for persistent database functionality.

---

# Development Progression

CollabBoard was developed through multiple milestones.

### Assignment 01 — Static Frontend

The initial application focused on:

* React interface
* Kanban board
* Reusable components
* Mock data
* Routing
* Responsive UI

### Assignment 02 — REST API

The second stage introduced:

* Node.js
* Express.js
* REST API
* JWT authentication
* Frontend API integration
* CRUD operations

### Assignment 03 — Persistence and Offline Support

The third stage introduced:

* MongoDB Atlas
* Mongoose
* Persistent database models
* MongoDB relationships
* Database seeding
* Frontend caching
* Offline/online detection

### Final Product

The final stage extends the application with:

* Real-time Socket.IO communication
* Collaborative task updates
* Concurrent edit conflict detection
* Docker containerisation
* Docker Compose local execution
* Final deployment and documentation

---

# Project Requirements Status

| Requirement                       | Status    |
| --------------------------------- | --------- |
| React frontend                    | Completed |
| Reusable components               | Completed |
| Express REST API                  | Completed |
| CRUD operations                   | Completed |
| JWT authentication                | Completed |
| Protected routes                  | Completed |
| MongoDB persistence               | Completed |
| Mongoose models                   | Completed |
| Database relationships            | Completed |
| Frontend API integration          | Completed |
| Offline caching                   | Completed |
| Online/offline detection          | Completed |
| Real-time Socket.IO communication | Completed |
| Concurrent edit detection         | Completed |
| Docker containerisation           | Completed |
| Docker Compose setup              | Completed |
| Public deployment                 | Completed |
| API documentation                 | Completed |
| GitHub repository                 | Completed |

---

# Final Project Summary

CollabBoard is a full-stack collaborative Kanban application that combines a modern React frontend with an Express REST API and MongoDB persistence.

The system supports authentication, project and task management, offline client-side caching, real-time collaboration, concurrent edit detection and containerised local execution.

The final architecture demonstrates the integration of:

```text
React
+
Node.js
+
Express
+
MongoDB
+
Mongoose
+
JWT
+
Socket.IO
+
Docker
+
Docker Compose
```

The project provides a complete foundation for collaborative task management while demonstrating key full-stack development concepts including frontend development, REST API design, database persistence, authentication, real-time communication, concurrency control and DevOps practices.
