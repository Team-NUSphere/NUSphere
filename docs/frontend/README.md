🛠 Tech Stack
React (with TypeScript) — UI framework
Vite — Fast development/build tool
Tailwind CSS — Utility-first CSS framework
Firebase — Authentication
React Router — Routing/navigation
Axios — HTTP requests
React Icons — Icon library

📁 Project Structure
src/
├── App.tsx                # Main app component, sets up providers and router
├── constants.ts           # Shared constants (e.g., backend URL)
├── firebase.ts            # Firebase config and initialization
├── contexts/              # React context providers (auth, timetable, etc.)
├── components/            # Reusable UI components (Navbar, ModItem, etc.)
├── functions/             # Custom hooks (e.g., useModuleSearch)
├── pages/                 # Top-level pages (HomePage, Login, Signup, ModList, etc.)
├── assets/                # Static assets (SVGs, images)
├── styles/                # Global styles (Tailwind, etc.)
├── main.tsx               # Entry point, renders <App />
├── router.tsx             # Route definitions for React Router

# 🔑 Key Features

### ✅ Authentication  
- Powered by Firebase  
- On successful login/signup, user is also registered in the backend database  

### 📅 Timetable Management  
- Search for modules  
- Add/remove modules from personal timetable  
- Global state managed using React Context (`TimetableProvider`)

### 🔍 Module Search  
- `ModList` uses a custom hook `useModuleSearch` to query the backend  
- Modules displayed using the `ModItem` component (with add/remove button)

### 🌐 Forum & Community *(Planned)*  
- Placeholders set up in routes and navigation

### 📱 Responsive UI  
- Tailwind CSS ensures clean, modern, mobile-friendly design

---

# 🧩 Main Components

- **App.tsx**  
  Wraps the app with `AuthProvider` and `TimetableProvider`, handles routing setup

- **Navbar / Sidebar**  
  Main navigation UI for page transitions

- **ModItem**  
  Displays individual module info and lets user register/unregister it

- **ModList**  
  Searchable, paginated module directory  

- **Pages**  

    - **AuthPage.tsx**  
    Renders the authentication form (`AuthForm` component).  
    Used for login/signup UI.

    - **HomePage.tsx**  
    The landing page of the app.  
    Shows intro, feature highlights, and stats.  
    Includes a navbar and footer with custom styles.

    - **Login.tsx**  
    Login form using Firebase authentication.  
    On success, authenticates with the backend and redirects the user.

    - **Signup.tsx**  
    Signup form using Firebase authentication.  
    On success, registers the user in the backend and redirects.

    - **ModList.tsx**  
    Main module search and registration page.  
    Uses a search bar and paginated infinite scroll.  
    Fetches modules from the backend and displays them using `ModItem`.

    - **Modules.tsx**  
    Displays details for a specific module.  
    Fetches module data from the backend using the module code from the URL.

    - **RegisteredModules.tsx**  
    Lists all modules the user has registered for.  
    Displays each as a `ModItem` with registered status.

    - **UserTimetable.tsx**  
    Page for the user's personal timetable.  
    Uses the `Timetable` component to show registered classes.  
    Includes a button/modal to add custom events.

    - **Navbar.tsx**  
    Top navigation bar.  
    Handles navigation links, sign out, and responsive menu.

    - **Sidebar.tsx**  
    Layout sidebar.  
    Contains `ModList` and `RegisteredModules` components.

    - **Timetable.tsx**  
    Timetable grid display.  
    Accepts props for start hour, total hours, and class data.  
    Uses `DayColumn` components to render the daily schedule.

---

# 🧱 How to Extend

- **Add a new page**  
  → Create a new file in `pages/` and register it in `router.tsx`  

- **Add a reusable component**  
  → Place it in `components/`  

- **Add a new global state/context**  
  → Use the `contexts/` directory  

- **Make API calls**  
  → Use `Axios`, with backend base URL defined in `constants.ts`