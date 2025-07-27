# NUSphere Frontend

## 🛠 Tech Stack
- **React** (with Vite) – Modern SPA framework
- **TypeScript** – Type safety for React and API calls
- **React Router** – Client-side routing
- **Tailwind CSS** – Utility-first styling (if used)
- **Firebase** – Authentication
- **Axios** – API requests
- **WebSocket** – Real-time collaboration
- **React Icons** – Icon library

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components (forms, modals, lists, etc.)
├── contexts/        # React context providers for auth, timetable, websocket
├── functions/       # API utilities, hooks, and helpers
├── pages/           # Main route pages (Forum, Timetable, Modules, etc.)
├── assets/          # Static assets (images, SVGs)
├── App.tsx          # App root, context providers, router
├── router.tsx       # Route definitions
├── constants.ts     # App-wide constants (API URLs, etc.)
├── firebase.ts      # Firebase config and initialization
├── main.tsx         # Vite entry point
└── styles/          # Global styles (Tailwind, etc.)
```

## 🚀 Main Features
- **Authentication**: Firebase-based login, signup, password reset, and email verification.
- **Timetable Management**: View, edit, and share your NUS timetable. Add custom events, register modules, and manage classes.
- **Forum**: Post questions, join groups, comment, like, and tag posts. Nested comments and group forums supported.
- **Class Swap**: Request and manage class swaps with other students.
- **Module Search**: Search and browse NUS modules, view details, and register.
- **Resource Sharing**: Share and access resources in forum groups (files, links, etc.).
- **Real-Time Collaboration**: Join rooms for collaborative timetable editing and see live updates via WebSocket.
- **AI Summaries**: Get AI-generated summaries of forum discussions (via backend integration).
- **Settings**: Manage your profile, change password, and link Telegram.
- **Responsive UI**: Modern, mobile-friendly design with Tailwind CSS.

## 🗂️ Key Pages & Navigation
- `/auth` – Login, signup, and password reset
- `/timetable` – Main timetable view and editor
- `/modules` – Module search and details
- `/forum` – Forum home (posts, groups, my posts, group resources)
- `/swap` – Class swap requests and management
- `/settings` – User settings and profile
- `/room` – Real-time collaboration rooms
- `/email-verification`, `/email-verified` – Email verification flows

## 🧩 State Management (Contexts)
- **AuthContext**: Tracks current user, authentication state, ID token, Telegram ID, and username. Handles login/logout and user profile fetch.
- **TimetableContext**: Manages timetable data, events, modules, and class registration. Provides functions to update, add, or remove events and modules.
- **WebSocketContext**: Handles WebSocket connection, room management, and real-time data sync for collaborative features.

## 🌐 API & Backend Integration
- **API Layer**: All backend calls are made via Axios (see `functions/axiosApi.ts`).
- **Endpoints**: Interacts with backend for authentication, timetable, forum, class swap, and more.
- **Token Handling**: Automatically attaches Firebase ID token to all API requests.
- **Hooks**: Custom React hooks for fetching posts, modules, timetable data, etc.

## 🔄 Real-Time Features
- **WebSocket**: Used for collaborative timetable editing and room-based updates. Handles user join/leave, data sync, and live changes.
- **Context-driven**: WebSocket state and data are managed via `WebSocketContext` and consumed throughout the app.

## 🧱 How to Extend the Frontend
- **Add Pages**: Create new route pages in `pages/` and add to `router.tsx`.
- **Add Components**: Build reusable UI in `components/` and compose in pages.
- **Add API Calls**: Use or extend `functions/axiosApi.ts` and related hooks.
- **Add State**: Use or extend context providers in `contexts/` for global state.
- **Add Real-Time Features**: Extend `WebSocketContext` and backend WebSocket events.

## 📝 Development & Linting
- Uses ESLint with recommended and type-aware rules for React and TypeScript.
- See `eslint.config.js` for configuration and plugin suggestions.

---

This is a production-grade frontend for the NUSphere platform. For backend details, see the `/docs/backend/README.md` in the main repo.
