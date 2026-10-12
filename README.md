# Collaborative Task Manager – Full Stack Web Application

A complete, production-grade, responsive enterprise web application built with **React (Vite)**, **Tailwind CSS**, **Node.js (Express)**, and **PostgreSQL with Sequelize ORM**. Includes secure authentication, strict Role-Based Access Control (RBAC), task lifecycle management, immutable audit trails, agile sprint planning, developer tracking, and QA test execution with defect management.

---

## 1. System Architecture

The application implements a decoupled, modern multi-tier architecture:

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (React 19)                  │
│  - Vite Bundler & HMR          - Tailwind CSS Design   │
│  - React Router DOM            - Recharts Visuals      │
│  - Context API (Auth & Theme)  - Axios with Interceptors│
└───────────────────────────┬────────────────────────────┘
                            │ RESTful JSON APIs (JWT)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                 │
│  - Authentication & JWT Token Verification              │
│  - Role-Based Access Control (RBAC Middleware)         │
│  - Express Rate Limiting & Input Validation             │
│  - Centralized Error Handling & Audit Activity Logger   │
└───────────────────────────┬────────────────────────────┘
                            │ Sequelize ORM (Relational)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Database (PostgreSQL / SQLite)             │
│  - Users & Roles (Manager, User, Dev, QA, PM)          │
│  - Tasks, Projects, Sprints, Requirements              │
│  - Immutable TaskActivities (Audit Log) & Comments      │
│  - QA TestCases, TestRuns & Bug Tracking               │
└────────────────────────────────────────────────────────┘
```

---

## 2. Project Folder Structure

```
Collebrative/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # Sequelize config (PostgreSQL & SQLite dialect)
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, login, current user & profile
│   │   │   ├── dashboardController.js  # Role-tailored metrics & distribution stats
│   │   │   ├── projectController.js    # Projects, sprints, requirements, test runs, bugs
│   │   │   ├── taskController.js       # Task CRUD, RBAC checks, comments, audit logs
│   │   │   └── userController.js       # User directory & manager account provisioning
│   │   ├── middleware/
│   │   │   ├── auth.js             # Bearer JWT extraction & user validation
│   │   │   ├── errorHandler.js     # Centralized Sequelize and operational error handler
│   │   │   ├── rateLimiter.js      # Rate limiting for auth and API endpoints
│   │   │   ├── role.js             # Role-Based Access Control (RBAC) guard
│   │   │   └── validate.js         # express-validator result handler
│   │   ├── models/
│   │   │   ├── Bug.js              # Bug tracking & retest state
│   │   │   ├── index.js            # Sequelize relational associations & hooks
│   │   │   ├── Project.js          # High-level project initiative scopes
│   │   │   ├── Requirement.js      # Requirements traceability
│   │   │   ├── Sprint.js           # Agile sprint iterations & velocity goals
│   │   │   ├── Task.js             # Core task model with status and priority
│   │   │   ├── TaskActivity.js     # Immutable chronological audit log
│   │   │   ├── TaskComment.js      # Discussion & progress comments
│   │   │   ├── TestCase.js         # QA test definitions
│   │   │   ├── TestRun.js          # Execution history & pass/fail evidence
│   │   │   └── User.js             # User model with bcrypt hashing & role verification
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /api/auth endpoints
│   │   │   ├── dashboardRoutes.js  # /api/dashboard endpoints
│   │   │   ├── projectRoutes.js    # /api/projects, requirements, sprints, bugs
│   │   │   ├── taskRoutes.js       # /api/tasks endpoints
│   │   │   └── userRoutes.js       # /api/users endpoints
│   │   ├── seeders/
│   │   │   └── seed.js             # Database seeding script with demo accounts & tasks
│   │   ├── utils/
│   │   │   └── jwt.js              # JWT generator & verifier
│   │   └── validators/
│   │       ├── authValidator.js    # Sanitization & validation rules for registration & login
│   │       └── taskValidator.js    # Validation rules for tasks
│   ├── .env                        # Local backend environment variables
│   ├── .env.example                # Example environment template
│   ├── package.json                # Backend dependencies and scripts
│   ├── server.js                   # Express server startup entrypoint
│   └── test-mvp.js                 # Automated acceptance testing script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation bar with dark mode toggle & user menu
│   │   │   ├── Pagination.jsx      # Reusable pagination controls
│   │   │   ├── PriorityBadge.jsx   # Priority level badge (Low, Medium, High, Urgent)
│   │   │   ├── ProtectedRoute.jsx  # Route guard checking authentication and role permissions
│   │   │   ├── Sidebar.jsx         # Responsive sidebar with mobile drawer
│   │   │   └── StatusBadge.jsx     # Lifecycle status pill (To Do, In Progress, Completed...)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # User state, JWT token storage, login/logout methods
│   │   │   └── ThemeContext.jsx    # Dark/Light mode state with localStorage sync
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx      # Application layout containing Sidebar, Navbar, and Outlet
│   │   ├── pages/
│   │   │   ├── AllTasks.jsx        # Manager view with full task list, edit, delete modals
│   │   │   ├── BugTracker.jsx      # Defect logging and retesting lifecycle
│   │   │   ├── CreateTask.jsx      # Task creation form with assignee and sprint selection
│   │   │   ├── Dashboard.jsx       # Overview metrics, Recharts graphs, and recent activity
│   │   │   ├── DeveloperWorkspace.jsx # Dev hours, git branch, PR links, QA handoffs
│   │   │   ├── EditTask.jsx        # Task modification page
│   │   │   ├── KanbanBoard.jsx     # Interactive multi-column status board
│   │   │   ├── Login.jsx           # Sign in with 1-click demo accounts
│   │   │   ├── MyTasks.jsx         # Contributor view with inline status updates
│   │   │   ├── Profile.jsx         # Settings and password update
│   │   │   ├── Projects.jsx        # Project initiative management
│   │   │   ├── QATestCases.jsx     # Test cases definition and run execution
│   │   │   ├── Reports.jsx         # Analytics and velocity reports
│   │   │   ├── Requirements.jsx    # Requirements traceability matrix
│   │   │   ├── Signup.jsx          # User registration with role privilege protection
│   │   │   ├── SprintPlanning.jsx  # Sprint iterations and committed tasks
│   │   │   └── TaskDetails.jsx     # Detailed task view, comments, and audit timeline
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with JWT interceptor & 401 redirect
│   │   ├── App.jsx                 # Routing configuration
│   │   ├── index.css               # Tailwind directives and custom scrollbars
│   │   └── main.jsx                # React root mount
│   ├── index.html                  # HTML template with SEO tags and Inter font
│   ├── package.json                # Frontend dependencies
│   ├── postcss.config.js           # PostCSS plugins config
│   ├── tailwind.config.js          # Tailwind styling tokens & dark mode class
│   └── vite.config.js              # Vite bundler configuration
│
└── package.json                    # Root package with orchestrating scripts
```

---

## 3. Database Schema and Relationships

All tables are managed through Sequelize models with relational foreign keys:

- **User**: `id`, `name`, `email` (unique), `password` (bcrypt hash), `role` (`'Manager'`, `'User'`, `'Developer'`, `'QA Tester'`, `'Project Manager'`), `isActive`.
- **Task**: `id`, `title`, `description`, `status` (`'Backlog'`, `'To Do'`, `'In Progress'`, `'Code Review'`, `'Ready for QA'`, `'Completed'`), `priority` (`'Low'`, `'Medium'`, `'High'`, `'Urgent'`), `startDate`, `dueDate`, `creatorId` (FK User), `assigneeId` (FK User), `projectId` (FK Project), `sprintId` (FK Sprint), `requirementId` (FK Requirement), `estimatedHours`, `actualHours`, `branchName`, `pullRequestUrl`, `blocker`.
- **TaskActivity (Immutable Audit Log)**: `id`, `taskId` (FK Task), `actorId` (FK User), `action` (`'CREATED'`, `'STATUS_UPDATED'`, `'ASSIGNED'`, `'PRIORITY_UPDATED'`, `'DUE_DATE_UPDATED'`, `'COMMENT_ADDED'`), `fieldName`, `oldValue`, `newValue`, `details`, `createdAt`.
- **TaskComment**: `id`, `taskId` (FK Task), `userId` (FK User), `comment`, timestamps.
- **Project**: `id`, `name`, `description`, `status`, `startDate`, `endDate`, `ownerId` (FK User).
- **Sprint**: `id`, `name`, `goal`, `startDate`, `endDate`, `status` (`'Planned'`, `'Active'`, `'Closed'`), `projectId` (FK Project).
- **Requirement**: `id`, `title`, `description`, `acceptanceCriteria`, `priority`, `status` (`'Draft'`, `'Approved'`, `'In Development'`, `'In QA'`, `'Completed'`), `projectId`, `ownerId`.
- **TestCase**: `id`, `scenario`, `preconditions`, `testSteps`, `expectedResult`, `priority`, `requirementId`, `taskId`, `createdById`.
- **TestRun**: `id`, `testCaseId`, `taskId`, `testerId`, `buildVersion`, `environment`, `actualResult`, `status` (`'Not Run'`, `'Pass'`, `'Fail'`, `'Blocked'`).
- **Bug**: `id`, `summary`, `reproductionSteps`, `expectedResult`, `actualResult`, `severity`, `priority`, `status` (`'Open'`, `'Assigned'`, `'In Progress'`, `'Fixed'`, `'Ready for Retest'`, `'Closed'`, `'Reopened'`), `taskId`, `reporterId`, `assignedToId`.

---

## 4. Software Requirements & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20.x recommended)
- **npm**: v9.x or higher
- **PostgreSQL**: Optional for production (the system supports PostgreSQL and also includes an out-of-the-box SQLite dialect fallback in `.env` for zero-friction local development)

### Step 1: Install Dependencies
Open a terminal in the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 5. Environment Configuration

### Backend (`backend/.env`)
```ini
PORT=5000
NODE_ENV=development

