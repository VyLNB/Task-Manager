# Task Manager Platform

A comprehensive, scalable, and modern full-stack task and time management platform built with the MERN stack. It streamlines project tracking, team collaboration, and timesheet approvals through a highly responsive and intuitive glassmorphism-inspired UI.

## Key Features

### 1. Authentication & Security
* **Secure Auth:** JWT-based authentication combined with HTTP-only cookies to mitigate XSS vulnerabilities.
* **Role-Based Access Control (RBAC):** Dynamic role and permission management. Allows fine-grained access control (e.g., Admin, Project Manager, Member) across the system.

### 2. Workspace & Project Management
* **Workspaces:** Create isolated project environments.
* **Member Allocation:** Dynamically add or remove members to projects and assign Project Managers (Leaders).
* **Data Isolation:** Ensures task and timesheet data is strictly isolated within designated workspaces.

### 3. Task Management & Kanban Board
* **Interactive Kanban Workflow:** HTML5 drag-and-drop board for tracking task statuses (`TO DO`, `IN PROGRESS`, `BLOCKED`, `COMPLETED/DONE`).
* **Task Details:** Supports priority levels, tags, deadlines, and member assignments.
* **Subtasks:** Granular checklists within main tasks to track completion progress.
* **Progress Tracking:** Automatic progress percentage tracking and actual time calculations.

### 4. Timesheet & Time Tracking Workflow
* **Time Logging:** Log exact hours, start/end times, and task results (requires task to be `IN PROGRESS`).
* **Daily Aggregation:** Automatically groups individual time logs into Daily Timesheets.
* **Approval Hierarchy:** 
  * Members submit their daily timesheets.
  * Project Managers review, approve, or reject (with required feedback/comments) timesheets.
* **Timesheet History:** Comprehensive logs for users to track their historical time allocations.

### 5. Admin Dashboard & System Analytics
* **Real-time Analytics:** Centralized dashboard utilizing complex MongoDB aggregations to process and visualize task metrics, resource bottlenecks, and project progress.
* **Personnel Management:** Manage all system users, toggle active/inactive status, and assign roles.
* **Role Management:** Interface to create custom roles and toggle specific granular permissions (e.g., `CREATE_TASK`, `MANAGE_USERS`).
* **Global Timesheet Stats:** Administrators can view total logged, approved, and pending hours across the entire system.

### 6. Modern UI/UX
* **Glassmorphism Aesthetic:** Modern, dark-themed UI built with TailwindCSS.
* **Optimistic UI:** Ensures seamless drag-and-drop and status updates without redundant backend API synchronization delays.
* **Responsive Design:** Consistent user experience across varying screen sizes.

---

## Technology Stack

### Frontend
* **Core:** React, TypeScript, Vite
* **Styling:** TailwindCSS (Utility-first, Glassmorphism)
* **Icons:** Lucide React
* **Routing:** React Router DOM

### Backend
* **Core:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), HTTP-only Cookies
* **Data Processing:** Mongoose Aggregation Pipelines

---

## Getting Started

### Prerequisites
* Node.js (v16+)
* MongoDB (Local or Atlas Cluster)

### Installation
1. Clone the repository.
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running Locally
1. Start the backend server (ensure your `.env` is configured with MongoDB URI and JWT secrets):
   ```bash
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
