# CollabBoard — Collaborative Kanban Platform

CollabBoard is a collaborative Kanban task management application developed as a Full Stack Application project.

The application allows users to manage projects, tasks, team members, activities, and task workflows through a modern Kanban-style interface.

## Features

* User registration and login
* JWT authentication
* Protected API routes
* User management
* Project management
* Task management
* Kanban board
* To Do, Doing, and Done task statuses
* Task priorities and due dates
* Task assignments
* Activity tracking
* Calendar functionality
* Responsive dark-themed interface

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Framer Motion
* Lucide React

### Backend

* Node.js
* Express.js
* JWT
* bcryptjs
* CORS
* dotenv
* REST API

## Project Structure

```text
CollabBoard/
│
├── client/
│   ├── src/
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── data/
│   │
│   ├── server.js
│   └── package.json
│
├── README.md
└── ...
```

## Running the Project

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run start
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret
```

## API

The backend provides REST API endpoints for:

* Authentication
* Users
* Projects
* Tasks
* Activities
* Calendar

Protected endpoints use JWT authentication with:

```text
Authorization: Bearer TOKEN
```

## Project Status

**CollabBoard — Full Stack Development**

The project is currently under active development.
