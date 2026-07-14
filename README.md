# Placement Eligibility Predictor

## Project Title and Description
Placement Eligibility Predictor is a React + Vite frontend project that presents a student-friendly placement dashboard. It now includes persistent authentication, theme preferences, session tracking, and full CRUD management for placement opportunities without a backend.

## New Features
- Persistent login state using Local Storage
- Auto-login on refresh and logout clearing stored auth data
- Light/Dark theme persistence using Local Storage
- Session Storage tracking for the last visited page and active search term
- Full CRUD support for placement records: add, edit, delete, and undo delete
- JSON import/export for local records
- Recent activity feed and dynamic record management UI

## Storage Mechanisms
- Local Storage: saved login user, theme preference, records, recently viewed items, and activity log
- Session Storage: last visited page and current search term during the active browser session

## React Concepts Implemented
- Dynamic Routing
- Route Parameters and useParams()
- Dynamic URL Navigation with useNavigate()
- useEffect() for persistence and side effects
- Controlled forms and CRUD state management
- Local Storage and Session Storage integration
- Responsive UI and conditional rendering

## Screenshots
- Dashboard overview with searchable opportunity cards
- CRUD form for creating and updating records
- Confirmation modal for delete actions and undo restore banner

## How to Run
1. Install dependencies: npm install
2. Start the development server: npm run dev
3. Open the local Vite URL shown in the terminal

## GitHub Submission Notes
- Continue using the same repository and push the updated implementation.
- Include meaningful commits for auth persistence, theme support, CRUD, and storage integration.
- Do not upload node_modules or environment files.
