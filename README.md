# CollabBoard — Collaborative Kanban Platform

## Week 1 — Static Front-End

CollabBoard is a collaborative Kanban-style task management application developed as part of the Full Stack Application project.

This repository contains the **Week 1 implementation**, focusing on the static React frontend, reusable UI components, Kanban board interface, mock data, application layout, and initial project architecture.

---

## Week 1 Objectives

The main objectives completed during Week 1 are:

Set up the React application
Create the main application structure
Build reusable React components
Design the CollabBoard dashboard
Create the Kanban board interface
Create To Do, Doing, and Done columns
Create reusable task cards
Add mock project/task/user data
Create the login interface
Create the initial responsive dark-themed UI
Prepare the project repository and Git workflow
Create the component tree
Create the initial wireframes

These tasks correspond to the **M1 — Static Front-End Skeleton** milestone in the project brief.

---

#  Technical Stack

**React 18** — Frontend framework
**Vite** — Development and build tool
**React Router v6** — Frontend routing
**Tailwind CSS** — Styling
**Lucide React** — Icons
**Framer Motion** — Animations
**React Context API** — Application state
**localStorage** — Client-side persistence

---

#  Week 1 Project Structure

```text
CollabBoard/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   │
│   │   ├── layout/
│   │   │   ├── ActivityItem.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskColumn.jsx
│   │   │   └── TeamMember.jsx
│   │   │
│   │   └── modals/
│   │       └── NewTaskModal.jsx
│   │
│   ├── context/
│   │   └── AppContext.jsx
│   │
│   ├── data/
│   │   ├── activities.js
│   │   ├── project.js
│   │   ├── tasks.js
│   │   └── users.js
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

#  Component Structure

The Week 1 frontend is organised using reusable React components.

```text
App
│
├── Login
│   └── Logo
│
└── Dashboard
    │
    ├── Sidebar
    │
    ├── Navbar
    │   └── SearchBar
    │
    ├── DashboardHeader
    │
    ├── StatsCard
    │
    ├── Kanban Board
    │   │
    │   ├── TaskColumn
    │   │   └── TaskCard
    │   │
    │   ├── TaskColumn
    │   │   └── TaskCard
    │   │
    │   └── TaskColumn
    │       └── TaskCard
    │
    ├── ActivityItem
    │
    └── TeamMember
```

The component structure supports the requirement for reusable React components and provides the foundation for the later development of the application.

---

#  Week 1 Features

## 1. Login Interface

A frontend login page has been created with:

Email input
Password input
Password visibility control
Remember-me option
Login button
CollabBoard branding
Dark-themed interface

The login page is currently a **frontend interface only**.

---

## 2. Dashboard

The main dashboard provides an overview of the project and contains:

 Navigation sidebar
Top navigation bar
Search interface
Dashboard header
Task statistics
Kanban board
Team members
Recent activity

---

## 3. Kanban Board

The main task management interface contains three workflow columns:

```text
┌──────────────┐
│    TO DO     │
├──────────────┤
│    Tasks     │
└──────────────┘

┌──────────────┐
│    DOING     │
├──────────────┤
│    Tasks     │
└──────────────┘

