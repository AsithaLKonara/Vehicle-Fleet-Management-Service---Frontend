# UltraDrive Fleet - Frontend

Modern, high-performance dashboard for the Vehicle Fleet Management System.

## Tech Stack
- **Next.js 15 (App Router)**
- **TypeScript**
- **TailwindCSS** (v4)
- **React Query** (TanStack)
- **Axios**
- **Playwright** for E2E Testing

## UI Features
- **Premium Design**: Dark mode aesthetic with glassmorphism and smooth transitions.
- **Dynamic Dashboard**: Real-time operational metrics and visualizations.
- **Module Based**: Dedicated views for Users, Vehicles, and Assignments.
- **Authenticated Flow**: Secure login with persistent session management.

## Demo Credentials
To explore the application with different role permissions, use the following accounts:
- **Admin**: `admin@fleet.com` / `admin123` (Full Access)
- **Fleet Manager**: `manager@fleet.com` / `manager123` (Manage Vehicles & Assignments)
- **Fleet Staff**: `staff@fleet.com` / `staff123` (View Only)

## Getting Started

### Installation
1. Clone the repository.
2. Install dependencies: `npm install`
3. Setup `NEXT_PUBLIC_API_URL` in `.env.local`.
4. Start dev server: `npm run dev`

### Testing
- `npx playwright test`: Run end-to-end tests.

## License
ISC