# Database Dialect: 'postgres' or 'sqlite'
DB_DIALECT=sqlite
DB_STORAGE=./dev_database.sqlite

# If using PostgreSQL:
# DB_DIALECT=postgres
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_NAME=collaborative_task_manager
# DB_USER=postgres
# DB_PASSWORD=your_password

JWT_SECRET=collaborative_task_manager_jwt_super_secret_key_2026_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## 6. Seed the Database

Run the database seed script to automatically create the schema, relations, and initial demo accounts:

```bash
cd backend
npm run seed
```

This provisions the following default test accounts:
| Role | Email | Password | Permissions |
|---|---|---|---|
| **Manager** | `manager@company.com` | `Password123!` | Create, assign, edit, delete tasks, sprint management |
| **User** | `user@company.com` | `Password123!` | View assigned tasks, update status, add comments |
| **Developer** | `dev@company.com` | `Password123!` | Sprint tasks, branch links, PRs, actual hours, QA handoff |
| **QA Tester** | `qa@company.com` | `Password123!` | Test cases, execute test runs, file defects, retesting |

---

## 7. Starting the Application

### 1. Start Backend Server
```bash
cd backend
node server.js
```
The API starts on `http://localhost:5000`.

### 2. Start Frontend Application
In a separate terminal:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 8. Automated Acceptance Testing

An automated verification test script is included to validate the complete MVP workflow:
```bash
cd backend
node test-mvp.js
```

### Verified Test Flow:
1. Manager logs in and receives a secure JWT token.
2. User logs in with a separate account.
3. Manager creates a task and assigns it to User.
4. User queries their task list and verifies the assignment.
5. User updates status to **"In Progress"**.
6. User attempts unauthorized modification (e.g., changing title) &rarr; **Rejected with 403 Forbidden**.
7. User attempts unauthorized delete &rarr; **Rejected with 403 Forbidden**.
8. User updates status to **"Completed"**.
9. Manager inspects the task audit timeline &rarr; verifies all 4 chronological activity records with actors and timestamps.