┌──────────────┐
│     DONE     │
├──────────────┤
│    Tasks     │
└──────────────┘
```

Each column is implemented using the reusable `TaskColumn` component.

---

## 4. Task Cards

Individual tasks are displayed using the reusable `TaskCard` component.

Task cards can display:

 Task title
Task description
Priority
Category/tag
Due date
Assigned users
Task status

---

## 5. Mock Data

The Week 1 application uses frontend mock data for:

Projects
Tasks
Users
Activities

This allows the static frontend to demonstrate the intended application interface before backend functionality is introduced.

---

## 6. New Task Modal

A reusable `NewTaskModal` component provides the initial user interface for creating a task.

The Week 1 implementation focuses on the frontend interaction and visual design.

---

## 7. Team & Activity Interface

The dashboard includes:

Team member information
User avatars
Recent activity
Activity items

These components currently use mock data.

---

#  UI Design

The Week 1 interface follows a modern dark-themed design.

### Design characteristics

Dark background
Purple accent colour
Rounded cards
Modern typography
onsistent spacing
Responsive layout
Lucide icons
Subtle Framer Motion animations
Reusable Tailwind CSS styling

---

#  Client-Side State

The application uses:

```text
React Context API
```

for shared application state.

A custom:

```text
useLocalStorage
```

hook is also included for client-side persistence.

These provide the initial frontend state management foundation for the application.

---

#  Running the Week 1 Application

## Prerequisites

Install:

* Node.js
* npm

---

## Install Dependencies

Clone the organization's repository:

```bash
git clonehttps://github.com/CollabBoard-Team-Full-Stack-Development/CollabBoard.git
```

Navigate into the project:

```bash
cd CollabBoard
```

Install dependencies:

```bash
npm install
```

---

## Start Development Server

Run:

```bash
npm run dev
```

Vite will provide a local address similar to:

```text
http://localhost:3000
```

Open the displayed address in your browser.

---

#  Week 1 Testing

The Week 1 testing process focuses on frontend functionality and integration.

The team checks:

Application starts successfully
Login page loads
Dashboard loads
Navigation components render correctly
Kanban columns render correctly
Task cards display correctly
Mock data appears correctly
New task modal opens correctly
Responsive layout works
No major console errors
No broken imports
Production build completes successfully

Production build can be checked using:

```bash
npm run build
```

---

# 🌿 GitHub Team Workflow

The Week 1 project uses a branch-based workflow.

```text
main
│
├── member-01-core
├── member-02-navigation
├── member-03-components
├── member-04-dashboard
├── member-05-kanban
├── member-06-task-activity
├── member-07-login
├── member-08-data
└── member-09-styling
```

Each member works on their assigned branch.

Completed work is pushed to GitHub and merged into the `main` branch after integration/review.

The project brief specifically states that Git history is considered during grading and recommends feature branches and pull requests.

---

#  Week 1 Team Work Division

| Member    | Week 1 Responsibility       |
| --------- | --------------------------- |
| Member 01 | Application Core & Context  |
| Member 02 | Navigation                  |
| Member 03 | Reusable UI Components      |
| Member 04 | Dashboard & Statistics      |
| Member 05 | Kanban Board                |
| Member 06 | Task Creation & Activity    |
| Member 07 | Login Interface             |
| Member 08 | Mock Data                   |
| Member 09 | Styling, QA & Documentation |

Each member contributes through their assigned Git branch.

---

# 📐 Week 1 Documentation

The Week 1 project documentation includes:

```text
docs/
│
├── component-tree.md
│
├── wireframes/
│   ├── login-wireframe.png
│   └── dashboard-wireframe.png
│
└── members/
    ├── member-01.md
    ├── member-02.md
    ├── member-03.md
    ├── member-04.md
    ├── member-05.md
    ├── member-06.md
    ├── member-07.md
    ├── member-08.md
    └── member-09.md
```

These documents provide evidence of the Week 1 design process, component architecture, wireframes, and individual contributions.

---

#  Week 1 Completion Checklist

| Week 1 Requirement           
| ---------------------------- 
| React application scaffolded 
| Reusable React components    
| Board UI                     
| Column UI                    
| TaskCard UI                  
| Mock data                   
| Dashboard                    
| Login interface              
| Component tree               
| Wireframes                   
| GitHub repository            
| Team branches                
The completed items directly correspond to the M1 static frontend milestone described in the project brief.

---

#  Week 1 Scope

This repository represents **Week 1 only**.

The focus of this milestone is the frontend foundation and static application interface. Backend APIs, database persistence, automated testing, real-time communication, Docker, and public deployment are outside the scope of the Week 1 implementation.

---

## Project Status

**Milestone:** M1 — Static Front-End Skeleton

**Status:** Week 1 Development Completed

**Application:** CollabBoard

**Team Size:** 9 Members
