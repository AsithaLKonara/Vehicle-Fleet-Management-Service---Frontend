# Frontend Plan — Vehicle Fleet Management System

## Tech Stack
* Next.js (App Router)
* TypeScript
* Tailwind CSS
* React Query (@tanstack/react-query)
* Axios
* React Hook Form
* Zod

## Development Phases

### Phase 1 — Project Initialization
* Create Next.js app
* Install dependencies
* Setup folder structure:
  ```txt
  frontend/
   ├── app/
   ├── components/
   ├── services/
   ├── hooks/
   ├── lib/
   ├── types/
   └── middleware.ts
  ```

### Phase 4 — User Management UI
* User table
* Role dropdown
* Create user form

### Phase 5 — Vehicle Management UI
* Vehicle table with status badges
* Create/Edit vehicle modal
* Search & Filters (status, type, assignedTo)

### Phase 6 — Assignment Workflow UI
* Assignment form
* Return vehicle button
* Assignment history table

### Phase 7 — Dashboard
* Overview cards (Total, Available, Assigned, Maintenance)
* Recent assignments table
* Available vehicles list

### Phase 9 — E2E Testing (Playwright)
* Auth: login/logout
* RBAC: permissions
* Vehicles: CRUD
* Assignments: assign/return
* Search: filters
* Dashboard: load data

### Phase 10 — CI/CD
* Pipeline: install -> lint -> build -> playwright tests

## Testing Strategy
* Use Playwright for E2E flows.
* Ensure all critical user paths are covered.
